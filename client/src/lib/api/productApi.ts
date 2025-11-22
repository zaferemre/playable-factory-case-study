"use client";

import { apiClient } from "./apiClient";

export const productApi = {
  list: () => apiClient.get("/products"),
  getById: (id: string) => apiClient.get(`/products/${id}`),
};
