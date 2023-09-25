import { useCallback, useMemo, useState } from "react";

import { Basket } from "../models/basket.ts";
import { StoreContext } from "./StoreContext.ts";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [basket, setBasket] = useState<Basket>({
    id: 0,
    buyerId: "",
    items: [],
  });

  const removeItemFromBasket = useCallback(
    (productId: number, quantity: number) => {
      const items = [...basket.items];
      const itemIndex = items.findIndex(
        (index) => index.productId === productId,
      );

      if (itemIndex >= 0) {
        items[itemIndex].quantity -= quantity;
        if (items[itemIndex].quantity <= 0) {
          items.splice(itemIndex, 1);
        }
        setBasket((previousBasket) => ({ ...previousBasket, items }));
      }
    },
    [basket],
  );

  const value = useMemo(
    () => ({ basket, setBasket, removeItemFromBasket }),
    [basket, removeItemFromBasket],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
