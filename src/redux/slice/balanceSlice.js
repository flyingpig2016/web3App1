import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
const balanceSlice = createSlice({
  name: "balance", //type：balance/get,,,
  initialState: {
    TokenWallet: "0", //位转换,需要字符串，不是数字
    TokenExchange: "0",
    EtherWallet: "0",
    Etherchange: "0",
  },
  reducers: {
    setTokenWaller(state, action) {
      state.TokenWallet = action.payload;
    },
    setTokenExchange(state, action) {
      state.TokenExchange = action.payload;
    },
    setEtherWallet(state, action) {
      state.EtherWallet = action.payload;
    },
    setEtherchange(state, action) {
      state.Etherchange = action.payload;
    },
  },
});

export const {
  setTokenWaller,
  setTokenExchange,
  setEtherWallet,
  setEtherchange,
} = balanceSlice.actions;

export default balanceSlice.reducer;

export const loadBalanceData = createAsyncThunk(
  "balance/fetchBalanceData",
  async (data, { dispatch }) => {
    const { web3, account, token, exchange } = data;
    //获取钱包的token
    const TokenWallet = await token.methods.balanceOf(account).call();
    dispatch(setTokenWaller(TokenWallet));
    // 获取交易所的token
    const TokenExchange = await exchange.methods
      .balanceOf(token.options.address, account)
      .call();
    dispatch(setTokenExchange(TokenExchange));
    //获取钱包ether
    const EtherWallet = await web3.eth.getBalance(account);
    dispatch(setEtherWallet(EtherWallet));
    //获取交易所的ether
    const EtherExchange = await exchange.methods
      .balanceOf(ETHER_ADDRESS, account)
      .call(this);
    dispatch(setEtherchange(EtherExchange));
  }
);

//balanceSlice.actions
