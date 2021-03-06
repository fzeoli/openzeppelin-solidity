

require('@openzeppelin/test-helpers');

const { MerkleTree } = require('../helpers/merkleTree.js');
const { keccakFromString, bufferToHex } = require('ethereumjs-util');

const { expect } = require('chai');

const MerkleProofWrapper = artifacts.require('MerkleProofWrapper');

describe('MerkleProof', async function () {
  beforeEach(async function () {
    this.merkleProof = await MerkleProofWrapper.new();
  });

  describe('verify', async function () {
    it('should return true for a valid Merkle proof', async function () {
      const elements = ['a', 'b', 'c', 'd'];
      const merkleTree = new MerkleTree(elements);

      const root = merkleTree.getHexRoot();

      const proof = merkleTree.getHexProof(elements[0]);

      const leaf = bufferToHex(keccakFromString(elements[0]));

      expect(await this.merkleProof.verify(proof, root, leaf)).to.equal(true);
    });

    it('should return false for an invalid Merkle proof', async function () {
      const correctElements = ['a', 'b', 'c'];
      const correctMerkleTree = new MerkleTree(correctElements);

      const correctRoot = correctMerkleTree.getHexRoot();

      const correctLeaf = bufferToHex(keccakFromString(correctElements[0]));

      const badElements = ['d', 'e', 'f'];
      const badMerkleTree = new MerkleTree(badElements);

      const badProof = badMerkleTree.getHexProof(badElements[0]);

      expect(await this.merkleProof.verify(badProof, correctRoot, correctLeaf)).to.equal(false);
    });

    it('should return false for a Merkle proof of invalid length', async function () {
      const elements = ['a', 'b', 'c'];
      const merkleTree = new MerkleTree(elements);

      const root = merkleTree.getHexRoot();

      const proof = merkleTree.getHexProof(elements[0]);
      const badProof = proof.slice(0, proof.length - 5);

      const leaf = bufferToHex(keccakFromString(elements[0]));

      expect(await this.merkleProof.verify(badProof, root, leaf)).to.equal(false);
    });
  });
});
