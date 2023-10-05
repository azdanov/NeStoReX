import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Link } from "wouter";

import { Loader } from "../../app/layout/Loader.tsx";
import { ProductsSummary } from "../product/ProductsSummary.tsx";
import { ProductTable } from "../product/ProductTable.tsx";
import { useGetBasketQuery } from "./basketApi.ts";

export function BasketPage() {
  const { data: basket, isLoading: isBasketLoading } = useGetBasketQuery();

  if (isBasketLoading) {
    return <Loader message="Loading basket..." />;
  }

  if (!basket || basket.items.length === 0) {
    return (
      <Grid container>
        <Grid xs />
        <Grid xs={6}>
          <h1>Your basket is empty</h1>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            size="large"
            fullWidth
          >
            Continue shopping
          </Button>
        </Grid>
        <Grid xs />
      </Grid>
    );
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Basket
        </Typography>
      </Box>
      <ProductTable items={basket.items} showControls />
      <Grid container>
        <Grid xs={6} />
        <Grid xs={6}>
          <ProductsSummary items={basket.items} />
          <Button
            component={Link}
            to="/checkout"
            variant="contained"
            size="large"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
