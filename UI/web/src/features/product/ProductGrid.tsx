import Grid from "@mui/material/Unstable_Grid2";

import { Product } from "../../app/models/product.ts";
import { ProductCard } from "./ProductCard.tsx";
import { ProductCardSkeleton } from "./ProductCardSkeleton.tsx";

interface Props {
  products: Product[];
  isFetching: boolean;
}

export function ProductGrid({ products, isFetching }: Props) {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid key={product.id} xs={4}>
          {isFetching ? (
            <ProductCardSkeleton />
          ) : (
            <ProductCard product={product} />
          )}
        </Grid>
      ))}
    </Grid>
  );
}
