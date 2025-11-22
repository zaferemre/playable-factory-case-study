import { apiClient } from "./apiClient";
import type { Cart } from "../types/types";

/**
 * Helper to get or create a guest sessionId for carts.
 * Use only on the client side.
 */
export function getOrCreateCartSessionId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateCartSessionId must be used in the browser");
  }

  const key = "playable_cart_session_id";
  let sessionId = window.localStorage.getItem(key);

  if (!sessionId) {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = Math.random().toString(36).slice(2);
    }
    window.localStorage.setItem(key, sessionId);
  }

  return sessionId;
}

// Load cart for a logged in user
export async function getCartByUserId(userId: string): Promise<Cart> {
  const res = await apiClient.get<Cart>(`/cart/user/${userId}`);
  return res.data;
}

// Load cart for a guest session
export async function getCartBySessionId(sessionId: string): Promise<Cart> {
  const res = await apiClient.get<Cart>(`/cart/session/${sessionId}`);
  return res.data;
}

// Add item to cart for user or guest
export async function addItemToCart(params: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity?: number;
}): Promise<Cart> {
  const { userId, sessionId, productId, quantity } = params;

  const res = await apiClient.post<Cart>("/cart/item/add", {
    userId,
    sessionId,
    productId,
    quantity,
  });

  return res.data;
}

// Remove item from cart
export async function removeItemFromCart(params: {
  userId?: string;
  sessionId?: string;
  productId: string;
}): Promise<Cart> {
  const { userId, sessionId, productId } = params;

  const res = await apiClient.post<Cart>("/cart/item/remove", {
    userId,
    sessionId,
    productId,
  });

  return res.data;
}

// Update item quantity
export async function updateCartItemQuantity(params: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
}): Promise<Cart> {
  const { userId, sessionId, productId, quantity } = params;

  const res = await apiClient.post<Cart>("/cart/item/update", {
    userId,
    sessionId,
    productId,
    quantity,
  });

  return res.data;
}

// Clear the entire cart
export async function clearCart(params: {
  userId?: string;
  sessionId?: string;
}): Promise<Cart> {
  const { userId, sessionId } = params;

  const res = await apiClient.post<Cart>("/cart/clear", {
    userId,
    sessionId,
  });

  return res.data;
}
