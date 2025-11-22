import { Router } from "express";
import {
  createProduct,
  getProductById,
} from "../controllers/productController";

const router = Router();

router.post("/", createProduct);
router.get("/:id", getProductById);

export default router;
