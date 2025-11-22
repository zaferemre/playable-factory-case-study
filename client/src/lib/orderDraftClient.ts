// lib/orderDraftClient.ts

import type { CartItem } from "@/lib/types/types";

export interface OrderDraftItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  imageUrl?: string;
}

export interface OrderDraft {
  clientOrderId: string;
  items: OrderDraftItem[];
  totalAmount: number;
  currency: string;
  createdAt: string;
}

const STORAGE_PREFIX = "playable_order_draft_";

export function createOrderDraftFromCart(
  clientOrderId: string,
  cartItems: CartItem[]
): OrderDraft {
  const items: OrderDraftItem[] = cartItems
    .map((item) => {
      if (typeof item.product === "string") {
        // you can fetch products by id if you need, for now skip such entries
        return null;
      }

      return {
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        currency: item.product.currency,
        imageUrl: item.product.imageUrls?.[0],
      };
    })
    .filter((x): x is OrderDraftItem => x !== null);

  const totalAmount = items.reduce(
    (sum, it) => sum + it.unitPrice * it.quantity,
    0
  );

  const currency = items[0]?.currency || "TRY";

  return {
    clientOrderId,
    items,
    totalAmount,
    currency,
    createdAt: new Date().toISOString(),
  };
}

export function saveOrderDraft(draft: OrderDraft) {
  if (typeof window === "undefined") return;
  const key = STORAGE_PREFIX + draft.clientOrderId;
  window.localStorage.setItem(key, JSON.stringify(draft));
}

export function loadOrderDraft(clientOrderId: string): OrderDraft | null {
  if (typeof window === "undefined") return null;
  const key = STORAGE_PREFIX + clientOrderId;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderDraft;
  } catch {
    return null;
  }
}

export function deleteOrderDraft(clientOrderId: string) {
  if (typeof window === "undefined") return;
  const key = STORAGE_PREFIX + clientOrderId;
  window.localStorage.removeItem(key);
}
