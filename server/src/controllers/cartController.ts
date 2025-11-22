import { Request, Response } from "express";
import { cartService } from "../services/cartService";

export const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
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

    const cart = await cartService.addItem({
      userId: userId ?? null,
      sessionId: sessionId ?? null,
      productId,
      quantity,
    });

    res.json(cart);
  } catch (err) {
    console.error("addItemToCart error", err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId, productId } = req.body;

    const cart = await cartService.removeItem({
      userId: userId ?? null,
      sessionId: sessionId ?? null,
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

    const cart = await cartService.updateItemQuantity({
      userId: userId ?? null,
      sessionId: sessionId ?? null,
      productId,
      quantity,
    });

    res.json(cart);
  } catch (err) {
    console.error("updateCartItemQuantity error", err);
    res.status(500).json({ message: "Failed to update cart item quantity" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = req.body;

    await cartService.clearCart({
      userId: userId ?? null,
      sessionId: sessionId ?? null,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("clearCart error", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};
