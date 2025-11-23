import { Router } from "express";
import {
  createProduct,
  getProductById,
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

// public shop
router.get("/", listAvailableProducts);

// admin list all products
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

// public product detail
router.get("/:id", getProductById);

export default router;
