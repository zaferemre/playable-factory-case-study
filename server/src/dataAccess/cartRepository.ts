import { CartModel, type ICart } from "../models/Cart";
import type { Types } from "mongoose";

export const cartRepository = {
  async getCartByUserId(userId: string): Promise<ICart | null> {
    return CartModel.findOne({ user: userId }).exec();
  },

  async getCartBySessionId(sessionId: string): Promise<ICart | null> {
    return CartModel.findOne({ sessionId }).exec();
  },

  async createCart(data: Partial<ICart>): Promise<ICart> {
    const doc = new CartModel(data);
    return doc.save();
  },

  async saveCart(cart: ICart): Promise<ICart> {
    return cart.save();
  },

  async clearCartByUserId(userId: string): Promise<void> {
    await CartModel.deleteOne({ user: userId }).exec();
  },

  async clearCartBySessionId(sessionId: string): Promise<void> {
    await CartModel.deleteOne({ sessionId }).exec();
  },
};
