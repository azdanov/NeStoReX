import { AppBar, Toolbar, Typography } from "@mui/material";

import { ThemeSwitch } from "../../features/ThemeSwitch";

interface HeaderProps {
  darkMode: boolean;
  handleThemeChange: () => void;
}

export function Header({ darkMode, handleThemeChange }: HeaderProps) {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography component="h1" variant="h6">
          NeStoReX
        </Typography>
        <ThemeSwitch
          sx={{ ml: "auto" }}
          checked={darkMode}
          onChange={handleThemeChange}
        />
      </Toolbar>
    </AppBar>
  );
}
