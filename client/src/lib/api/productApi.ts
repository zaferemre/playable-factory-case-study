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

export async function createProduct(input: CreateProductInput) {
  const res = await apiClient.post<Product>("/products", input);
  return res.data;
}

export async function getProductById(id: string) {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
}
export async function getAvailableProducts() {
  const res = await apiClient.get<Product[]>(`/products`);
  return res.data;
}
export async function getAllProducts() {
  const res = await apiClient.get<Product[]>(`/products/all`);
  return res.data;
}
