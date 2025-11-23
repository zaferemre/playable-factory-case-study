import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrderByClientOrderId,
  getOrdersForUser,
  getAllOrders,
  updateOrderStatus,
  getOrdersOverview,
} from "../controllers/orderController";

import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

/**
 * IMPORTANT ORDER OF ROUTES
 * Express matches top to bottom.
 * Always put custom admin endpoints BEFORE routes with parameters like "/:id".
 */

// ----------------------------
// ADMIN ROUTES
// ----------------------------

// admin overview dashboard
// GET /orders/overview
router.get("/overview", verifyFirebaseToken, requireAdmin, getOrdersOverview);

// admin list all orders with optional filters
// GET /orders?status=&userId=&page=&limit=
router.get("/", verifyFirebaseToken, requireAdmin, getAllOrders);

// admin update order status
// PATCH /orders/:id/status
router.patch(
  "/:id/status",
  verifyFirebaseToken,
  requireAdmin,
  updateOrderStatus
);

// ----------------------------
// PUBLIC OR AUTH CUSTOMER ROUTES
// ----------------------------

// create order (customer or guest)
router.post("/", createOrder);

// user order history
// GET /orders/user/:userId
router.get("/user/:userId", getOrdersForUser);

// get order by clientOrderId (temporary id)
// GET /orders/client/:clientOrderId
router.get("/client/:clientOrderId", getOrderByClientOrderId);

// ----------------------------
// MUST BE LAST
// ----------------------------

// fetch by Mongo id
// GET /orders/:id
router.get("/:id", getOrderById);

export default router;
