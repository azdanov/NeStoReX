import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

import { Loader } from "../../app/layout/Loader.tsx";
import { priceFormat } from "../../app/utils/utils.ts";
import {
  useAddItemMutation,
  useGetBasketQuery,
  useRemoveItemMutation,
} from "../basket/basketApi.ts";
import { useGetProductQuery } from "./productApi.ts";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: basket } = useGetBasketQuery();
  const [addItem, { isLoading: isAddItemLoading }] = useAddItemMutation();
  const [removeItem, { isLoading: isRemoveItemLoading }] =
    useRemoveItemMutation();
  const { data: product, isLoading: isProductLoading } = useGetProductQuery(id);

  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const productInBasket = basket?.items.find(
    (x) => x.productId === product?.id,
  );

  useEffect(() => {
    if (productInBasket) {
      setSelectedQuantity(productInBasket.quantity);
    }
  }, [productInBasket]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = Number.parseInt(event.target.value);
    if (input >= 0) {
      setSelectedQuantity(input);
    }
  }

  function handleUpdateCart() {
    if (!productInBasket || selectedQuantity > productInBasket.quantity) {
      const updatedQuantity = productInBasket
        ? selectedQuantity - productInBasket.quantity
        : selectedQuantity;

      addItem({ productId: product!.id, quantity: updatedQuantity });
    } else {
      const updatedQuantity = productInBasket.quantity - selectedQuantity;

      removeItem({ productId: product!.id, quantity: updatedQuantity });
    }
  }

  if (isProductLoading) {
    return <Loader message="Loading product..." />;
  }

  if (!product) {
    return (
      <Container component={Paper} style={{ height: 300 }}>
        <Typography
          gutterBottom
          variant="h4"
          sx={{ py: 5, mb: 0, textAlign: "center" }}
        >
          Sorry, no product was found!
        </Typography>
        <Divider />
        <Box display="flex" justifyContent="center" mt={4}>
          <Button component={Link} to="/products" size="large">
            Go to products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid xs>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid xs>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          {priceFormat(product.price)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2} mt={3}>
          <Grid xs>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={selectedQuantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid xs>
            <LoadingButton
              disabled={
                productInBasket?.quantity === selectedQuantity ||
                (!productInBasket && selectedQuantity === 0)
              }
              loading={isAddItemLoading || isRemoveItemLoading}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              <span>{productInBasket ? "Update Quantity" : "Add to Cart"}</span>
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
