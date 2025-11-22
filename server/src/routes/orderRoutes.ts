import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrderByClientOrderId,
  getOrdersForUser,
} from "../controllers/orderController";

const router = Router();

// create order after user confirms checkout
router.post("/", createOrder);

// order history for a user
router.get("/user/:userId", getOrdersForUser);

// fetch order by client side temporary id
router.get("/client/:clientOrderId", getOrderByClientOrderId);

// fetch order by Mongo id
router.get("/:id", getOrderById);

export default router;
