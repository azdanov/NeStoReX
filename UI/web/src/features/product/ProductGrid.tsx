import Grid from "@mui/material/Unstable_Grid2";

import { Product } from "../../app/models/product.ts";
import { ProductCard } from "./ProductCard.tsx";

interface Props {
  products: Product[];
}

export function ProductGrid({ products }: Props) {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid key={product.id} xs={3}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
