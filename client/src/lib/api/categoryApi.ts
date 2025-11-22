import { apiClient } from "./apiClient";
import type { Category } from "../types/types";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export async function createCategory(input: CreateCategoryInput) {
  const res = await apiClient.post<Category>("/categories", input);
  return res.data;
}

export async function getCategoryById(id: string) {
  const res = await apiClient.get<Category>(`/categories/${id}`);
  return res.data;
}
