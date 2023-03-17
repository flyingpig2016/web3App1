const Contacts = artifacts.require("StudentStorage.sol");

module.exports = async function (callback) {
  //   console.log(1111111);
  const studentStorage = await Contacts.deployed();

  await studentStorage.setData("kerwin", 100);
  let res = await studentStorage.getData();

  console.log(res);
  callback();
};
