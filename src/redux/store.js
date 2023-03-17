import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import balanceSlice from "./slice/balanceSlice";
import orderSlice from "./slice/orderSlice";

const store = configureStore({
  reducer: {
    // 余额 reducer
    balance: balanceSlice,
    //订单reducer
    order: orderSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //关掉序列化检查
    }),
});

export default store;
