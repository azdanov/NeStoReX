import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

import { Basket } from "../../app/models/basket.ts";
import { RootState } from "../../app/store/store.ts";
import { storeApi } from "../../app/store/storeApi.ts";
import { wait } from "../../app/utils/utils.ts";
import { productApi } from "../product/productApi.ts";
import { addItem, removeItem } from "./guestBasketSlice.ts";

export const basketApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getBasket: builder.query<Basket, void>({
      queryFn: async (_args, { getState }, _extraOptions, baseQuery) => {
        const isGuest = (getState() as RootState).auth.tokens === undefined;
        const hasBasket =
          (getState() as RootState).guestBasket.basket !== undefined;

        if (isGuest || hasBasket) {
          return {
            data: (getState() as RootState).guestBasket.basket,
          } as QueryReturnValue<Basket, FetchBaseQueryError>;
        }

        return (await baseQuery("basket")) as QueryReturnValue<
          Basket,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;
      },
      providesTags: ["Basket"],
    }),
    addItem: builder.mutation<Basket, { productId: number; quantity?: number }>(
      {
        queryFn: async (
          { productId, quantity },
          { getState, dispatch },
          _extraOptions,
          baseQuery,
        ) => {
          const isGuest = (getState() as RootState).auth.tokens === undefined;
          if (isGuest) {
            const [{ data }] = await Promise.all([
              dispatch(productApi.endpoints.getProduct.initiate(productId)),
              wait(300),
            ]);
            const { id: _, ...rest } = data!;
            dispatch(
              addItem({
                basketItem: { productId, quantity: quantity ?? 1, ...rest },
              }),
            );

            const basket = (getState() as RootState).guestBasket.basket;

            return {
              data: basket,
            } as QueryReturnValue<Basket, FetchBaseQueryError>;
          }

          return (await baseQuery({
            url: `basket/product/${productId}/add`,
            method: "PUT",
            params: { quantity },
          })) as QueryReturnValue<
            Basket,
            FetchBaseQueryError,
            FetchBaseQueryMeta
          >;
        },
        async onQueryStarted(_args, { dispatch, queryFulfilled }) {
          try {
            const { data: basket } = await queryFulfilled;
            dispatch(
              basketApi.util.upsertQueryData("getBasket", undefined, basket),
            );
          } catch (error) {
            console.error(error);
          }
        },
      },
    ),
    removeItem: builder.mutation<
      Basket,
      { productId: number; quantity?: number }
    >({
      queryFn: async (
        { productId, quantity },
        { getState, dispatch },
        _extraOptions,
        baseQuery,
      ) => {
        const isGuest = (getState() as RootState).auth.tokens === undefined;
        if (isGuest) {
          await wait(300);
          dispatch(removeItem({ productId, quantity: quantity ?? 1 }));
          return {
            data: (getState() as RootState).guestBasket.basket,
          } as QueryReturnValue<Basket, FetchBaseQueryError>;
        }

        return (await baseQuery({
          url: `basket/product/${productId}/remove`,
          method: "PUT",
          params: { quantity },
        })) as QueryReturnValue<
          Basket,
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >;
      },
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data: basket } = await queryFulfilled;
          dispatch(
            basketApi.util.upsertQueryData("getBasket", undefined, basket),
          );
        } catch (error) {
          console.error(error);
        }
      },
    }),
    saveBasket: builder.mutation<void, Basket>({
      query: (basket) => ({
        url: "basket",
        method: "PUT",
        body: basket,
      }),
      invalidatesTags: ["Basket"],
    }),
  }),
});

export const { useGetBasketQuery, useAddItemMutation, useRemoveItemMutation } =
  basketApi;
