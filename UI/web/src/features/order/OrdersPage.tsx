import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { Loader } from "../../app/layout/Loader";
import { dateFormat, priceFormat } from "../../app/utils/utils.ts";
import { useGetOrdersQuery } from "./orderApi.ts";
import { OrderDetails } from "./OrderDetails.tsx";

export function OrdersPage() {
  const { data: orders, isLoading } = useGetOrdersQuery();
  const [selectedOrder, setSelectedOrder] = useState(0);

  if (isLoading) return <Loader message="Loading orders..." />;

  if (selectedOrder > 0)
    return (
      <OrderDetails
        order={orders!.find((order) => order.id === selectedOrder)!}
        closeDetails={() => setSelectedOrder(0)}
      />
    );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} gutterBottom variant="h4">
          My orders
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Order Date</TableCell>
              <TableCell align="right">Order Status</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow
                key={order.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {order.id}
                </TableCell>
                <TableCell align="right">{priceFormat(order.total)}</TableCell>
                <TableCell align="right">
                  {dateFormat(new Date(order.orderDate))}
                </TableCell>
                <TableCell align="right">{order.orderStatus}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => setSelectedOrder(order.id)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
