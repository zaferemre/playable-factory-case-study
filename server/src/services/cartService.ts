import { ICart } from "../models/Cart";
import { cartRepository } from "../dataAccess/cartRepository";

export const cartService = {
  async createCart(data: Partial<ICart>): Promise<ICart> {
    return cartRepository.createCart(data);
  },

  async getCartByUserId(userId: string): Promise<ICart | null> {
    return cartRepository.findCartByUserId(userId);
  },
};
