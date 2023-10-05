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

import { clearTokens, setTokens } from "../../features/account/authSlice.ts";
import { TokenResponse } from "../models/account.ts";
import { RootState } from "./store.ts";

const mutex = new Mutex();

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const tokens = (getState() as RootState).auth.tokens;
    if (tokens) {
      headers.set("Authorization", `Bearer ${tokens.accessToken}`);
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
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (mutex.isLocked()) {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    } else {
      const release = await mutex.acquire();

      try {
        const { tokens } = (api.getState() as RootState).auth;

        // Must use baseQuery here, because mutex lock won't allow a rtk query thunk to run after a dispatch.
        const refreshResult = await baseQuery(
          {
            url: "accounts/refresh-token",
            method: "POST",
            body: tokens,
          },
          api,
          extraOptions,
        );

        if (refreshResult.data) {
          api.dispatch(setTokens(refreshResult.data as TokenResponse));
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(clearTokens());
        }
      } finally {
        release();
      }
    }
  }

  return result;
};
