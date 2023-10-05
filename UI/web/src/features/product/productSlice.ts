import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ProductFilters } from "../../app/models/product.ts";

interface ProductState {
  filters: ProductFilters;
}

const startPage = 1;

function initFilters(): ProductFilters {
  return {
    currentPage: startPage,
    pageSize: 6,
    orderBy: "name",
    brands: [],
    types: [],
  };
}

const initialState: ProductState = {
  filters: initFilters(),
};

export const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setFilters: (
      state,
      action: PayloadAction<Partial<Omit<ProductFilters, "currentPage">>>,
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        currentPage: startPage,
      };
    },
    setPageNumber: (
      state,
      action: PayloadAction<Pick<ProductFilters, "currentPage">>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initFilters();
    },
  },
});

export const { setFilters, resetFilters, setPageNumber } = productSlice.actions;

function selectSelf({ product }: { product: ProductState }) {
  return product;
}

export const getProductFiltersSelector = createSelector(
  selectSelf,
  ({ filters }) => {
    return Object.fromEntries(
      Object.entries(filters)
        .filter(([, value]) => value != false) // remove falsy values
        .map(([key, value]) => [key, value]),
    ) as ProductFilters;
  },
);
