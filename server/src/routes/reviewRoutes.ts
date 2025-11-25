// src/routes/reviewRoutes.ts
import { Router } from "express";
import {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  listReviews,
  listAllReviews,
} from "../controllers/reviewController";
import { requireAdmin } from "../middlewares/requireAdmin";
// import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";

const router = Router();

// admin endpoint - list all reviews
router.get("/admin/all", requireAdmin, listAllReviews);

// list reviews
// GET /api/reviews?productId=xxx
// GET /api/reviews?userId=yyy
router.get("/", listReviews);

// create review
// add verifyFirebaseToken when you want auth: router.post("/", verifyFirebaseToken, createReview);
router.post("/", createReview);

// get, update, delete by id
router.get("/:id", getReviewById);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
