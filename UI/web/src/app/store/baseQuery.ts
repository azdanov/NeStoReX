import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { accountApi } from "../../features/account/accountApi.ts";
import { clearTokens } from "../../features/account/authSlice.ts";
import { RootState } from "./store.ts";

const mutex = new Mutex();

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  NonNullable<unknown>,
  FetchBaseQueryMeta
> = async (arguments_, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(arguments_, api, extraOptions);

  if (result.error?.status === 401) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      return baseQuery(arguments_, api, extraOptions);
    }

    const release = await mutex.acquire();
    try {
      const { accessToken, refreshToken } = (api.getState() as RootState).auth;

      if (
        !accessToken ||
        !refreshToken ||
        result.meta?.response?.headers
          .get("www-authenticate")
          ?.includes("The signature is invalid")
      ) {
        api.dispatch(clearTokens());
      } else if (
        result.meta?.response?.headers
          .get("www-authenticate")
          ?.includes("The token expired at")
      ) {
        api.dispatch(
          accountApi.endpoints.refreshToken.initiate({
            accessToken,
            refreshToken,
          }),
        );
        result = await baseQuery(arguments_, api, extraOptions);
      }
    } finally {
      release();
    }
  }

  return result;
};
