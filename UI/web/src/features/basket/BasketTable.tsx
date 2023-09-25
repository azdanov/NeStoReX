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

import { api } from "../../app/api/api.ts";
import { useStoreContext } from "../../app/context/StoreContext.ts";
import { Basket } from "../../app/models/basket.ts";
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
  const { basket, setBasket, removeItemFromBasket } = useStoreContext();
  const [loadingName, setLoadingName] = useState("");

  if (!basket) {
    return <>No items in basket.</>;
  }

  async function handleAddItem(productId: number) {
    const updatedBasket = await api.basket.addItem(productId);
    setBasket(updatedBasket as Basket);
  }

  async function handleRemoveItem(productId: number, quantity: number = 1) {
    await api.basket.removeItem(productId, quantity);
    removeItemFromBasket(productId, quantity);
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
          {basket.items.map((item) => (
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
                    handleRemoveItem(item.productId).finally(() =>
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
                    handleAddItem(item.productId).finally(() =>
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

                    handleRemoveItem(item.productId, item.quantity).finally(
                      () => setLoadingName(""),
                    );
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
