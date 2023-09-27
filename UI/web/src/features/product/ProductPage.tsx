import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Link } from "wouter";

import { Loader } from "../../app/layout/Loader.tsx";
import { useGetProductsQuery } from "../../app/store/product.ts";
import { ProductCard } from "./ProductCard.tsx";

export function ProductPage() {
  const { data: products, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return <Loader message="Loading products..." />;
  }

  if (!products || products.length === 0) {
    return (
      <Container component={Paper} style={{ height: 300 }}>
        <Typography
          gutterBottom
          variant="h4"
          sx={{ py: 5, mb: 0, textAlign: "center" }}
        >
          Sorry, no products were found!
        </Typography>
        <Divider />
        <Box display="flex" justifyContent="center" mt={4}>
          <Button component={Link} to="/" size="large">
            Go home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid key={product.id} xs={3}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
