import "./styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";

import { Container, createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import { useDarkMode } from "usehooks-ts";
import { Route, Switch } from "wouter";

import { AboutPage } from "../../features/about/AboutPage.tsx";
import { BasketPage } from "../../features/basket/BasketPage.tsx";
import { CheckoutPage } from "../../features/checkout/CheckoutPage.tsx";
import { ContactPage } from "../../features/contact/ContactPage.tsx";
import { HomePage } from "../../features/home/HomePage.tsx";
import { ProductDetails } from "../../features/product/ProductDetails.tsx";
import { ProductPage } from "../../features/product/ProductPage.tsx";
import { NotFound } from "../errors/NotFound.tsx";
import { Header } from "./Header.tsx";

export function App() {
  const { isDarkMode, toggle } = useDarkMode();

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      background: {
        default: isDarkMode ? "#424242" : "#eeeeee",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        hideProgressBar
        theme={isDarkMode ? "dark" : "light"}
        autoClose={2000}
      />
      <CssBaseline enableColorScheme />
      <Header darkMode={isDarkMode} handleThemeChange={toggle} />
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
