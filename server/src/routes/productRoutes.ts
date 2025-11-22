import { Router } from "express";
import {
  createProduct,
  getProductById,
  listAllProducts,
  listAvailableProducts,
} from "../controllers/productController";

const router = Router();

router.get("/", listAvailableProducts);
router.post("/", createProduct);
router.get("/:id", getProductById);
router.get("/all", listAllProducts);

export default router;
