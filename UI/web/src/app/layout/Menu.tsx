import { List, ListItem } from "@mui/material";
import { Link, useLocation } from "wouter";

interface Props {
  items: { label: string; path: string }[];
}

export function Menu({ items }: Props) {
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
