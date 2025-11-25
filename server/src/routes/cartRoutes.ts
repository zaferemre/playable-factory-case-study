// src/routes/cartRoutes.ts
import { Router } from "express";
import {
  getCartByUserId,
  getCartBySessionId,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart,
} from "../controllers/cartController";

const router = Router();

// get cart for logged in user
router.get("/user/:userId", getCartByUserId);

// get cart for guest session
router.get("/session/:sessionId", getCartBySessionId);

// add item to cart (user or guest)
router.post("/item/add", addItemToCart);

// remove item from cart
router.post("/item/remove", removeItemFromCart);

// update item quantity
router.post("/item/update", updateCartItemQuantity);

// clear cart
router.post("/clear", clearCart);

export default router;
