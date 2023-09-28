import { Basket } from "../../app/models/basket.ts";
import { storeApi } from "../../app/store/storeApi.ts";

export const basketApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getBasket: builder.query<Basket, void>({
      query: () => "basket",
      providesTags: ["Basket"],
    }),
    addItem: builder.mutation<Basket, { productId: number; quantity?: number }>(
      {
        query: ({ productId, quantity = 1 }) => ({
          url: `basket/product/${productId}/add`,
          method: "PUT",
          params: { quantity },
        }),
        async onQueryStarted(_arguments, { dispatch, queryFulfilled }) {
          try {
            const { data: basket } = await queryFulfilled;
            dispatch(
              basketApi.util.upsertQueryData("getBasket", undefined, basket),
            );
          } catch {
            // do nothing
          }
        },
      },
    ),
    removeItem: builder.mutation<
      Basket,
      { productId: number; quantity?: number }
    >({
      query: ({ productId, quantity = 1 }) => ({
        url: `basket/product/${productId}/remove`,
        method: "PUT",
        params: { quantity },
      }),
      async onQueryStarted(_arguments, { dispatch, queryFulfilled }) {
        try {
          const { data: basket } = await queryFulfilled;
          dispatch(
            basketApi.util.upsertQueryData("getBasket", undefined, basket),
          );
        } catch {
          // do nothing
        }
      },
    }),
  }),
});

export const { useGetBasketQuery, useAddItemMutation, useRemoveItemMutation } =
  basketApi;
