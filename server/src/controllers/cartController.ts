import type { Request, Response } from "express";
import { cartService } from "../services/cartService";

export const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const cart = await cartService.getCart({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error("getCartByUserId error", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const getCartBySessionId = async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;
    const cart = await cartService.getCart({ sessionId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

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
  } catch (err) {
    console.error("addItemToCart error", err);
    res.status(500).json({ message: "Failed to add item" });
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

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error("removeItemFromCart error", err);
    res.status(500).json({ message: "Failed to remove item" });
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

    if (typeof quantity !== "number" || quantity < 1) {
      return res
        .status(400)
        .json({ message: "quantity must be a positive number" });
    }

    const cart = await cartService.updateQuantity({
      userId,
      sessionId,
      productId,
      quantity,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart or item not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error("updateCartItemQuantity error", err);
    res.status(500).json({ message: "Failed to update quantity" });
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

    const cart = await cartService.clearCart({ userId, sessionId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
  } catch (err) {
    console.error("clearCart error", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
