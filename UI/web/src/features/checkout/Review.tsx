import { Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { useGetBasketQuery } from "../basket/basketApi.ts";
import { ProductsSummary } from "../product/ProductsSummary.tsx";
import { ProductTable } from "../product/ProductTable.tsx";

export function Review() {
  const { data: basket } = useGetBasketQuery();

  if (!basket) {
    return <>Basket not found.</>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <ProductTable items={basket.items} />
      <Grid container>
        <Grid xs={6} />
        <Grid xs={6}>
          <ProductsSummary items={basket.items} />
        </Grid>
      </Grid>
    </>
  );
}
