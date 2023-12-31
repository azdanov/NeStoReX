﻿import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { authSlice } from "../../features/account/authSlice.ts";
import { guestBasketSlice } from "../../features/basket/guestBasketSlice.ts";
import { productSlice } from "../../features/product/productSlice.ts";
import {
  authListener,
  basketListener,
  loginListener,
  rtkQueryErrorLogger,
} from "./middleware.ts";
import { storeApi } from "./storeApi.ts";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    product: productSlice.reducer,
    guestBasket: guestBasketSlice.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    rtkQueryErrorLogger,
    authListener.middleware,
    loginListener.middleware,
    basketListener.middleware,
    storeApi.middleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
