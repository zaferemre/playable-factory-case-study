import { Router } from "express";
import { createReview, getReviewById } from "../controllers/reviewController";

const router = Router();

router.post("/", createReview);
router.get("/:id", getReviewById);

export default router;
