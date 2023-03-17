const Contacts = artifacts.require("KerwinToken.sol");
const Exchange = artifacts.require("Exchange.sol");

module.exports = async function (deployer) {
  const accounts = await web3.eth.getAccounts();

  await deployer.deploy(Contacts);
  // await deployer.deploy(Exchange, "收费地址", "费率");
  await deployer.deploy(Exchange, accounts[0], 10);
};
