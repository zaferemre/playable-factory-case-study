// src/lib/api/cartApi.ts
import { apiClient } from "./apiClient";
import type { Cart } from "../types/types";

export function getOrCreateCartSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "playable_cart_session";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    window.localStorage.setItem(key, id);
  }
  return id;
}

export async function getCartForCurrentUser(opts: {
  userId?: string;
  sessionId?: string;
}) {
  const { userId, sessionId } = opts;

  if (userId) {
    const res = await apiClient.get<Cart>(`/cart/user/${userId}`);
    return res.data;
  }

  if (!sessionId) {
    throw new Error("sessionId required for guest cart");
  }

  const res = await apiClient.get<Cart>(`/cart/session/${sessionId}`);
  return res.data;
}

// add item
export async function addItemToCart(opts: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
}) {
  const { userId, sessionId, productId, quantity } = opts;

  const payload = {
    userId,
    sessionId: userId ? undefined : sessionId,
    productId,
    quantity,
  };

  const res = await apiClient.post<Cart>("/cart/item/add", payload);
  return res.data;
}

// remove item
export async function removeItemFromCart(opts: {
  userId?: string;
  sessionId?: string;
  productId: string;
}) {
  const { userId, sessionId, productId } = opts;

  const payload = {
    userId,
    sessionId: userId ? undefined : sessionId,
    productId,
  };

  const res = await apiClient.post<Cart>("/cart/item/remove", payload);
  return res.data;
}

// update quantity
export async function updateCartItemQuantity(opts: {
  userId?: string;
  sessionId?: string;
  productId: string;
  quantity: number;
}) {
  const { userId, sessionId, productId, quantity } = opts;

  const payload = {
    userId,
    sessionId: userId ? undefined : sessionId,
    productId,
    quantity,
  };

  const res = await apiClient.post<Cart>("/cart/item/update", payload);
  return res.data;
}

// clear cart
export async function clearCart(opts: { userId?: string; sessionId?: string }) {
  const { userId, sessionId } = opts;

  const payload = {
    userId,
    sessionId: userId ? undefined : sessionId,
  };

  await apiClient.post("/cart/clear", payload);
}
