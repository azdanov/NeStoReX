import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { BasketItem } from "../../app/models/basket.ts";

type GuestBasketState = {
  basket?: {
    items: BasketItem[];
  };
};

export const guestBasketLocalStorageKey = "guestBasket";

const initialState = JSON.parse(
  localStorage.getItem(guestBasketLocalStorageKey) ?? "{}",
) as GuestBasketState;

export const guestBasketSlice = createSlice({
  name: "guestBasket",
  initialState: initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        basketItem: BasketItem;
      }>,
    ) => {
      const { basketItem } = action.payload;

      if (!state.basket) {
        state.basket = {
          items: [{ ...basketItem }],
        };
        return;
      }

      const foundItem = state.basket.items.find(
        (item) => item.productId === basketItem.productId,
      );
      if (foundItem) {
        foundItem.quantity += basketItem.quantity;
      } else {
        state.basket = {
          items: [...state.basket.items, { ...basketItem }],
        };
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) => {
      if (!state.basket) {
        return;
      }

      const { productId, quantity } = action.payload;
      const foundItem = state.basket.items.find(
        (item) => item.productId === productId,
      );
      if (foundItem) {
        foundItem.quantity -= quantity;
        if (foundItem.quantity <= 0) {
          state.basket = {
            items: state.basket.items.filter(
              (item) => item.productId !== productId,
            ),
          };
        }
      }
    },
    clearBasket: (state) => {
      state.basket = undefined;
    },
  },
});

export const { addItem, removeItem, clearBasket } = guestBasketSlice.actions;
