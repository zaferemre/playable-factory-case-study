import { apiClient } from "./apiClient";
import type { Order, OrderAddress } from "../types/types";

export interface CreateOrderItemInput {
  product: string;
  name: string;
  quantity: number;
  unitPrice: number;
  // optional, backend recalculates line totals anyway
  lineTotal?: number;
}

export interface CreateOrderInput {
  user?: string; // optional, for logged in orders
  sessionId?: string; // optional, for guest orders
  items: CreateOrderItemInput[];
  // optional, backend recalculates from items
  totalAmount?: number;
  currency?: string;
  shippingAddress: OrderAddress;
  clientOrderId?: string;
}

// create order, backend route: POST /orders
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

export async function getOrdersForUser(userId: string) {
  const res = await apiClient.get<Order[]>(`/orders/user/${userId}`);
  return res.data;
}
