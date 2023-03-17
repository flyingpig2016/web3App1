import React, { useEffect } from "react";
import Web3 from "web3";
import tokenJson from "../build/KerwinToken.json";

import exchangeJson from "../build/Exchange.json";
import Balance from "./Balance";
import Order from "./Order";

import { loadBalanceData } from "../redux/slice/balanceSlice";
import {
  loadAllOrderData,
  loadCancelOrderData,
  loadFillOrderData,
} from "../redux/slice/orderSlice";
import { useDispatch } from "react-redux";

export default function Content() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function start() {
      //1.获取连接后的合约
      const web = await initWeb();
      console.log(web);
      window.web = web;
      //2. 获取资产信息
      dispatch(loadBalanceData(web));
      //3. 获取订单信息
      dispatch(loadCancelOrderData(web));
      dispatch(loadAllOrderData(web));
      dispatch(loadFillOrderData(web));

      //监听
      web.exchange.events.Order({}, (error, event) => {
        dispatch(loadCancelOrderData(web));
      });
      web.exchange.events.Cancel({}, (error, event) => {
        dispatch(loadCancelOrderData(web));
      });
      web.exchange.events.Trade({}, (error, event) => {
        dispatch(loadFillOrderData(web));
        dispatch(loadBalanceData(web));
      });
    }
    start();
    return () => {};
  }, [dispatch]);

  const initWeb = async () => {
    let web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    // 先授权账号 即授权locahost:8080/01.html
    let account = await web3.eth.requestAccounts();
    console.log("授权当前账号：" + account[0]);
    const networkId = await web3.eth.net.getId(); //获取networkId
    //连接合约KerwinToken
    const tokenAbi = tokenJson.abi;
    const tokenAddress = tokenJson.networks[networkId].address; //获取合约地址
    console.log("KerwinToken合约地址为：" + tokenAddress);
    const token = await new web3.eth.Contract(tokenAbi, tokenAddress);
    console.log(token);
    //连接合约exchange
    const exchangeAbi = exchangeJson.abi;
    const exchangeAds = exchangeJson.networks[networkId].address; //获取合约地址
    console.log("KerwinToken合约地址为：" + exchangeAds);
    const exchange = await new web3.eth.Contract(exchangeAbi, exchangeAds);
    console.log(exchange);

    return { web3, account: account[0], token, exchange };
  };

  return (
    <div>
      <Balance />
      <Order />
    </div>
  );
}
