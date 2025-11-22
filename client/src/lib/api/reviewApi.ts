import { apiClient } from "./apiClient";
import type { Review } from "../types/types";

export interface CreateReviewInput {
  product: string; // product id
  user: string; // user id
  rating: number;
  title?: string;
  comment?: string;
}

export async function createReview(input: CreateReviewInput) {
  const res = await apiClient.post<Review>("/reviews", input);
  return res.data;
}

export async function getReviewById(id: string) {
  const res = await apiClient.get<Review>(`/reviews/${id}`);
  return res.data;
}
