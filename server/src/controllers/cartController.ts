// src/controllers/cartController.ts
import { Request, Response } from "express";
import { cartService } from "../services/cartService";

export const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const cart = await cartService.getCartByUserId(userId);
    res.json(cart);
  } catch (err) {
    console.error("getCartByUserId error", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const getCartBySessionId = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required" });
    }

    const cart = await cartService.getCartBySessionId(sessionId);
    res.json(cart);
  } catch (err) {
    console.error("getCartBySessionId error", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId, productId, quantity } = req.body;

    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "userId or sessionId is required" });
    }

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await cartService.addItem({
      userId,
      sessionId,
      productId,
      quantity,
    });

    res.json(cart);
  } catch (err: any) {
    console.error("addItemToCart error", err);

    if (err?.message === "Product not found or inactive") {
      return res.status(400).json({ message: err.message });
    }

    if (err?.message?.includes("quantity")) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId, productId } = req.body;

    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "userId or sessionId is required" });
    }
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await cartService.removeItem({
      userId,
      sessionId,
      productId,
    });

    res.json(cart);
  } catch (err) {
    console.error("removeItemFromCart error", err);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId, productId, quantity } = req.body;

    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "userId or sessionId is required" });
    }
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const cart = await cartService.updateItemQuantity({
      userId,
      sessionId,
      productId,
      quantity,
    });

    res.json(cart);
  } catch (err: any) {
    console.error("updateCartItemQuantity error", err);

    if (err?.message?.includes("quantity")) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Failed to update cart item quantity" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = req.body;

    if (!userId && !sessionId) {
      return res
        .status(400)
        .json({ message: "userId or sessionId is required" });
    }

    await cartService.clearCart({
      userId,
      sessionId,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("clearCart error", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
