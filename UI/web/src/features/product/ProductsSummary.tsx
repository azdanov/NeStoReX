﻿import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";

import { priceFormat } from "../../app/utils/utils.ts";

const deliveryThreshold = 10_000;
const deliveryPrice = 500;

interface Props {
  items: { quantity: number; price: number }[];
}

export function ProductsSummary({ items }: Props) {
  const subtotal =
    items.reduce((sum, item) => sum + item.quantity * item.price, 0) ?? 0;

  const deliveryFee = subtotal >= deliveryThreshold ? 0 : deliveryPrice;

  return (
    <>
      <TableContainer component={Paper} variant={"outlined"}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align="right">{priceFormat(subtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee *</TableCell>
              <TableCell align="right">{priceFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align="right">
                {priceFormat(subtotal + deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{ fontStyle: "italic" }}>
                  * Orders starting from{" "}
                  {priceFormat(deliveryThreshold, { fraction: 0 })} qualify for
                  free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
