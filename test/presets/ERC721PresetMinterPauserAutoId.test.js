

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const ERC721PresetMinterPauserAutoId = artifacts.require('ERC721PresetMinterPauserAutoId');

describe('ERC721PresetMinterPauserAutoId', async function () {
  const [ deployer, other ] = await web3.eth.getAccounts();

  const name = 'MinterAutoIDToken';
  const symbol = 'MAIT';
  const baseURI = 'my.app/';

  const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');

  beforeEach(async function () {
    this.token = await ERC721PresetMinterPauserAutoId.new(name, symbol, baseURI, { from: deployer });
  });

  it('token has correct name', async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it('token has correct symbol', async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it('token has correct base URI', async function () {
    expect(await this.token.baseURI()).to.equal(baseURI);
  });

  it('deployer has the default admin role', async function () {
    expect(await this.token.getRoleMemberCount(DEFAULT_ADMIN_ROLE)).to.be.bignumber.equal('1');
    expect(await this.token.getRoleMember(DEFAULT_ADMIN_ROLE, 0)).to.equal(deployer);
  });

  it('deployer has the minter role', async function () {
    expect(await this.token.getRoleMemberCount(MINTER_ROLE)).to.be.bignumber.equal('1');
    expect(await this.token.getRoleMember(MINTER_ROLE, 0)).to.equal(deployer);
  });

  it('minter role admin is the default admin', async function () {
    expect(await this.token.getRoleAdmin(MINTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
  });

  describe('minting', async function () {
    it('deployer can mint tokens', async function () {
      const tokenId = new BN('0');

      const receipt = await this.token.mint(other, { from: deployer });
      expectEvent(receipt, 'Transfer', { from: ZERO_ADDRESS, to: other, tokenId });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal('1');
      expect(await this.token.ownerOf(tokenId)).to.equal(other);

      expect(await this.token.tokenURI(tokenId)).to.equal(baseURI + tokenId);
    });

    it('other accounts cannot mint tokens', async function () {
      await expectRevert(
        this.token.mint(other, { from: other }),
        'ERC721PresetMinterPauserAutoId: must have minter role to mint'
      );
    });
  });

  describe('pausing', async function () {
    it('deployer can pause', async function () {
      const receipt = await this.token.pause({ from: deployer });
      expectEvent(receipt, 'Paused', { account: deployer });

      expect(await this.token.paused()).to.equal(true);
    });

    it('deployer can unpause', async function () {
      await this.token.pause({ from: deployer });

      const receipt = await this.token.unpause({ from: deployer });
      expectEvent(receipt, 'Unpaused', { account: deployer });

      expect(await this.token.paused()).to.equal(false);
    });

    it('cannot mint while paused', async function () {
      await this.token.pause({ from: deployer });

      await expectRevert(
        this.token.mint(other, { from: deployer }),
        'ERC721Pausable: token transfer while paused'
      );
    });

    it('other accounts cannot pause', async function () {
      await expectRevert(
        this.token.pause({ from: other }),
        'ERC721PresetMinterPauserAutoId: must have pauser role to pause'
      );
    });
  });

  describe('burning', async function () {
    it('holders can burn their tokens', async function () {
      const tokenId = new BN('0');

      await this.token.mint(other, { from: deployer });

      const receipt = await this.token.burn(tokenId, { from: other });

      expectEvent(receipt, 'Transfer', { from: other, to: ZERO_ADDRESS, tokenId });

      expect(await this.token.balanceOf(other)).to.be.bignumber.equal('0');
      expect(await this.token.totalSupply()).to.be.bignumber.equal('0');
    });
  });
});
