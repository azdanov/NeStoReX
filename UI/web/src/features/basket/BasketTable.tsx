import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Link } from "wouter";

import {
  useAddItemMutation,
  useGetBasketQuery,
  useRemoveItemMutation,
} from "../../app/store/basket.ts";
import { priceFormat } from "../../app/utils/utils.ts";

enum actionType {
  add = "add",
  // Remove is for one item
  remove = "remove",
  // Delete is for all items
  delete = "delete",
}

function getActionName(productId: number, actionType: actionType) {
  return `${actionType}-${productId}-item`;
}

export default function BasketTable() {
  const { data } = useGetBasketQuery();
  const [addItem] = useAddItemMutation();
  const [removeItem] = useRemoveItemMutation();

  const [loadingName, setLoadingName] = useState("");

  if (!data) {
    return <>No items in basket.</>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.items.map((item) => (
            <TableRow
              key={item.productId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <img
                    style={{ height: 50, marginRight: 20 }}
                    src={item.pictureUrl}
                    alt={item.name}
                  />
                  <Link
                    to={`/products/${item.productId}`}
                    style={{ color: "inherit" }}
                  >
                    {item.name}
                  </Link>
                </Box>
              </TableCell>
              <TableCell align="right">{priceFormat(item.price)}</TableCell>
              <TableCell align="center">
                <LoadingButton
                  loading={
                    loadingName ===
                    getActionName(item.productId, actionType.remove)
                  }
                  color="secondary"
                  onClick={() => {
                    setLoadingName(
                      getActionName(item.productId, actionType.remove),
                    );
                    removeItem({ productId: item.productId }).finally(() =>
                      setLoadingName(""),
                    );
                  }}
                >
                  <Remove />
                </LoadingButton>
                {item.quantity}
                <LoadingButton
                  loading={
                    loadingName ===
                    getActionName(item.productId, actionType.add)
                  }
                  color="secondary"
                  onClick={() => {
                    setLoadingName(
                      getActionName(item.productId, actionType.add),
                    );
                    addItem({ productId: item.productId }).finally(() =>
                      setLoadingName(""),
                    );
                  }}
                >
                  <Add />
                </LoadingButton>
              </TableCell>
              <TableCell align="right">
                {priceFormat(item.price * item.quantity)}
              </TableCell>
              <TableCell align="right">
                <LoadingButton
                  loading={
                    loadingName ===
                    getActionName(item.productId, actionType.delete)
                  }
                  color="error"
                  onClick={() => {
                    setLoadingName(
                      getActionName(item.productId, actionType.delete),
                    );
                    removeItem({
                      productId: item.productId,
                      quantity: item.quantity,
                    }).finally(() => setLoadingName(""));
                  }}
                >
                  <Delete />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
