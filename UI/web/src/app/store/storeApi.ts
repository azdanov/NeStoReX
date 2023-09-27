import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;

const tagTypes = ["Product", "Basket"] as const;

export function providesList<R extends { id: string | number }[]>(
  resultsWithIds: R | undefined,
  tagType: (typeof tagTypes)[number],
) {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}

export const storeApi = createApi({
  reducerPath: "storeApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
