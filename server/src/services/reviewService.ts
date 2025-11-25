// src/services/reviewService.ts
import { Types } from "mongoose";
import { IReview } from "../models/Review";
import {
  reviewRepository,
  type ListReviewsParams,
} from "../dataAccess/reviewRepository";

export const reviewService = {
  async createReview(data: Partial<IReview>): Promise<IReview> {
    const review = await reviewRepository.createReview(data);
    await reviewRepository.recalculateProductRating(
      review.product as Types.ObjectId
    );
    return review;
  },

  async getReviewById(id: string): Promise<IReview | null> {
    return reviewRepository.findReviewById(id);
  },

  async updateReview(
    id: string,
    data: Partial<Pick<IReview, "rating" | "title" | "comment">>
  ): Promise<IReview | null> {
    const updated = await reviewRepository.updateReview(id, data);
    if (updated) {
      await reviewRepository.recalculateProductRating(
        updated.product as Types.ObjectId
      );
    }
    return updated;
  },

  async deleteReview(id: string): Promise<IReview | null> {
    const existing = await reviewRepository.findReviewById(id);
    if (!existing) return null;

    const deleted = await reviewRepository.deleteReview(id);
    if (deleted) {
      await reviewRepository.recalculateProductRating(
        deleted.product as Types.ObjectId
      );
    }
    return deleted;
  },

  async listReviewsByProduct(params: ListReviewsParams) {
    return reviewRepository.listReviewsByProduct(params);
  },

  async listReviewsByUser(params: ListReviewsParams) {
    return reviewRepository.listReviewsByUser(params);
  },

  async listAllReviews(params: { page?: number; limit?: number }) {
    return reviewRepository.listAllReviews(params);
  },
};
