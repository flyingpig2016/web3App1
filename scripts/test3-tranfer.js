const Contacts = artifacts.require("KerwinToken.sol");

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, "ether");
};
const toWei = (number) => {
  return web3.utils.toWei(number.toString(), "ether");
};

module.exports = async function (callback) {
  const kerwintoken = await Contacts.deployed();

  const count1 = "0x234F0F6f3789896ba27914F0462EEf4DC01443A8";
  const count2 = "0x548A5E42946B0Ad189767cD3505D415E3d0515c3";

  let res1 = await kerwintoken.balanceOf(count1);
  console.log("第一个账号的值为" + fromWei(res1));

  // 转账
  await kerwintoken.transfer(count2, toWei(10000), {
    from: count1,
  });

  let res2 = await kerwintoken.balanceOf(count1);
  console.log("第一个账号的值为" + fromWei(res2));
  callback();
};
