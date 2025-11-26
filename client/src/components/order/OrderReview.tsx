"use client";

import { useState, useEffect } from "react";
import { IconShoppingCart } from "@tabler/icons-react";
import type { OrderAddress, Product } from "@/lib/types/types";
import type { OrderDraft, OrderDraftItem } from "@/lib/orderDraftClient";
import { getProductById } from "@/lib/api/productApi";

interface OrderReviewProps {
  addressData: OrderAddress;
  draft: OrderDraft;
}

interface OrderItemWithProduct extends OrderDraftItem {
  product?: Product;
}

export default function OrderReview({ addressData, draft }: OrderReviewProps) {
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
  }, [draft]);
  return (
    <div className="space-y-6">
      {/* Delivery Address */}
      <div className="bg-slate-50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Delivery Address
        </h3>
        <div className="text-sm text-slate-700 space-y-1">
          <p className="font-semibold">{addressData.fullName}</p>
          <p>{addressData.phone}</p>
          <p>{addressData.email}</p>
          <div className="mt-2 pt-2 border-t border-slate-200">
            <p>{addressData.line1}</p>
            {addressData.line2 && <p>{addressData.line2}</p>}
            <p>
              {addressData.city}, {addressData.state} {addressData.postalCode}
            </p>
            <p>{addressData.country}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      {draft && draft.items && (
        <div className="bg-slate-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Order Items
          </h3>
          {loading ? (
            <div className="space-y-4">
              {draft.items.map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white rounded-xl p-4"
                >
                  <div className="h-16 w-16 bg-slate-200 rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-24 animate-pulse"></div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-20 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {itemsWithProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white rounded-xl p-4"
                >
                  <div className="h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                    {item.product?.imageUrls?.[0] ? (
                      <img
                        src={item.product.imageUrls[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <IconShoppingCart className="text-slate-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {(item.unitPrice * item.quantity).toLocaleString()}{" "}
                    {item.currency}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
