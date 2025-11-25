// src/lib/api/productApi.ts
import { apiClient } from "./apiClient";
import type { Product } from "../types/types";

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency?: string;
  category: string; // category id
  imageUrls?: string[];
  stockQuantity?: number;
}

export interface ProductListFilter {
  q?: string;
  categoryId?: string;
  sortBy?: "price" | "rating" | "orders";
  sortDir?: "asc" | "desc";
}

// admin or seeding, backend route: POST /products
export async function createProduct(input: CreateProductInput) {
  const res = await apiClient.post<Product>("/products", input);
  return res.data;
}

// public detail by id (fallback), backend route: GET /products/:id
export async function getProductById(id: string) {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
}

// public detail by slug, backend route: GET /products/slug/:slug
export async function getProductBySlug(slug: string) {
  const res = await apiClient.get<Product>(`/products/slug/${slug}`);
  return res.data;
}

// public shop list, supports filters, backend route: GET /products
export async function getAvailableProducts(filter?: ProductListFilter) {
  const res = await apiClient.get<Product[]>("/products", {
    params: filter,
  });
  return res.data;
}

// admin list, backend route: GET /products/all
export async function getAllProducts() {
  const res = await apiClient.get<Product[]>("/products/all");
  return res.data;
}
