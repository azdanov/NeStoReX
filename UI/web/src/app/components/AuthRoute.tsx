import { ReactElement } from "react";
import {
  DefaultParams,
  Match,
  Path,
  Redirect,
  Route,
  RouteProps,
  useRoute,
} from "wouter";

import { getIsAuthenticated } from "../../features/account/authSlice.ts";
import { useAppSelector } from "../store/store.ts";

export function AuthRoute<
  T extends DefaultParams | undefined = undefined,
  RoutePath extends Path = Path,
>(props: RouteProps<T, RoutePath> & { match?: Match }): ReactElement | null {
  const isAuthenticated = useAppSelector(getIsAuthenticated);
  const useRouteMatch = useRoute(props.path!);
  const [matches] = props.match ?? useRouteMatch;

  if (!matches) return null;

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Route {...props} />;
}
