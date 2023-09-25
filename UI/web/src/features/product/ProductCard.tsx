import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "wouter";

import { api } from "../../app/api/api.ts";
import { useStoreContext } from "../../app/context/StoreContext.ts";
import { Basket } from "../../app/models/basket.ts";
import { Product } from "../../app/models/product.ts";
import { priceFormat } from "../../app/utils/utils.ts";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const { setBasket } = useStoreContext();

  function handleAddToCart() {
    setLoading(true);
    api.basket
      .addItem(product.id, 1)
      .then((basket) => setBasket(basket as Basket))
      .finally(() => setLoading(false));
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Link
            to={`/products/${product.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {product.name}
          </Link>
        }
        titleTypographyProps={{
          sx: {
            fontWeight: "bold",
            color: "primary.main",
          },
        }}
      />
      <CardMedia
        sx={{
          height: 140,
          backgroundSize: "contain",
          bgcolor: "primary.light",
        }}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5">
          {priceFormat(product.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={loading} onClick={handleAddToCart} size="small">
          Add to cart
        </LoadingButton>
        <Button component={Link} size="small" to={`/products/${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
