import { useEffect, useState } from "react";

import { Product } from "../../app/models/product.ts";
import { ProductGrid } from "./ProductGrid.tsx";

export function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json() as Promise<Product[]>)
      .then((products) => setProducts(products));
  }, []);

  return (
    <>
      <ProductGrid products={products} />
    </>
  );
}
