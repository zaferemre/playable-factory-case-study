"use client";

import type { Product } from "@/lib/types/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItemLocal } from "@/lib/store/cartSlice";
import { addItemToCart, getOrCreateCartSessionId } from "@/lib/api/cartApi";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { backendUserId } = useAuth();

  const handleAddToCart = async () => {
    dispatch(addItemLocal(product));

    const sessionId = getOrCreateCartSessionId();
    void addItemToCart({
      userId: backendUserId,
      sessionId,
      productId: product._id,
      quantity: 1,
    }).catch((err) => console.error("Failed to sync cart", err));
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm hover:shadow transition p-4">
      <div className="aspect-square bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-400 overflow-hidden">
        {product.imageUrls?.[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="h-full w-full object-cover rounded"
          />
        ) : (
          <span className="text-xs">No image</span>
        )}
      </div>

      <h3 className="font-medium text-sm">{product.name}</h3>
      <p className="text-xs text-slate-500 mb-1">
        {product.description || "No description"}
      </p>

      <p className="font-semibold text-sm mb-3">
        {product.price} {product.currency}
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Add to cart
      </button>
    </div>
  );
}
