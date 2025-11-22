import { Router } from "express";
import {
  createCategory,
  getCategoryById,
} from "../controllers/categoryController";

const router = Router();

router.post("/", createCategory);
router.get("/:id", getCategoryById);

export default router;
