// src/dataAccess/cartRepository.ts
import { CartModel, type ICart } from "../models/Cart";
import { Types } from "mongoose";

export interface CartOwner {
  userId?: string;
  sessionId?: string;
}

export const cartRepository = {
  async getCartByUserId(userId: string): Promise<ICart | null> {
    return CartModel.findOne({ user: userId })
      .populate(
        "items.product",
        "name slug price imageUrls currency stockQuantity isActive"
      )
      .exec();
  },

  async getCartBySessionId(sessionId: string): Promise<ICart | null> {
    return CartModel.findOne({ sessionId })
      .populate(
        "items.product",
        "name slug price imageUrls currency stockQuantity isActive"
      )
      .exec();
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

  async findOrCreateCart(owner: CartOwner): Promise<ICart> {
    const { userId, sessionId } = owner;

    if (!userId && !sessionId) {
      throw new Error("Either userId or sessionId is required for a cart");
    }

    if (userId) {
      const existing = await this.getCartByUserId(userId);
      if (existing) return existing;

      const created = await this.createCart({
        user: new Types.ObjectId(userId),
        items: [],
      });
      return created;
    }

    const sid = sessionId as string;
    const existing = await this.getCartBySessionId(sid);
    if (existing) return existing;

    const created = await this.createCart({ sessionId: sid, items: [] });
    return created;
  },
};
