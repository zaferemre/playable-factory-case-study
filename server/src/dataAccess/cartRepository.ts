import { Types } from "mongoose";
import { CartModel, type ICart } from "../models/Cart";

type CartSelector = {
  userId?: string;
  sessionId?: string;
};

type AddItemParams = CartSelector & {
  productId: string;
  quantity: number;
};

type UpdateItemParams = CartSelector & {
  productId: string;
};

type UpdateQuantityParams = CartSelector & {
  productId: string;
  quantity: number;
};

export const cartRepository = {
  async findCart(selector: CartSelector): Promise<ICart | null> {
    const { userId, sessionId } = selector;

    if (!userId && !sessionId) {
      throw new Error("findCart requires userId or sessionId");
    }

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;
    if (sessionId) query.sessionId = sessionId;

    return CartModel.findOne(query).populate("items.product").exec();
  },

  async addItemToCart(params: AddItemParams): Promise<ICart> {
    const { userId, sessionId, productId, quantity } = params;

    if (!userId && !sessionId) {
      throw new Error("addItemToCart requires userId or sessionId");
    }

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;
    if (sessionId) query.sessionId = sessionId;

    let cart = await CartModel.findOne(query);

    if (!cart) {
      cart = new CartModel({
        user: userId,
        sessionId,
        items: [
          {
            product: new Types.ObjectId(productId),
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          product: new Types.ObjectId(productId),
          quantity,
        });
      }
    }

    await cart.save();
    await cart.populate("items.product");
    return cart;
  },

  async removeItemFromCart(params: UpdateItemParams): Promise<ICart | null> {
    const { userId, sessionId, productId } = params;

    if (!userId && !sessionId) {
      throw new Error("removeItemFromCart requires userId or sessionId");
    }

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;
    if (sessionId) query.sessionId = sessionId;

    const cart = await CartModel.findOne(query);

    if (!cart) return null;

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");
    return cart;
  },

  async updateItemQuantity(
    params: UpdateQuantityParams
  ): Promise<ICart | null> {
    const { userId, sessionId, productId, quantity } = params;

    if (!userId && !sessionId) {
      throw new Error("updateItemQuantity requires userId or sessionId");
    }

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;
    if (sessionId) query.sessionId = sessionId;

    const cart = await CartModel.findOne(query);

    if (!cart) return null;

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (!item) return null;

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");
    return cart;
  },

  async clearCart(selector: CartSelector): Promise<ICart | null> {
    const { userId, sessionId } = selector;

    if (!userId && !sessionId) {
      throw new Error("clearCart requires userId or sessionId");
    }

    const query: Record<string, unknown> = {};
    if (userId) query.user = userId;
    if (sessionId) query.sessionId = sessionId;

    const cart = await CartModel.findOne(query);

    if (!cart) return null;

    cart.items = [];
    await cart.save();
    await cart.populate("items.product");
    return cart;
  },
};
