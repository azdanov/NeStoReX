import "./styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";

import { Container, createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Switch } from "wouter";

import { AboutPage } from "../../features/about/AboutPage.tsx";
import { ContactPage } from "../../features/contact/ContactPage.tsx";
import { HomePage } from "../../features/home/HomePage.tsx";
import { ProductDetails } from "../../features/product/ProductDetails.tsx";
import { ProductPage } from "../../features/product/ProductPage.tsx";
import { NotFound } from "../errors/NotFound.tsx";
import { Header } from "./Header.tsx";

export function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#424242" : "#eeeeee",
      },
    },
  });

  function handleThemeChange() {
    setDarkMode((previousDarkMode) => !previousDarkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline enableColorScheme />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/products" component={ProductPage} />
          <Route path="/products/:id" component={ProductDetails} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/:rest*" component={NotFound} />
        </Switch>
      </Container>
    </ThemeProvider>
  );
}
