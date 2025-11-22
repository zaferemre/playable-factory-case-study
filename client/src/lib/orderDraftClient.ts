// src/lib/orderDraftClient.ts

import type { Product } from "./types/types";

// what a single line in the draft looks like
export interface OrderDraftItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

// full draft stored in localStorage
export interface OrderDraft {
  id: string; // client side draft id
  items: OrderDraftItem[];
  totalAmount: number;
  currency: string;
  createdAt: string;
}

function getStorageKey(id: string) {
  return `orderDraft:${id}`;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

// Accepts whatever shape cartItems has and normalizes it to an array
export function createOrderDraftFromCart(
  cartItems: unknown,
  totalAmount: number,
  currency: string
): string {
  if (typeof window === "undefined") {
    // should not happen in normal Next client usage
    return "";
  }

  const list: any[] = Array.isArray(cartItems)
    ? cartItems
    : cartItems && typeof cartItems === "object"
    ? Object.values(cartItems as Record<string, unknown>)
    : [];

  const items: OrderDraftItem[] = list
    .map((item: any): OrderDraftItem | null => {
      const rawProduct = item?.product as Product | string | undefined;
      const quantity = Number(item?.quantity ?? 0);

      if (!rawProduct || quantity <= 0) {
        return null;
      }

      if (typeof rawProduct === "string") {
        // minimal fallback if we only have product id
        return {
          productId: rawProduct,
          name: "Product",
          quantity,
          unitPrice: 0,
          currency,
        };
      }

      return {
        productId: rawProduct._id,
        name: rawProduct.name,
        quantity,
        unitPrice: rawProduct.price,
        currency: rawProduct.currency || currency,
      };
    })
    .filter((it): it is OrderDraftItem => it !== null);

  const id = generateId();

  const draft: OrderDraft = {
    id,
    items,
    totalAmount,
    currency,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(getStorageKey(id), JSON.stringify(draft));

  return id;
}

export function loadOrderDraft(id: string): OrderDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(getStorageKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OrderDraft;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return parsed;
  } catch (err) {
    console.error("loadOrderDraft error", err);
    return null;
  }
}

export function deleteOrderDraft(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getStorageKey(id));
  } catch (err) {
    console.error("deleteOrderDraft error", err);
  }
}
