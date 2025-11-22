import { cartRepository } from "../dataAccess/cartRepository";
import type { ICart } from "../models/Cart";

type CartSelector = {
  userId?: string;
  sessionId?: string;
};

export const cartService = {
  async getCart(selector: CartSelector): Promise<ICart | null> {
    return cartRepository.findCart(selector);
  },

  async addItem(params: {
    userId?: string;
    sessionId?: string;
    productId: string;
    quantity?: number;
  }): Promise<ICart> {
    const { userId, sessionId, productId, quantity } = params;

    return cartRepository.addItemToCart({
      userId,
      sessionId,
      productId,
      quantity: quantity ?? 1,
    });
  },

  async removeItem(params: {
    userId?: string;
    sessionId?: string;
    productId: string;
  }): Promise<ICart | null> {
    const { userId, sessionId, productId } = params;

    return cartRepository.removeItemFromCart({
      userId,
      sessionId,
      productId,
    });
  },

  async updateQuantity(params: {
    userId?: string;
    sessionId?: string;
    productId: string;
    quantity: number;
  }): Promise<ICart | null> {
    const { userId, sessionId, productId, quantity } = params;

    return cartRepository.updateItemQuantity({
      userId,
      sessionId,
      productId,
      quantity,
    });
  },

  async clearCart(selector: CartSelector): Promise<ICart | null> {
    return cartRepository.clearCart(selector);
  },
};
