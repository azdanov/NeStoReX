import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setFilters } from "./productSlice.ts";

export function ProductSearch() {
  const { filters } = useAppSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm ?? "");
  const dispatch = useAppDispatch();
  const debouncedSearch = useDebounce<string>(searchTerm, 1000);

  useEffect(() => {
    dispatch(setFilters({ searchTerm: debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
      }}
    />
  );
}
