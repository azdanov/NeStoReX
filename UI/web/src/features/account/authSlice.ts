import type { PayloadAction } from "@reduxjs/toolkit";
import { createSelector, createSlice, isAnyOf } from "@reduxjs/toolkit";

import { accountApi } from "./accountApi.ts";

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
};

export const authLocalStorageKey = "auth";

const initialState = JSON.parse(
  localStorage.getItem(authLocalStorageKey) ?? "{}",
) as AuthState;

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Required<AuthState>>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearTokens: (state) => {
      state.accessToken = undefined;
      state.refreshToken = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      isAnyOf(
        accountApi.endpoints.loginUser.matchFulfilled,
        accountApi.endpoints.registerUser.matchFulfilled,
        accountApi.endpoints.refreshToken.matchFulfilled,
        accountApi.endpoints.logoutUser.matchFulfilled,
      ),
      (state, action) => {
        state.accessToken = action.payload?.accessToken;
        state.refreshToken = action.payload?.refreshToken;
      },
    );
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

const selectSelf = ({ auth }: { auth: AuthState }) => auth;

export const getTokensSetSelector = createSelector(
  selectSelf,
  ({ accessToken, refreshToken }) => {
    return accessToken != undefined && refreshToken != undefined;
  },
);
