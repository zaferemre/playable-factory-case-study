import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrderByClientOrderId,
} from "../controllers/orderController";

const router = Router();

// create order after user confirms checkout
router.post("/", createOrder);

// fetch order by Mongo id
router.get("/:id", getOrderById);

// fetch order by client side temporary id
router.get("/client/:clientOrderId", getOrderByClientOrderId);

export default router;
