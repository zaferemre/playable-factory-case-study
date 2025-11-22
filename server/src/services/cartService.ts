import { cartRepository } from "../dataAccess/cartRepository";
import { CartModel, type ICart } from "../models/Cart";
import type { Types } from "mongoose";

interface GetCartOpts {
  userId?: string | null;
  sessionId?: string | null;
}

interface ItemChangeOpts extends GetCartOpts {
  productId: string;
  quantity?: number;
}

const getOrCreateCart = async ({
  userId,
  sessionId,
}: GetCartOpts): Promise<ICart> => {
  if (userId) {
    let cart = await cartRepository.getCartByUserId(userId);
    if (!cart) {
      cart = await cartRepository.createCart({
        user: userId as unknown as Types.ObjectId,
        items: [],
      });
    }
    return cart;
  }

  if (!sessionId) {
    throw new Error("sessionId required for guest cart");
  }

  let cart = await cartRepository.getCartBySessionId(sessionId);
  if (!cart) {
    cart = await cartRepository.createCart({
      sessionId,
      items: [],
    });
  }
  return cart;
};

export const cartService = {
  async getCartByUserId(userId: string) {
    const cart = await cartRepository.getCartByUserId(userId);
    if (cart) return cart;
    // always return a cart structure, even if empty
    return cartRepository.createCart({
      user: userId as unknown as Types.ObjectId,
      items: [],
    });
  },

  async getCartBySessionId(sessionId: string) {
    const cart = await cartRepository.getCartBySessionId(sessionId);
    if (cart) return cart;
    return cartRepository.createCart({
      sessionId,
      items: [],
    });
  },

  async addItem(opts: ItemChangeOpts) {
    const { userId, sessionId, productId, quantity = 1 } = opts;

    const cart = await getOrCreateCart({ userId, sessionId });

    const existing = cart.items.find(
      (it) => it.product.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: productId as unknown as Types.ObjectId,
        quantity,
      });
    }

    return cartRepository.saveCart(cart);
  },

  async removeItem(opts: ItemChangeOpts) {
    const { userId, sessionId, productId } = opts;

    const cart = await getOrCreateCart({ userId, sessionId });

    cart.items = cart.items.filter((it) => it.product.toString() !== productId);

    return cartRepository.saveCart(cart);
  },

  async updateItemQuantity(opts: ItemChangeOpts) {
    const { userId, sessionId, productId, quantity = 1 } = opts;

    const cart = await getOrCreateCart({ userId, sessionId });

    const item = cart.items.find((it) => it.product.toString() === productId);
    if (!item) {
      // item not in cart, treat as add
      cart.items.push({
        product: productId as unknown as Types.ObjectId,
        quantity,
      });
    } else {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (it) => it.product.toString() !== productId
        );
      }
    }

    return cartRepository.saveCart(cart);
  },

  async clearCart(opts: GetCartOpts) {
    const { userId, sessionId } = opts;

    if (userId) {
      await cartRepository.clearCartByUserId(userId);
      return;
    }

    if (!sessionId) {
      throw new Error("sessionId required for guest cart");
    }

    await cartRepository.clearCartBySessionId(sessionId);
  },
};
