import { Request, Response } from "express";
import { cartService } from "../services/cartService";

export const createCart = async (req: Request, res: Response) => {
  try {
    const cart = await cartService.createCart(req.body);
    res.status(201).json(cart);
  } catch (err) {
    console.error("createCart error", err);
    res.status(500).json({ message: "Failed to create cart" });
  }
};

export const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const cart = await cartService.getCartByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.json(cart);
  } catch (err) {
    console.error("getCartByUserId error", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};
