import { createContext, useContext } from "react";

import { Basket } from "../models/basket.ts";

interface StoreContextProps {
  basket?: Basket;
  setBasket: (basket: Basket) => void;
  removeItemFromBasket: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextProps | undefined>(
  undefined,
);

export function useStoreContext() {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  return context;
}
