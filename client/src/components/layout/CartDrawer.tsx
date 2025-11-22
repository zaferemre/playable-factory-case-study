"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  closeCart,
  selectCartIsOpen,
  selectCartItems,
  selectCartTotal,
  removeItemLocal,
  clearCartLocal,
} from "@/lib/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { clearCart, getOrCreateCartSessionId } from "@/lib/api/cartApi";
import { createOrderDraftFromCart } from "@/lib/orderDraftClient";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { backendUserId } = useAuth();

  const isOpen = useAppSelector(selectCartIsOpen);
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  if (!isOpen) return null;

  const sessionId = getOrCreateCartSessionId();

  const handleRemove = async (productId: string) => {
    // update client side immediately
    dispatch(removeItemLocal(productId));

    // for now we skip per item backend removal since our new cartApi
    // does not expose a removeItem endpoint yet. We will rely on
    // a full clear or future sync for backend consistency.
  };

  const handleClearCart = async () => {
    dispatch(clearCartLocal());

    void clearCart({
      userId: backendUserId ?? null,
      sessionId: backendUserId ? null : sessionId,
    }).catch((err) => console.error("Failed to clear backend cart", err));
  };

  const handleOrderNow = () => {
    if (items.length === 0) return;

    // pick currency from first product if available
    const firstProd =
      items[0]?.product && typeof items[0].product !== "string"
        ? items[0].product
        : null;

    const currency = firstProd?.currency || "TRY";

    // new helper createOrderDraftFromCart handles creating
    // clientOrderId and saving the draft internally
    const clientOrderId = createOrderDraftFromCart(items, total, currency);

    dispatch(closeCart());
    router.push(`/order/${clientOrderId}`);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* backdrop */}
      <div
        className="flex-1 bg-black/40"
        onClick={() => dispatch(closeCart())}
      />

      {/* drawer */}
      <div className="w-full max-w-sm bg-white h-full shadow-xl flex flex-col animate-slideInRight">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Your cart</h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Close
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Your cart is empty.</p>
          ) : (
            items.map((item) => {
              const prod =
                typeof item.product === "string" ? null : item.product;

              const name = prod?.name || "Unknown product";
              const price = prod?.price || 0;
              const currency = prod?.currency || "";
              const image = prod?.imageUrls?.[0] || "";

              const id =
                typeof item.product === "string"
                  ? item.product
                  : item.product._id;

              return (
                <div
                  key={id}
                  className="flex gap-3 border-b pb-3 last:border-b-0"
                >
                  <div className="h-14 w-14 rounded bg-slate-100 overflow-hidden flex items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        No image
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between gap-2">
                      <p className="text-xs font-medium">{name}</p>
                      <button
                        onClick={() => handleRemove(id)}
                        className="text-[11px] text-slate-400 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Qty {item.quantity}
                    </p>

                    <p className="text-[11px] font-semibold">
                      {price * item.quantity} {currency}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* footer */}
        <div className="border-t px-4 py-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span className="font-semibold">
              {total}{" "}
              {items[0]?.product && typeof items[0].product !== "string"
                ? items[0].product.currency
                : ""}
            </span>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="w-full rounded bg-red-500 py-2 text-xs font-semibold text-white hover:bg-red-600"
            >
              Clear cart
            </button>
          )}

          <button
            disabled={items.length === 0}
            onClick={handleOrderNow}
            className="w-full rounded bg-green-600 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:bg-slate-300 disabled:text-slate-600"
          >
            Order now
          </button>
        </div>
      </div>
    </div>
  );
}
