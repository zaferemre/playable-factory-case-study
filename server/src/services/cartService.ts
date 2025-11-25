// src/services/cartService.ts
import { Types } from "mongoose";
import { cartRepository, type CartOwner } from "../dataAccess/cartRepository";
import { CartModel, type ICart } from "../models/Cart";
import { ProductModel } from "../models/Product";

interface BaseCartItemInput extends CartOwner {
  productId: string;
}

interface AddItemInput extends BaseCartItemInput {
  quantity?: number;
}

interface RemoveItemInput extends CartOwner {
  productId: string;
}

interface UpdateItemQuantityInput extends BaseCartItemInput {
  quantity: number;
}

interface ClearCartInput extends CartOwner {}

export const cartService = {
  async getCartByUserId(userId: string): Promise<ICart | null> {
    if (!userId) return null;
    const cart = await cartRepository.getCartByUserId(userId);
    return cart;
  },

  async getCartBySessionId(sessionId: string): Promise<ICart | null> {
    if (!sessionId) return null;
    const cart = await cartRepository.getCartBySessionId(sessionId);
    return cart;
  },

  async addItem(input: AddItemInput): Promise<ICart> {
    const { userId, sessionId, productId } = input;
    let { quantity } = input;

    if (!userId && !sessionId) {
      throw new Error("userId or sessionId is required");
    }

    if (!productId) {
      throw new Error("productId is required");
    }

    quantity = quantity ?? 1;
    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      throw new Error("quantity must be a positive number");
    }

    const productExists = await ProductModel.exists({
      _id: productId,
      isActive: true,
    });
    if (!productExists) {
      throw new Error("Product not found or inactive");
    }

    const cart = await cartRepository.findOrCreateCart({ userId, sessionId });

    const productIdStr = String(productId);
    const existingIndex = cart.items.findIndex(
      (item) => String(item.product) === productIdStr
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      if (cart.items[existingIndex].quantity <= 0) {
        cart.items.splice(existingIndex, 1);
      }
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
      });
    }

    await cart.save();

    return reloadCart(cart._id);
  },

  async removeItem(input: RemoveItemInput): Promise<ICart | null> {
    const { userId, sessionId, productId } = input;

    if (!userId && !sessionId) {
      throw new Error("userId or sessionId is required");
    }
    if (!productId) {
      throw new Error("productId is required");
    }

    const cart = await cartRepository.findOrCreateCart({ userId, sessionId });

    const productIdStr = String(productId);
    const newItems = cart.items.filter(
      (item) => String(item.product) !== productIdStr
    );
    cart.items = newItems;

    await cart.save();

    return reloadCart(cart._id);
  },

  async updateItemQuantity(input: UpdateItemQuantityInput): Promise<ICart> {
    const { userId, sessionId, productId, quantity } = input;

    if (!userId && !sessionId) {
      throw new Error("userId or sessionId is required");
    }
    if (!productId) {
      throw new Error("productId is required");
    }
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
      throw new Error("quantity must be a number");
    }

    const cart = await cartRepository.findOrCreateCart({ userId, sessionId });

    const productIdStr = String(productId);
    const index = cart.items.findIndex(
      (item) => String(item.product) === productIdStr
    );

    if (quantity <= 0) {
      if (index >= 0) {
        cart.items.splice(index, 1);
      }
    } else {
      if (index >= 0) {
        cart.items[index].quantity = quantity;
      } else {
        cart.items.push({
          product: new Types.ObjectId(productId),
          quantity,
        });
      }
    }

    await cart.save();

    return reloadCart(cart._id);
  },

  async clearCart(input: ClearCartInput): Promise<void> {
    const { userId, sessionId } = input;

    if (!userId && !sessionId) {
      throw new Error("userId or sessionId is required");
    }

    if (userId) {
      await cartRepository.clearCartByUserId(userId);
    } else if (sessionId) {
      await cartRepository.clearCartBySessionId(sessionId);
    }
  },
};

async function reloadCart(cartId: any): Promise<ICart> {
  const cart = await CartModel.findById(cartId)
    .populate(
      "items.product",
      "name slug price imageUrls currency stockQuantity isActive"
    )
    .exec();

  if (!cart) {
    throw new Error("Cart not found after update");
  }

  return cart;
}
