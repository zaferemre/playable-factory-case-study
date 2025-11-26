// src/controllers/reviewController.ts
import { Request, Response } from "express";
import { reviewService } from "../services/reviewService";

export const listAllReviews = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;

    const result = await reviewService.listAllReviews({
      page: parsedPage,
      limit: parsedLimit,
    });

    res.json({
      reviews: result.reviews,
      total: result.total,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all reviews" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (err: any) {
    // duplicate key because of unique product + user index
    if (err?.code === 11000) {
      return res.status(400).json({
        message: "You have already reviewed this product",
      });
    }

    res.status(500).json({ message: "Failed to create review" });
  }
};

export const getReviewById = async (req: Request, res: Response) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch review" });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { rating, title, comment } = req.body as {
      rating?: number;
      title?: string;
      comment?: string;
    };

    const updated = await reviewService.updateReview(id, {
      rating,
      title,
      comment,
    });

    if (!updated) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update review" });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deleted = await reviewService.deleteReview(id);
    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};

export const listReviews = async (req: Request, res: Response) => {
  try {
    const { productId, userId, page = "1", limit = "20" } = req.query;

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;

    if (!productId && !userId) {
      return res.status(400).json({
        message: "productId or userId is required",
      });
    }

    if (productId) {
      const result = await reviewService.listReviewsByProduct({
        productId: productId as string,
        page: parsedPage,
        limit: parsedLimit,
      });

      return res.json({
        reviews: result.reviews,
        total: result.total,
        page: parsedPage,
        limit: parsedLimit,
      });
    }

    const result = await reviewService.listReviewsByUser({
      userId: userId as string,
      page: parsedPage,
      limit: parsedLimit,
    });

    res.json({
      reviews: result.reviews,
      total: result.total,
      page: parsedPage,
      limit: parsedLimit,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
