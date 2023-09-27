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
import { Link } from "wouter";

import { Product } from "../../app/models/product.ts";
import { useAddItemMutation } from "../../app/store/basket.ts";
import { priceFormat } from "../../app/utils/utils.ts";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const [addItem, { isLoading: isAddItemLoading }] = useAddItemMutation();

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
        <LoadingButton
          loading={isAddItemLoading}
          onClick={() => addItem({ productId: product.id })}
          size="small"
        >
          Add to cart
        </LoadingButton>
        <Button component={Link} size="small" to={`/products/${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}
