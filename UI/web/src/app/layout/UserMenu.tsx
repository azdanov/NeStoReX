import { Button, Fade, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { Link, useLocation } from "wouter";

import {
  useGetCurrentUserQuery,
  useLogoutUserMutation,
} from "../../features/account/accountApi.ts";

export function UserMenu() {
  const [_, setLocation] = useLocation();
  const { data: user } = useGetCurrentUserQuery();
  const [logout] = useLogoutUserMutation();
  const [anchorElement, setAnchorElement] = useState<Element>();
  const open = Boolean(anchorElement);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorElement(event.currentTarget);
  }

  function handleClose() {
    // eslint-disable-next-line unicorn/no-useless-undefined
    setAnchorElement(undefined);
  }

  return (
    <>
      <Button color="inherit" onClick={handleClick} sx={{ typography: "h6" }}>
        {user?.email}
      </Button>
      <Menu
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem component={Link} to="/orders">
          My orders
        </MenuItem>
        <MenuItem
          onClick={async () => {
            handleClose();
            await logout().unwrap();
            setLocation("/");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
