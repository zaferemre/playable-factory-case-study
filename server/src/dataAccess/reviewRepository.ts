import { IReview, ReviewModel } from "../models/Review";

export const reviewRepository = {
  async createReview(data: Partial<IReview>): Promise<IReview> {
    const doc = new ReviewModel(data);
    return doc.save();
  },

  async findReviewById(id: string): Promise<IReview | null> {
    return ReviewModel.findById(id)
      .populate("user", "name photoUrl")
      .populate("product", "name slug")
      .exec();
  },
};
