import { ReactElement } from "react";
import { DefaultParams, Path, Redirect, Route, RouteProps } from "wouter";

import { useGetCurrentUserQuery } from "../../features/account/accountApi.ts";

export function AuthRoute<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends Path = Path,
>(props: RouteProps<T, RoutePath>): ReactElement | null {
  const { data: user } = useGetCurrentUserQuery();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
}
