import { LoadingButton } from "@mui/lab";
import {
  Divider,
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
import { toast } from "react-toastify";
import { useParams } from "wouter";

import { api } from "../../app/api/api.ts";
import { useStoreContext } from "../../app/context/StoreContext.ts";
import { Loader } from "../../app/layout/Loader.tsx";
import { Basket } from "../../app/models/basket.ts";
import { Product } from "../../app/models/product.ts";
import { priceFormat } from "../../app/utils/utils.ts";

export function ProductDetails() {
  const { basket, setBasket, removeItemFromBasket } = useStoreContext();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const productInBasket = basket?.items.find(
    (x) => x.productId === product?.id,
  );

  useEffect(() => {
    api.product
      .get(Number.parseInt(id, 10))
      .then((response) => setProduct(response as Product))
      .catch((error) => toast.error(error.json.title))
      .finally(() => setLoading(false));
  }, [id]);

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
    setSubmitting(true);

    if (!productInBasket || selectedQuantity > productInBasket.quantity) {
      const updatedQuantity = productInBasket
        ? selectedQuantity - productInBasket.quantity
        : selectedQuantity;

      api.basket
        .addItem(product!.id, updatedQuantity)
        .then((response) => setBasket(response as Basket))
        .finally(() => setSubmitting(false));
    } else {
      const updatedQuantity = productInBasket.quantity - selectedQuantity;
      api.basket
        .removeItem(product!.id, updatedQuantity)
        .then(() => removeItemFromBasket(product!.id, updatedQuantity))
        .finally(() => setSubmitting(false));
    }
  }

  if (loading) {
    return <Loader message="Loading product..." />;
  }

  if (!product) {
    return <Typography variant="h2">Product not found</Typography>;
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
              loading={submitting}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {productInBasket ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
