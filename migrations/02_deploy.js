/**
 * Module dependencies.
 */
const Contacts = artifacts.require("StudentListStorage.sol");

module.exports = function (deployer) {
  deployer.deploy(Contacts);
};
