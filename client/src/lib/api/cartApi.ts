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

// get cart for current user or guest, matches
// GET /cart/user/:userId and GET /cart/session/:sessionId
export async function getCartForCurrentUser(opts: {
  userId?: string | null;
  sessionId?: string | null;
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

// add item, matches POST /cart/item/add
export async function addItemToCart(opts: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  quantity: number;
}) {
  const { userId, sessionId, productId, quantity } = opts;

  const payload = {
    userId: userId ?? null,
    sessionId: userId ? null : sessionId ?? null,
    productId,
    quantity,
  };

  const res = await apiClient.post<Cart>("/cart/item/add", payload);
  return res.data;
}

// optional remove, matches POST /cart/item/remove
export async function removeItemFromCart(opts: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
}) {
  const { userId, sessionId, productId } = opts;

  const payload = {
    userId: userId ?? null,
    sessionId: userId ? null : sessionId ?? null,
    productId,
  };

  const res = await apiClient.post<Cart>("/cart/item/remove", payload);
  return res.data;
}

// optional quantity update, matches POST /cart/item/update
export async function updateCartItemQuantity(opts: {
  userId?: string | null;
  sessionId?: string | null;
  productId: string;
  quantity: number;
}) {
  const { userId, sessionId, productId, quantity } = opts;

  const payload = {
    userId: userId ?? null,
    sessionId: userId ? null : sessionId ?? null,
    productId,
    quantity,
  };

  const res = await apiClient.post<Cart>("/cart/item/update", payload);
  return res.data;
}

// clear cart, matches POST /cart/clear
export async function clearCart(opts: {
  userId?: string | null;
  sessionId?: string | null;
}) {
  const { userId, sessionId } = opts;

  const payload = {
    userId: userId ?? null,
    sessionId: userId ? null : sessionId ?? null,
  };

  await apiClient.post("/cart/clear", payload);
}
