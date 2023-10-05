import { Address } from "./account.ts";
import { BasketItem } from "./basket.ts";

export interface ShippingAddress extends Address {}

export interface CreateOrderRequest {
  address: ShippingAddress;
  saveAddress: boolean;
}

export interface OrderItem
  extends Pick<
    BasketItem,
    "productId" | "name" | "price" | "pictureUrl" | "quantity"
  > {}

export interface Order {
  id: number;
  buyerEmail: string;
  orderDate: string;
  shippingAddress: ShippingAddress;
  deliveryFee: number;
  orderItems: OrderItem[];
  subtotal: number;
  orderStatus: string;
  total: number;
}
