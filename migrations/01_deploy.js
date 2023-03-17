/**
 * Module dependencies.
 */
const Contacts = artifacts.require("StudentStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(Contacts);
};
