import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit";

import { accountApi } from "./accountApi.ts";

type AuthState = {
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
};

export const authLocalStorageKey = "auth";

const initialState = JSON.parse(
  localStorage.getItem(authLocalStorageKey) ?? "{}",
) as AuthState;

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<Required<AuthState>["tokens"]>,
    ) => {
      state.tokens = {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    },
    clearTokens: (state) => {
      state.tokens = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        accountApi.endpoints.loginUser.matchFulfilled,
        accountApi.endpoints.refreshToken.matchFulfilled,
        accountApi.endpoints.logoutUser.matchFulfilled,
      ),
      (state, action) => {
        const accessToken = action.payload?.accessToken;
        const refreshToken = action.payload?.refreshToken;

        state.tokens =
          accessToken && refreshToken
            ? { accessToken, refreshToken }
            : undefined;
      },
    );
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

function selectSelf({ auth }: { auth: AuthState }) {
  return auth;
}

export const getIsAuthenticated = createSelector(
  selectSelf,
  ({ tokens }) => !!tokens,
);
