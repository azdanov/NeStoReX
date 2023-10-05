import { ReactElement } from "react";
import { DefaultParams, Path, Redirect, Route, RouteProps } from "wouter";

import { getIsAuthenticated } from "../../features/account/authSlice.ts";
import { useAppSelector } from "../store/store.ts";

export function AuthRoute<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends Path = Path,
>(props: RouteProps<T, RoutePath>): ReactElement | null {
  const isAuthenticated = useAppSelector(getIsAuthenticated);

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
}
