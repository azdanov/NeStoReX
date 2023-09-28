import {
  PaginatedProducts,
  Product,
  ProductFilters,
  ProductOptions,
  ProductPagination,
} from "../../app/models/product.ts";
import { storeApi } from "../../app/store/storeApi.ts";

export const productApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProducts, ProductFilters>({
      query: (filters) => ({
        url: "products",
        params: filters,
      }),
      transformResponse: (data, meta) => {
        const metaData = meta?.response?.headers.get("Pagination") ?? "{}";

        return {
          products: data as Product[],
          metaData: JSON.parse(metaData) as ProductPagination,
        };
      },
      providesTags: (result, _error, _page) =>
        result
          ? [
              ...result.products.map(({ id }) => ({
                type: "Product" as const,
                id,
              })),
              { type: "Product", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Product", id: "PARTIAL-LIST" }],
    }),
    getProduct: builder.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getProductFilters: builder.query<ProductOptions, void>({
      query: () => "products/filters",
      providesTags: ["ProductOptions"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductFiltersQuery,
} = productApi;
