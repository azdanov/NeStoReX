import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "wouter";

import { useGetBasketQuery } from "../../features/basket/basketApi.ts";
import { ThemeSwitch } from "./ThemeSwitch";

const nav = {
  middle: [
    { label: "products", path: "/products" },
    { label: "about", path: "/about" },
    { label: "contact", path: "/contact" },
  ],
  right: [
    { label: "login", path: "/login" },
    { label: "register", path: "/register" },
  ],
};

interface HeaderProps {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export function Header({ darkMode, handleThemeChange }: HeaderProps) {
  const { itemCount } = useGetBasketQuery(undefined, {
    selectFromResult: ({ data }) => ({
      itemCount: data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    }),
  });

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box display="flex" alignItems="center">
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            NeStoReX
          </Typography>
          <ThemeSwitch
            sx={{ ml: 1 }}
            checked={darkMode}
            onChange={handleThemeChange}
          />
        </Box>
        <Box>
          <NavList items={nav.middle} />
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            component={Link}
            to="/basket"
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <NavList items={nav.right} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

interface MenuProps {
  items: { label: string; path: string }[];
}

function NavList({ items }: MenuProps) {
  const [location] = useLocation();

  return (
    <List sx={{ display: "flex" }}>
      {items.map(({ label, path }) => (
        <ListItem
          className={location === path ? "active" : ""}
          key={path}
          component={Link}
          to={path}
          sx={{
            pb: "6px",
            borderBottom: "2px solid transparent",
            color: "inherit",
            typography: "h6",
            "&:hover": { color: "#e3f2fd" },
            "&.active": {
              color: "#fff",
              borderBottom: "2px solid #fff",
            },
          }}
        >
          {label.toUpperCase()}
        </ListItem>
      ))}
    </List>
  );
}
