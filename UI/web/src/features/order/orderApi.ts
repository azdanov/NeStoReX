import { CreateOrderRequest, Order } from "../../app/models/order.ts";
import { storeApi } from "../../app/store/storeApi.ts";

export const orderApi = storeApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "orders",
      providesTags: (result, _error, _page) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Order" as const,
                id,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => `orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Order", id }],
    }),
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Order", id: "LIST" },
        { type: "Basket" },
        { type: "User", id: "ME" },
      ],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderQuery, useGetOrdersQuery } =
  orderApi;
