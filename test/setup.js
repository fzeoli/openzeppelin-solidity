
const { deployRelayHub } = require('@openzeppelin/gsn-helpers');

before('deploy GSN RelayHub', async function () {
  await deployRelayHub(web3, { from: await web3.eth.getAccounts()[0] });
});
