import { Box, Pagination, Typography } from "@mui/material";
import { useState } from "react";

import { ProductPagination } from "../models/product.ts";

interface Props {
  metaData: ProductPagination;
  onPageChange: (page: number) => void;
}

export function AppPagination({ metaData, onPageChange }: Props) {
  const { pageSize, currentPage, totalCount, totalPages } = metaData;
  const [pageNumber, setPageNumber] = useState(currentPage);

  function handlePageChange(page: number) {
    setPageNumber(page);
    onPageChange(page);
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginBottom: 3 }}
    >
      <Typography variant="body1">
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        of {totalCount} results
      </Typography>
      <Pagination
        color="secondary"
        size="large"
        count={totalPages}
        page={pageNumber}
        onChange={(_event, page) => handlePageChange(page)}
      />
    </Box>
  );
}
