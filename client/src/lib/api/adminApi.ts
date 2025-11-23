// src/lib/api/adminApi.ts
import { apiClient } from "./apiClient";
import type { Product, Order, User } from "../types/types";

export interface AdminOverview {
  totals: {
    products: number;
    activeProducts: number;
    users: number;
    orders: number;
    revenuePaid: number;
    revenuePending: number;
  };
  recentOrders: Order[];
  lowStockProducts: Product[];
}

export interface AdminUpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stockQuantity?: number;
  isActive?: boolean;
  category?: string; // category id
  imageUrls?: string[];
}

export interface AdminCreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  category: string; // category id
  imageUrls?: string[];
  stockQuantity: number;
  isActive?: boolean;
}

export interface AdminOrderFilter {
  status?: string;
  userId?: string;
  limit?: number;
  page?: number;
}

export interface AdminUserSearchResult {
  users: User[];
}

// overview for dashboard
// backend route expected: GET /orders/overview
export async function getAdminOverview() {
  const res = await apiClient.get<AdminOverview>("/orders/overview");
  return res.data;
}

// all products including inactive or out of stock
// backend route: GET /products/all
export async function getAdminProducts() {
  const res = await apiClient.get<Product[]>("/products/all");
  return res.data;
}

// update a product field
// backend route: PATCH /products/:id
export async function updateAdminProduct(
  productId: string,
  payload: AdminUpdateProductInput
) {
  const res = await apiClient.patch<Product>(`/products/${productId}`, payload);
  return res.data;
}

// create new product
// backend route: POST /products
export async function createAdminProduct(payload: AdminCreateProductInput) {
  const res = await apiClient.post<Product>("/products", payload);
  return res.data;
}

// delete product
// backend route: DELETE /products/:id
export async function deleteAdminProduct(productId: string) {
  await apiClient.delete(`/products/${productId}`);
}

// list orders with optional filters
// backend route: GET /orders?status=&userId=&limit=&page=
export async function getAdminOrders(filter: AdminOrderFilter = {}) {
  const params: Record<string, string | number> = {};
  if (filter.status) params.status = filter.status;
  if (filter.userId) params.userId = filter.userId;
  if (filter.limit) params.limit = filter.limit;
  if (filter.page) params.page = filter.page;

  const res = await apiClient.get<Order[]>("/orders", { params });
  return res.data;
}

// search users by query (email or name)
// backend route: GET /users?query=...
export async function searchAdminUsers(query: string) {
  const res = await apiClient.get<User[]>("/users", {
    params: { query },
  });

  const data: AdminUserSearchResult = {
    users: res.data,
  };

  return data;
}

// orders for a single user
// backend route: GET /orders/user/:userId
export async function getAdminOrdersForUser(userId: string) {
  const res = await apiClient.get<Order[]>(`/orders/user/${userId}`);
  return res.data;
}
