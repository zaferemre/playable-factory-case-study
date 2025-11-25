// src/lib/api/categoryApi.ts
import { apiClient } from "./apiClient";
import type { Category } from "../types/types";

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}

// public list, backend route: GET /categories
export async function getCategories() {
  const res = await apiClient.get<Category[]>("/categories");
  return res.data;
}

// public detail by slug, backend route: GET /categories/slug/:slug
export async function getCategoryBySlug(slug: string) {
  const res = await apiClient.get<Category>(`/categories/slug/${slug}`);
  return res.data;
}

// public detail by id, backend route: GET /categories/:id
export async function getCategoryById(id: string) {
  const res = await apiClient.get<Category>(`/categories/${id}`);
  return res.data;
}

// admin create, backend route: POST /categories
export async function createCategory(input: CreateCategoryInput) {
  const res = await apiClient.post<Category>("/categories", input);
  return res.data;
}

// admin list all, including inactive by query, backend route: GET /categories/all
export async function getAllCategoriesAdmin(includeInactive = false) {
  const res = await apiClient.get<Category[]>("/categories/all", {
    params: includeInactive ? { includeInactive: "true" } : undefined,
  });
  return res.data;
}

// admin update, backend route: PATCH /categories/:id
export async function updateCategory(id: string, input: UpdateCategoryInput) {
  const res = await apiClient.patch<Category>(`/categories/${id}`, input);
  return res.data;
}

// admin delete, backend route: DELETE /categories/:id
export async function deleteCategory(id: string) {
  await apiClient.delete(`/categories/${id}`);
}
