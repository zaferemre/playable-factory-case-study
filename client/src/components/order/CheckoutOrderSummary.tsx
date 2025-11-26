"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconShoppingCart, IconTruck } from "@tabler/icons-react";
import { OrderDraft, OrderDraftItem } from "@/lib/orderDraftClient";
import { Product } from "@/lib/types/types";
import { getProductById } from "@/lib/api/productApi";

interface CheckoutOrderSummaryProps {
  draft: OrderDraft;
  className?: string;
}

interface OrderItemWithProduct extends OrderDraftItem {
  product?: Product;
}

export default function CheckoutOrderSummary({
  draft,
  className = "",
}: CheckoutOrderSummaryProps) {
  const [itemsWithProducts, setItemsWithProducts] = useState<
    OrderItemWithProduct[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch product details for images
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!draft.items || draft.items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const promises = draft.items.map(async (item) => {
          try {
            const product = await getProductById(item.productId);
            return { ...item, product };
          } catch (error) {
            return item; // Return without product if fetch fails
          }
        });

        const itemsWithProducts = await Promise.all(promises);
        setItemsWithProducts(itemsWithProducts);
      } catch (error) {
        setItemsWithProducts(draft.items);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [draft.items]);

  return (
    <motion.div
      className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-6 h-fit ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <h3 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h3>

      <div className="space-y-4 mb-6">
        {loading
          ? // Loading state
            Array.from({ length: draft.items?.length || 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div className="h-12 w-12 bg-slate-200 rounded-lg flex items-center justify-center shrink-0 animate-pulse">
                  <div className="w-6 h-6 bg-slate-300 rounded"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-slate-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-slate-200 rounded animate-pulse w-16"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-20"></div>
              </div>
            ))
          : itemsWithProducts.map((item, index) => (
              <div key={index} className="flex items-center gap-3 py-2">
                <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.product?.imageUrls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name || item.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <IconShoppingCart className="text-slate-400" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 truncate">
                    {item.product?.name || item.name}
                  </p>
                  <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm text-slate-900">
                  {(item.unitPrice * item.quantity).toLocaleString()}{" "}
                  {item.currency}
                </p>
              </div>
            ))}
      </div>

      <div className="border-t border-slate-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-semibold">
            {draft.totalAmount?.toLocaleString() || 0} {draft.currency || "TRY"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Shipping</span>
          <span className="font-semibold text-emerald-600">Free</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Tax (18%)</span>
          <span className="font-semibold">
            {((draft.totalAmount || 0) * 0.18).toLocaleString()}{" "}
            {draft.currency || "TRY"}
          </span>
        </div>
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between">
            <span className="font-bold text-slate-900">Total</span>
            <span className="font-bold text-xl text-red-600">
              {((draft.totalAmount || 0) * 1.18).toLocaleString()}{" "}
              {draft.currency || "TRY"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <IconTruck size={18} className="text-emerald-600" />
          <span className="text-sm font-semibold text-slate-700">
            Free Shipping
          </span>
        </div>
        <p className="text-xs text-slate-600">
          Your order qualifies for free shipping to anywhere in Turkey.
        </p>
      </div>
    </motion.div>
  );
}
