import { apiClient } from "./apiClient";
import type { Order, OrderAddress } from "../types/types";

export interface CreateOrderItemInput {
  product: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CreateOrderInput {
  user: string; // user id
  items: CreateOrderItemInput[];
  totalAmount: number;
  currency?: string;
  shippingAddress: OrderAddress;
  clientOrderId?: string; // temporary id from client
}

export async function createOrder(input: CreateOrderInput) {
  const res = await apiClient.post<Order>("/orders", input);
  return res.data;
}

export async function getOrderById(id: string) {
  const res = await apiClient.get<Order>(`/orders/${id}`);
  return res.data;
}

export async function getOrderByClientOrderId(clientOrderId: string) {
  const res = await apiClient.get<Order>(`/orders/client/${clientOrderId}`);
  return res.data;
}
