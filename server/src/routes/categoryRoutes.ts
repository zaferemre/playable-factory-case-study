// src/routes/categoryRoutes.ts
import { Router } from "express";
import {
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  listCategories,
  listAllCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// public list, only active categories
router.get("/", listCategories);

// public detail by slug, nice for urls like /categories/chocolate
router.get("/slug/:slug", getCategoryBySlug);

// admin list, can include inactive by ?includeInactive=true
router.get("/all", verifyFirebaseToken, requireAdmin, listAllCategories);

// admin create
router.post("/", verifyFirebaseToken, requireAdmin, createCategory);

// admin update
router.patch("/:id", verifyFirebaseToken, requireAdmin, updateCategory);

// admin delete
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteCategory);

// public detail by id (fallback)
router.get("/:id", getCategoryById);

export default router;
