import "./styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";

import { Container, createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "wouter";

import { AboutPage } from "../../features/about/AboutPage.tsx";
import { BasketPage } from "../../features/basket/BasketPage.tsx";
import { CheckoutPage } from "../../features/checkout/CheckoutPage.tsx";
import { ContactPage } from "../../features/contact/ContactPage.tsx";
import { HomePage } from "../../features/home/HomePage.tsx";
import { ProductDetails } from "../../features/product/ProductDetails.tsx";
import { ProductPage } from "../../features/product/ProductPage.tsx";
import { api } from "../api/api.ts";
import { useStoreContext } from "../context/StoreContext.ts";
import { NotFound } from "../errors/NotFound.tsx";
import { Basket } from "../models/basket.ts";
import { getCookie } from "../utils/utils.ts";
import { Header } from "./Header.tsx";
import { Loader } from "./Loader.tsx";

export function App() {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (getCookie("buyerId")) {
      setLoading(true);
      api.basket
        .get()
        .then((basket) => setBasket(basket as Basket))
        .finally(() => setLoading(false));
    }
  }, [setBasket]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#424242" : "#eeeeee",
      },
    },
  });

  if (loading) {
    return <Loader message="Loading store..." />;
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline enableColorScheme />
      <Header
        darkMode={darkMode}
        handleThemeChange={() => {
          setDarkMode((previousDarkMode) => !previousDarkMode);
        }}
      />
      <Container>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/products" component={ProductPage} />
          <Route path="/products/:id" component={ProductDetails} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/basket" component={BasketPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </ThemeProvider>
  );
}
