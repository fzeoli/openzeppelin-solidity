

require('@openzeppelin/test-helpers');
const { shouldBehaveLikeEscrow } = require('./Escrow.behavior');

const Escrow = artifacts.require('Escrow');

describe('Escrow', async function () {
  const [ owner, ...otherAccounts ] = await web3.eth.getAccounts();

  beforeEach(async function () {
    this.escrow = await Escrow.new({ from: owner });
  });

  shouldBehaveLikeEscrow(owner, otherAccounts);
});
