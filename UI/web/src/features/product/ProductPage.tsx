import { Paper } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { AppPagination } from "../../app/components/AppPagination.tsx";
import { CheckboxButtons } from "../../app/components/CheckboxButtons.tsx";
import { RadioButtonGroup } from "../../app/components/RadioButtonGroup.tsx";
import { Loader } from "../../app/layout/Loader.tsx";
import { useAppDispatch, useAppSelector } from "../../app/store/store.ts";
import {
  useGetProductFiltersQuery,
  useGetProductsQuery,
} from "./productApi.ts";
import { ProductGrid } from "./ProductGrid.tsx";
import { ProductSearch } from "./ProductSearch.tsx";
import {
  getProductFiltersSelector,
  setFilters,
  setPageNumber,
} from "./productSlice.ts";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "price", label: "Price: Low to High" },
];

export function ProductPage() {
  const filters = useAppSelector(getProductFiltersSelector);
  const dispatch = useAppDispatch();

  const { data: paginatedProducts, isFetching: isProductsFetching } =
    useGetProductsQuery(filters);
  const { data: options, isLoading: isFiltersLoading } =
    useGetProductFiltersQuery(undefined, {
      selectFromResult: ({ data, isLoading }) => ({
        data: data ?? { brands: [], types: [] },
        isLoading,
      }),
    });

  if (isFiltersLoading) {
    return <Loader message="Loading products..." />;
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={3}>
          <Paper sx={{ mb: 2 }}>
            <ProductSearch />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <RadioButtonGroup
              selectedValue={filters.orderBy}
              options={sortOptions}
              onChange={(value) => dispatch(setFilters({ orderBy: value }))}
            />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <CheckboxButtons
              items={options.brands}
              checked={filters.brands}
              onChange={(checkedItems: string[]) =>
                dispatch(setFilters({ brands: checkedItems }))
              }
            />
          </Paper>
          <Paper sx={{ p: 2 }}>
            <CheckboxButtons
              items={options.types}
              checked={filters.types}
              onChange={(checkedItems: string[]) =>
                dispatch(setFilters({ types: checkedItems }))
              }
            />
          </Paper>
        </Grid>
        <Grid xs={9}>
          <ProductGrid
            products={paginatedProducts?.products ?? []}
            isFetching={isProductsFetching}
          />
        </Grid>
        <Grid xs={3} />
        <Grid xs={9} sx={{ mb: 2 }}>
          {paginatedProducts?.metaData && (
            <AppPagination
              metaData={paginatedProducts?.metaData}
              onPageChange={(page: number) =>
                dispatch(setPageNumber({ currentPage: page }))
              }
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
