import { useEffect, useState } from "react";

import { api } from "../../app/api/api.ts";
import { Loader } from "../../app/layout/Loader.tsx";
import { Product } from "../../app/models/product.ts";
import { ProductGrid } from "./ProductGrid.tsx";

export function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.product
      .list()
      .then((products) => setProducts(products as Product[]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader message="Loading products..." />;
  }

  return (
    <>
      <ProductGrid products={products} />
    </>
  );
}
