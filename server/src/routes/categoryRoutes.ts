import { Router } from "express";
import {
  createCategory,
  getCategoryById,
  listCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// public list
router.get("/", listCategories);

// admin create
router.post("/", verifyFirebaseToken, requireAdmin, createCategory);

// admin update
router.patch("/:id", verifyFirebaseToken, requireAdmin, updateCategory);

// admin delete
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteCategory);

// public detail
router.get("/:id", getCategoryById);

export default router;
