import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

export const tagTypes = ["Product", "Basket", "ProductOptions"] as const;

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
