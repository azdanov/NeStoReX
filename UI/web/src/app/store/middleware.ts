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
import { RootState } from "./store.ts";

export const rtkQueryErrorLogger: Middleware =
  // eslint-disable-next-line unicorn/consistent-function-scoping
  (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action) && import.meta.env.DEV) {
      console.info(action);
    }
    return next(action);
  };

export const authLocalStorage = createListenerMiddleware();
authLocalStorage.startListening({
  matcher: isAnyOf(
    accountApi.endpoints.loginUser.matchFulfilled,
    accountApi.endpoints.registerUser.matchFulfilled,
    accountApi.endpoints.refreshToken.matchFulfilled,
    accountApi.endpoints.logoutUser.matchFulfilled,
    setTokens,
    clearTokens,
  ),
  effect: (_action, { getState }) =>
    localStorage.setItem(
      authLocalStorageKey,
      JSON.stringify((getState() as RootState).auth),
    ),
});
