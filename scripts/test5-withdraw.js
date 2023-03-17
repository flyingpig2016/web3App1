const Contacts = artifacts.require("KerwinToken.sol");
const Exchange = artifacts.require("Exchange.sol");

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";

const fromWei = (bn) => {
  return web3.utils.fromWei(bn, "ether");
};
const toWei = (number) => {
  return web3.utils.toWei(number.toString(), "ether");
};

module.exports = async function (callback) {
  const kerwintoken = await Contacts.deployed();
  const exchange = await Exchange.deployed();
  const accounts = await web3.eth.getAccounts();

  //   从accounts[0]提取以太币
  //   await exchange.whithdrawEther(toWei(5), {
  //     from: accounts[0],
  //   });
  //   let res = await exchange.tokens(ETHER_ADDRESS, accounts[0]);
  //   console.log(fromWei(res));

  //账户 accounts[0]授权给交易所 exchange.address 100000钱，即授权到银行10000
  //   await kerwintoken.approve(exchange.address, toWei(300000), {
  //     from: accounts[0],
  //   });
  //从交易所提取100000 kwt类型货币到账户accounts[0]
  await exchange.whithdrawToken(kerwintoken.address, toWei(50000), {
    from: accounts[0],
  });

  //   console.log("Exchange合约对象（即交易所）地址：" + exchange.address);
  //   console.log("Kerwintoken合约对象地址：" + kerwintoken.address);
  let res1 = await exchange.tokens(kerwintoken.address, accounts[0]);
  console.log("交易所kwt类型货币数量：" + fromWei(res1));

  let res2 = await kerwintoken.allowance(accounts[0], exchange.address);

  console.log("我的账户给交易所a授权的kwt余额：" + fromWei(res2));

  let res3 = await kerwintoken.balanceOf(accounts[0]);
  console.log("我的账户kwt总余额：" + fromWei(res3));

  let res4 = await kerwintoken.balanceOf(exchange.address);
  console.log("交易所账户kwt总余额：" + fromWei(res4));
  callback();
};
