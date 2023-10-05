import {
  createListenerMiddleware,
  isAnyOf,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
} from "@reduxjs/toolkit";

import { accountApi } from "../../features/account/accountApi.ts";
import {
  authLocalStorageKey,
  clearTokens,
  setTokens,
} from "../../features/account/authSlice.ts";
import { basketApi } from "../../features/basket/basketApi.ts";
import {
  addItem,
  clearBasket,
  guestBasketLocalStorageKey,
  removeItem,
} from "../../features/basket/guestBasketSlice.ts";
import { RootState } from "./store.ts";

export const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line unicorn/consistent-function-scoping
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action) && import.meta.env.DEV) {
      console.info(action);
    }
    return next(action);
  };

export const authListener = createListenerMiddleware();
authListener.startListening({
  matcher: isAnyOf(
    accountApi.endpoints.loginUser.matchFulfilled,
    accountApi.endpoints.refreshToken.matchFulfilled,
    accountApi.endpoints.logoutUser.matchFulfilled,
    setTokens,
    clearTokens,
  ),
  effect: (_action, { getState }) => {
    localStorage.setItem(
      authLocalStorageKey,
      JSON.stringify((getState() as RootState).auth),
    );
  },
});

export const loginListener = createListenerMiddleware();
loginListener.startListening({
  matcher: accountApi.endpoints.loginUser.matchFulfilled,
  effect: (_action, { getState, dispatch }) => {
    const basket = (getState() as RootState).guestBasket.basket;
    if (basket) dispatch(basketApi.endpoints.saveBasket.initiate(basket));
    dispatch(clearBasket());
  },
});

export const basketListener = createListenerMiddleware();
basketListener.startListening({
  matcher: isAnyOf(addItem, removeItem, clearBasket),
  effect: (_action, { getState }) => {
    localStorage.setItem(
      guestBasketLocalStorageKey,
      JSON.stringify((getState() as RootState).guestBasket),
    );
  },
});
