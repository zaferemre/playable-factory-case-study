// src/dataAccess/reviewRepository.ts
import { Types } from "mongoose";
import { IReview, ReviewModel } from "../models/Review";
import { ProductModel } from "../models/Product";

export interface ListReviewsParams {
  productId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

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

  async updateReview(
    id: string,
    data: Partial<Pick<IReview, "rating" | "title" | "comment">>
  ): Promise<IReview | null> {
    return ReviewModel.findByIdAndUpdate(id, { $set: data }, { new: true })
      .populate("user", "name photoUrl")
      .populate("product", "name slug")
      .exec();
  },

  async deleteReview(id: string): Promise<IReview | null> {
    return ReviewModel.findByIdAndDelete(id).exec();
  },

  async listReviewsByProduct(params: ListReviewsParams): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const { productId, page = 1, limit = 20 } = params;
    if (!productId) {
      return { reviews: [], total: 0 };
    }

    const pid = new Types.ObjectId(productId);

    const query = ReviewModel.find({ product: pid })
      .sort({ createdAt: -1 })
      .populate("user", "name photoUrl");

    const [reviews, total] = await Promise.all([
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      ReviewModel.countDocuments({ product: pid }).exec(),
    ]);

    return { reviews, total };
  },

  async listReviewsByUser(params: ListReviewsParams): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const { userId, page = 1, limit = 20 } = params;
    if (!userId) {
      return { reviews: [], total: 0 };
    }

    const uid = new Types.ObjectId(userId);

    const query = ReviewModel.find({ user: uid })
      .sort({ createdAt: -1 })
      .populate("product", "name slug");

    const [reviews, total] = await Promise.all([
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      ReviewModel.countDocuments({ user: uid }).exec(),
    ]);

    return { reviews, total };
  },

  async listAllReviews(params: { page?: number; limit?: number }): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const { page = 1, limit = 20 } = params;

    const query = ReviewModel.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name photoUrl")
      .populate("product", "name slug");

    const [reviews, total] = await Promise.all([
      query
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      ReviewModel.countDocuments({}).exec(),
    ]);

    return { reviews, total };
  },

  // recompute averageRating and reviewCount for a product
  async recalculateProductRating(productId: Types.ObjectId): Promise<void> {
    const stats = await ReviewModel.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating = stats.length > 0 ? stats[0].avgRating : 0;
    const count = stats.length > 0 ? stats[0].count : 0;

    await ProductModel.findByIdAndUpdate(productId, {
      $set: {
        averageRating: avgRating,
        reviewCount: count,
      },
    }).exec();
  },
};
