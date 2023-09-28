import {
  configureStore,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { productSlice } from "../../features/product/productSlice.ts";
import { storeApi } from "./storeApi.ts";

export const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line unicorn/consistent-function-scoping
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      if (import.meta.env.DEV) {
        console.info(action);
      }
      toast.error(action.payload.data.title);
    }
    return next(action);
  };

export const store = configureStore({
  reducer: {
    product: productSlice.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // eslint-disable-next-line unicorn/prefer-spread
    getDefaultMiddleware().concat(storeApi.middleware, rtkQueryErrorLogger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
