import {configureStore} from "@reduxjs/toolkit";
import CommonSlice from "./modules/common";

// 启用该配置可以让redux存储函数
// const defaultMiddlewareConfig = {
//   serializableCheck: false,
// };

export const store = configureStore({
  reducer: {
    common: CommonSlice,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(defaultMiddlewareConfig),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
