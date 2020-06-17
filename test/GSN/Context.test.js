

require('@openzeppelin/test-helpers');

const ContextMock = artifacts.require('ContextMock');
const ContextMockCaller = artifacts.require('ContextMockCaller');

const { shouldBehaveLikeRegularContext } = require('./Context.behavior');

describe('Context', async function () {
  const [ sender ] = await web3.eth.getAccounts();

  beforeEach(async function () {
    this.context = await ContextMock.new();
    this.caller = await ContextMockCaller.new();
  });

  shouldBehaveLikeRegularContext(sender);
});
