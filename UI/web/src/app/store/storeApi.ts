import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery.ts";

export const tagTypes = [
  "Product",
  "Basket",
  "ProductOptions",
  "User",
  "Address",
  "Order",
] as const;

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
