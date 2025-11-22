import { ICart, CartModel } from "../models/Cart";

export const cartRepository = {
  async createCart(data: Partial<ICart>): Promise<ICart> {
    const doc = new CartModel(data);
    return doc.save();
  },

  async findCartByUserId(userId: string): Promise<ICart | null> {
    return CartModel.findOne({ user: userId }).populate("items.product").exec();
  },
};
