import { Product } from "../models/product.ts";
import { providesList, storeApi } from "./storeApi.ts";

export const productApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "products",
      providesTags: (products) => providesList(products, "Product"),
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery } = productApi;
