"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/AuthContext";
import {
  IconX,
  IconShoppingCart,
  IconTrash,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";
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

  const sessionId = getOrCreateCartSessionId();

  const handleRemove = async (productId: string) => {
    dispatch(removeItemLocal(productId));
  };

  const handleClearCart = async () => {
    dispatch(clearCartLocal());

    void clearCart({
      userId: backendUserId ?? undefined,
      sessionId: backendUserId ? undefined : sessionId,
    }).catch((err) => console.error("Failed to clear backend cart", err));
  };

  const handleOrderNow = () => {
    if (items.length === 0) return;

    const firstProd =
      items[0]?.product && typeof items[0].product !== "string"
        ? items[0].product
        : null;

    const currency = firstProd?.currency || "TRY";

    const clientOrderId = createOrderDraftFromCart(items, total, currency);

    dispatch(closeCart());
    router.push(`/order/${clientOrderId}`);
  };

  const handleClose = () => {
    dispatch(closeCart());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modern drawer container */}
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white/95 backdrop-blur-xl shadow-2xl border-l border-slate-200/50"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Enhanced Header */}
            <div className="bg-linear-to-br from-white via-red-50/20 to-orange-50/30 border-b border-slate-200/50 px-6 py-6 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-2 right-4 w-16 h-16 bg-red-100 rounded-full blur-2xl opacity-40"></div>
              <div className="absolute bottom-2 left-4 w-12 h-12 bg-orange-100 rounded-full blur-xl opacity-30"></div>

              <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <IconShoppingCart size={24} stroke={2} />
                  </div>
                  <div className="flex flex-col">
                    <div className="inline-flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-slate-900">
                        Shopping Cart
                      </h2>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <IconSparkles size={12} />
                        <span>Playable</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      {items.length === 0
                        ? "Your cart is empty"
                        : `${items.length} item${
                            items.length > 1 ? "s" : ""
                          } ready for checkout`}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm border border-white/50"
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconX size={20} stroke={2} />
                </motion.button>
              </div>
            </div>

            {/* Enhanced Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 mb-4">
                    <IconShoppingCart
                      size={32}
                      className="text-slate-400"
                      stroke={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Add some delicious cereals from our collection to get
                    started!
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => {
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
                      <motion.div
                        key={id}
                        className="group flex gap-4 rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all duration-300"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-slate-100 to-slate-50 p-2">
                          {/* Decorative background */}
                          <div className="absolute top-1 right-1 w-4 h-4 bg-red-100 rounded-full blur-sm opacity-60"></div>
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              className="relative z-10 h-full w-full object-contain rounded-lg"
                            />
                          ) : (
                            <IconShoppingCart
                              size={24}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                                {name}
                              </h4>
                              <motion.button
                                onClick={() => handleRemove(id)}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <IconTrash size={14} stroke={2} />
                              </motion.button>
                            </div>

                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                              <span>Qty</span>
                              <span className="font-semibold">
                                {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-slate-900">
                              {(price * item.quantity).toLocaleString()}{" "}
                              {currency}
                            </p>
                            <div className="text-xs text-slate-500">
                              {price.toLocaleString()} {currency} each
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Enhanced Footer */}
            <div className="border-t border-slate-200/50 bg-white/95 backdrop-blur-sm px-6 py-6 space-y-4">
              {items.length > 0 && (
                <>
                  {/* Total Section */}
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-600 font-medium">
                        Subtotal ({items.length} items)
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {total.toLocaleString()}{" "}
                        {items.length > 0 &&
                        items[0]?.product &&
                        typeof items[0].product !== "string"
                          ? items[0].product.currency
                          : "TRY"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Shipping and taxes calculated at checkout
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={handleOrderNow}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-red-500 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl transition-all hover:bg-red-400"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Proceed to Checkout</span>
                      <IconArrowRight size={20} stroke={2} />
                    </motion.button>

                    <motion.button
                      onClick={handleClearCart}
                      className="w-full rounded-2xl border-2 border-red-100 bg-red-50/50 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 hover:border-red-200 transition-all"
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear Cart
                    </motion.button>
                  </div>
                </>
              )}

              {items.length === 0 && (
                <motion.button
                  onClick={handleClose}
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue Shopping
                </motion.button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
