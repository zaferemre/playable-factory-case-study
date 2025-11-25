// src/routes/productRoutes.ts
import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductBySlug,
  listAllProducts,
  listAvailableProducts,
  updateProduct,
  updateProductStock,
  activateProduct,
  deactivateProduct,
  deleteProduct,
} from "../controllers/productController";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

// public shop, list available products, supports q, categoryId, sortBy, sortDir
router.get("/", listAvailableProducts);

// public product detail by slug, for nice urls like /products/kitkat-cereal
router.get("/slug/:slug", getProductBySlug);

// admin list all products (can see inactive and out of stock)
router.get("/all", verifyFirebaseToken, requireAdmin, listAllProducts);

// admin create product
router.post("/", verifyFirebaseToken, requireAdmin, createProduct);

// admin update product
router.patch("/:id", verifyFirebaseToken, requireAdmin, updateProduct);

// admin update stock only
router.patch(
  "/:id/stock",
  verifyFirebaseToken,
  requireAdmin,
  updateProductStock
);

// admin activate or deactivate
router.patch(
  "/:id/activate",
  verifyFirebaseToken,
  requireAdmin,
  activateProduct
);
router.patch(
  "/:id/deactivate",
  verifyFirebaseToken,
  requireAdmin,
  deactivateProduct
);

// admin delete
router.delete("/:id", verifyFirebaseToken, requireAdmin, deleteProduct);

// public product detail by id (fallback)
router.get("/:id", getProductById);

export default router;
