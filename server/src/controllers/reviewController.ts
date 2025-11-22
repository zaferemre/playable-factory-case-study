import { Request, Response } from "express";
import { reviewService } from "../services/reviewService";

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await reviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (err) {
    console.error("createReview error", err);
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
    console.error("getReviewById error", err);
    res.status(500).json({ message: "Failed to fetch review" });
  }
};
