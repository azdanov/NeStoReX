import { debounce, TextField } from "@mui/material";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { setFilters } from "./productSlice.ts";

export function ProductSearch() {
  const { filters } = useAppSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm ?? "");
  const dispatch = useAppDispatch();

  const debouncedSearch = React.useMemo(
    () =>
      debounce((input: string) => {
        dispatch(setFilters({ searchTerm: input }));
      }, 400),
    [dispatch],
  );

  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        debouncedSearch(event.target.value);
      }}
    />
  );
}
