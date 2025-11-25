// src/lib/api/reviewApi.ts
import { apiClient } from "./apiClient";
import type { Review } from "../types/types";

export interface CreateReviewInput {
  product: string; // product id
  user?: string; // user id, optional for guest reviews
  rating: number;
  title?: string;
  comment?: string;
  authorName?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
}

// list reviews
// backend route: GET /reviews?productId=&userId=
export async function listReviews(params?: {
  productId?: string;
  userId?: string;
}) {
  const res = await apiClient.get<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
  }>("/reviews", {
    params,
  });
  return res.data;
}

// list all reviews (admin only)
// backend route: GET /reviews/admin/all
export async function listAllReviews(params?: {
  page?: number;
  limit?: number;
}) {
  const res = await apiClient.get<{
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
  }>("/reviews/admin/all", {
    params,
  });
  return res.data;
}

// create review, backend route: POST /reviews
export async function createReview(input: CreateReviewInput) {
  const res = await apiClient.post<Review>("/reviews", input);
  return res.data;
}

// get by id, backend route: GET /reviews/:id
export async function getReviewById(id: string) {
  const res = await apiClient.get<Review>(`/reviews/${id}`);
  return res.data;
}

// update by id, backend route: PATCH /reviews/:id
export async function updateReview(id: string, input: UpdateReviewInput) {
  const res = await apiClient.patch<Review>(`/reviews/${id}`, input);
  return res.data;
}

// delete by id, backend route: DELETE /reviews/:id
export async function deleteReview(id: string) {
  await apiClient.delete(`/reviews/${id}`);
}
