"use client";

import { useState, useCallback, useEffect } from "react";
import type React from "react";
import type { Product } from "@/lib/types/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { addItemLocal } from "@/lib/store/cartSlice";
import { addItemToCart, getOrCreateCartSessionId } from "@/lib/api/cartApi";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "motion/react";
import { IconShoppingCart, IconStarFilled } from "@tabler/icons-react";
import ProductQuickViewModal from "./ProductQuickViewModal";

interface ProductCardProps {
  product: Product;
}

function getRatingMeta(product: Product) {
  const hasReviews = product.reviewCount > 0;
  const averageRating =
    product.averageRating && product.averageRating > 0
      ? product.averageRating
      : 0;

  return { hasReviews, averageRating };
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("tr-TR").format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { backendUserId } = useAuth();

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);

  const inStock = product.stockQuantity > 0;
  const primaryImage = product.imageUrls?.[0];
  const { hasReviews, averageRating } = getRatingMeta(product);

  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1200);
    return () => window.clearTimeout(id);
  }, [added]);

  const handleAddToCart = useCallback(
    async (quantity: number, e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!inStock || adding || quantity <= 0) return;

      setAdding(true);

      // optimistic local update, assumes addItemLocal adds 1 unit
      for (let i = 0; i < quantity; i += 1) {
        dispatch(addItemLocal(product));
      }

      const sessionId = getOrCreateCartSessionId();
      setAdded(true);

      void addItemToCart({
        userId: backendUserId ?? undefined,
        sessionId,
        productId: product._id,
        quantity,
      })
        .catch((err) => {
          console.error("Failed to sync cart", err);
        })
        .finally(() => {
          setAdding(false);
        });
    },
    [adding, backendUserId, dispatch, inStock, product]
  );

  const handleCardAddClick = (e: React.MouseEvent) => {
    void handleAddToCart(1, e);
  };

  const openQuickView = () => {
    setModalQuantity(1);
    setIsQuickViewOpen(true);
  };
  const closeQuickView = () => setIsQuickViewOpen(false);

  return (
    <>
      <motion.article
        className="group flex h-full min-h-[320px] md:min-h-[380px] max-w-full md:max-w-sm mx-auto flex-col rounded-3xl border border-white/60 bg-white/80 backdrop-blur-sm p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={openQuickView}
        aria-label={product.name}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Image container with enhanced styling */}
        <div className="relative mb-4 md:mb-6 flex h-40 md:h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 p-3 md:p-4">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-linear-to-br from-red-50/30 to-orange-50/30"></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-red-100 rounded-full blur-xl opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-100 rounded-full blur-lg opacity-50"></div>

          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={product.name}
              className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
              loading="lazy"
            />
          ) : (
            <div className="relative z-10 flex h-full w-full items-center justify-center text-sm text-slate-400 bg-slate-200/50 rounded-xl">
              No image available
            </div>
          )}

          {/* Hover overlay effect */}
          <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
        </div>

        {/* Content - Enhanced styling */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-2 md:space-y-3">
            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight group-hover:text-red-700 transition-colors">
              {product.name}
            </h3>

            {/* Rating row with enhanced styling */}
            <div className="flex items-center gap-2">
              {hasReviews ? (
                <div className="inline-flex items-center gap-1 px-2 md:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs md:text-sm font-medium">
                  <IconStarFilled size={14} className="text-yellow-500" />
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-yellow-600">
                    ({product.reviewCount})
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2 md:px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs md:text-sm">
                  <IconStarFilled size={14} className="text-slate-400" />
                  <span>New</span>
                </div>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  inStock ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  inStock ? "text-green-700" : "text-red-700"
                }`}
              >
                {inStock ? `${product.stockQuantity} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          {/* Price and button with enhanced design */}
          <div className="mt-4 md:mt-6 space-y-3 md:space-y-4">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-slate-900">
                {formatAmount(product.price)}
                <span className="text-base md:text-lg font-medium text-slate-600 ml-1">
                  {product.currency}
                </span>
              </p>
            </div>

            <motion.button
              onClick={handleCardAddClick}
              className={`flex w-full items-center justify-center gap-2 md:gap-3 rounded-2xl py-3 md:py-4 text-xs md:text-sm font-bold text-white shadow-lg transition-all duration-500 disabled:cursor-not-allowed relative overflow-hidden ${
                added
                  ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-200"
                  : adding
                  ? "bg-orange-500 hover:bg-orange-500"
                  : !inStock
                  ? "bg-slate-400"
                  : "bg-red-500 hover:bg-red-400 hover:shadow-xl"
              }`}
              type="button"
              disabled={!inStock}
              whileHover={{
                scale: !inStock ? 1 : 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: !inStock ? 1 : 0.98,
                transition: { duration: 0.1 },
              }}
              animate={{
                scale: added ? [1, 1.05, 1] : 1,
                transition: added
                  ? { duration: 0.6, times: [0, 0.3, 1] }
                  : { duration: 0.2 },
              }}
              aria-label={
                !inStock
                  ? `Out of stock, cannot add ${product.name} to cart`
                  : added
                  ? "Successfully added to cart"
                  : "Add to cart"
              }
            >
              {/* Success animation overlay */}
              {added && (
                <motion.div
                  className="absolute inset-0 bg-emerald-400 rounded-2xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.6 }}
                />
              )}

              {/* Loading spinner */}
              {adding && (
                <motion.div
                  className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Success checkmark */}
              {added && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-white"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Default cart icon */}
              {!adding && !added && (
                <motion.div
                  initial={false}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-white"
                >
                  <IconShoppingCart
                    size={18}
                    className="md:w-5 md:h-5"
                    stroke={1.8}
                  />
                </motion.div>
              )}

              <motion.span
                key={`${adding}-${added}-${!inStock}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!inStock
                  ? "Out of Stock"
                  : adding
                  ? "Adding..."
                  : added
                  ? "Added to Cart!"
                  : "Add to Cart"}
              </motion.span>
            </motion.button>
          </div>
        </div>
      </motion.article>

      <ProductQuickViewModal
        product={product}
        open={isQuickViewOpen}
        onClose={closeQuickView}
        quantity={modalQuantity}
        onQuantityChange={setModalQuantity}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
