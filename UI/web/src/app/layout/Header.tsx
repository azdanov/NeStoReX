import { ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "wouter";

import { useGetCurrentUserQuery } from "../../features/account/accountApi.ts";
import { useGetBasketQuery } from "../../features/basket/basketApi.ts";
import { Menu } from "./Menu.tsx";
import { ThemeSwitch } from "./ThemeSwitch";
import { UserMenu } from "./UserMenu.tsx";

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
  const { data: user } = useGetCurrentUserQuery();

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
          <Menu items={nav.middle} />
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
          {user ? <UserMenu /> : <Menu items={nav.right} />}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
