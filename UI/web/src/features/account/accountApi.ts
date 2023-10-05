import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

import {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../../app/models/account.ts";
import { RootState } from "../../app/store/store.ts";
import { storeApi } from "../../app/store/storeApi.ts";

export const accountApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "accounts/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }, { type: "Basket" }],
    }),
    registerUser: builder.mutation<void, RegisterRequest>({
      query: (credentials) => ({
        url: "accounts/register",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<TokenResponse, RefreshTokenRequest>({
      query: (tokens) => ({
        url: "accounts/refresh-token",
        method: "POST",
        body: tokens,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "accounts/logout",
        method: "POST",
      }),
      invalidatesTags: [{ type: "User", id: "ME" }, { type: "Basket" }],
    }),
    getCurrentUser: builder.query<User, void>({
      queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
        const isGuest = (getState() as RootState).auth.tokens === undefined;
        if (isGuest) {
          return {} as QueryReturnValue<User, FetchBaseQueryError>;
        }

        return (await baseQuery("accounts/current-user")) as QueryReturnValue<
          User,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;
      },
      providesTags: [{ type: "User", id: "ME" }],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
} = accountApi;
