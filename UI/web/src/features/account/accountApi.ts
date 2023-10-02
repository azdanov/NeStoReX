import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

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
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    registerUser: builder.mutation<void, RegisterRequest>({
      query: (credentials) => ({
        url: "accounts/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "User", id: "ME" }],
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
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    getCurrentUser: builder.query<User, void>({
      queryFn: async (_arguments, { getState }, _extraOptions, baseQuery) => {
        const token = (getState() as RootState).auth.accessToken;
        if (!token) {
          return {} as QueryReturnValue<User, FetchBaseQueryError>;
        }

        const response = await baseQuery("accounts/current-user");
        return {
          data: response.data,
          error: response.error,
        } as QueryReturnValue<User, FetchBaseQueryError>;
      },
      providesTags: [{ type: "User", id: "ME" }],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useRefreshTokenMutation,
  useLogoutUserMutation,
  useGetCurrentUserQuery,
} = accountApi;
