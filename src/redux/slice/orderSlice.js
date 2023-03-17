import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
const orderSlice = createSlice({
  name: "balance", //type：balance/get,,,
  initialState: {
    CancelOrders: [],
    FillOrders: [],
    AllOrders: [],
  },
  reducers: {
    setCancelOrders(state, action) {
      state.CancelOrders = action.payload;
    },
    setFillOrders(state, action) {
      state.FillOrders = action.payload;
    },
    setAllOrders(state, action) {
      state.AllOrders = action.payload;
    },
  },
});

export const { setCancelOrders, setFillOrders, setAllOrders } =
  orderSlice.actions;

export default orderSlice.reducer;

export const loadCancelOrderData = createAsyncThunk(
  "balance/fetchCancelOrderData",
  async (data, { dispatch }) => {
    const { exchange } = data;
    // console.log(exchange);
    const result = await exchange.getPastEvents("Cancel", {
      fromBlock: 0,
      toBlock: "latest",
    });
    // console.log(result);
    const cancelOrders = result.map((item) => item.returnValues);
    console.log(cancelOrders);
    dispatch(setCancelOrders(cancelOrders));
  }
);
export const loadAllOrderData = createAsyncThunk(
  "balance/fetchAllOrderData",
  async (data, { dispatch }) => {
    const { exchange } = data;
    // console.log(exchange);
    const result = await exchange.getPastEvents("Order", {
      fromBlock: 0,
      toBlock: "latest",
    });
    // console.log(result);
    const allOrders = result.map((item) => item.returnValues);
    // console.log(cancelOrders);
    dispatch(setAllOrders(allOrders));
  }
);
export const loadFillOrderData = createAsyncThunk(
  "balance/fetchFillOrderData",
  async (data, { dispatch }) => {
    const { exchange } = data;
    // console.log(exchange);
    const result = await exchange.getPastEvents("Trade", {
      fromBlock: 0,
      toBlock: "latest",
    });
    // console.log(result);
    const fillOrders = result.map((item) => item.returnValues);
    // console.log(cancelOrders);
    dispatch(setFillOrders(fillOrders));
  }
);
//balanceSlice.actions
