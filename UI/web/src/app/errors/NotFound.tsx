﻿import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "wouter";

export function NotFound() {
  const [location] = useLocation();

  return (
    <Container component={Paper} style={{ height: 300 }}>
      <Typography
        gutterBottom
        variant="h4"
        sx={{ py: 5, mb: 0, textAlign: "center" }}
      >
        Sorry, the page "{location}" does not exist!
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
