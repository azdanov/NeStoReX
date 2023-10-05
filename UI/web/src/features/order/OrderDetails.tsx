import { Box, Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { Order } from "../../app/models/order.ts";
import { ProductsSummary } from "../product/ProductsSummary.tsx";
import { ProductTable } from "../product/ProductTable.tsx";

interface Props {
  order: Order;
  closeDetails: () => void;
}

export function OrderDetails({ order, closeDetails }: Props) {
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          Order# {order.id} - {order.orderStatus}
        </Typography>
        <Button
          onClick={closeDetails}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Back to orders
        </Button>
      </Box>
      <ProductTable items={order.orderItems} />
      <Grid container>
        <Grid xs={6} />
        <Grid xs={6}>
          <ProductsSummary items={order.orderItems} />
        </Grid>
      </Grid>
    </>
  );
}
