import { IReview } from "../models/Review";
import { reviewRepository } from "../dataAccess/reviewRepository";

export const reviewService = {
  async createReview(data: Partial<IReview>): Promise<IReview> {
    return reviewRepository.createReview(data);
  },

  async getReviewById(id: string): Promise<IReview | null> {
    return reviewRepository.findReviewById(id);
  },
};
