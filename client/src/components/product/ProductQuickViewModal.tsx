"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Product } from "@/lib/types/types";
import { motion, AnimatePresence } from "motion/react";
import {
  IconShoppingCart,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconStarFilled,
  IconPackage,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

interface ProductQuickViewModalProps {
  product: Product;
  open: boolean;
  // Client-side event handlers (not Server Actions)
  onClose: () => void;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onAddToCart: (quantity: number, e?: React.MouseEvent) => void;
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

export default function ProductQuickViewModal({
  product,
  open,
  onClose,
  quantity,
  onQuantityChange,
  onAddToCart,
}: ProductQuickViewModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const images =
    product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];
  const activeImage = images[activeIndex] ?? "";
  const inStock = product.stockQuantity > 0;
  const { hasReviews, averageRating } = getRatingMeta(product);
  const reviewCount = product.reviewCount ?? 0;

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => {
        setActiveIndex(0);
        setIsAdding(false);
        setIsAdded(false);
      }, 0);

      if (inStock) {
        const max = product.stockQuantity || 1;
        const safe = Math.min(Math.max(quantity || 1, 1), max);
        if (safe !== quantity) onQuantityChange(safe);
      } else if (quantity !== 0) {
        onQuantityChange(0);
      }

      return () => {
        window.clearTimeout(id);
      };
    }
  }, [open, inStock, product.stockQuantity, quantity, onQuantityChange]);

  // Reset added state after 2 seconds
  useEffect(() => {
    if (!isAdded) return;
    const id = window.setTimeout(() => setIsAdded(false), 2000);
    return () => window.clearTimeout(id);
  }, [isAdded]);

  const clampQuantity = useCallback(
    (value: number) => {
      if (!inStock) return 0;
      const max = product.stockQuantity || 1;
      if (value < 1) return 1;
      if (value > max) return max;
      return value;
    },
    [inStock, product.stockQuantity]
  );

  const handleBackdropClick = () => {
    onClose();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handlePrev = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    if (images.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  const handleDecrease = () => {
    onQuantityChange(clampQuantity(quantity - 1));
  };

  const handleIncrease = () => {
    onQuantityChange(clampQuantity(quantity + 1));
  };

  const handleAddClick = async (e: React.MouseEvent) => {
    if (isAdding || !inStock) return;

    setIsAdding(true);
    try {
      await onAddToCart(quantity, e);
      setIsAdded(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 md:px-8 md:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          aria-modal="true"
          role="dialog"
          aria-label={`Quick view for ${product.name}`}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="flex w-full max-w-sm sm:max-w-lg md:max-w-4xl mx-auto flex-col overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-2xl border border-slate-100/50 md:flex-row backdrop-blur-sm max-h-[90vh] md:max-h-none"
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 20, opacity: 0 }}
            transition={{ duration: 0.23, ease: "easeOut" }}
            onClick={handleCardClick}
            tabIndex={-1}
          >
            {/* Gallery side */}
            <div className="w-full bg-linear-to-br from-slate-50 via-red-50/20 to-orange-50/30 md:w-1/2">
              <div className="relative h-64 sm:h-72 md:h-96 lg:h-full w-full overflow-hidden bg-linear-to-br from-slate-100 to-slate-50 p-3 sm:p-4 md:p-6 flex items-center justify-center">
                {/* Decorative background elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-red-100 rounded-full blur-2xl opacity-40"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-orange-100 rounded-full blur-xl opacity-30"></div>

                {activeImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="relative z-10 max-h-full max-w-full object-contain rounded-2xl shadow-lg"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    No images for this product
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <motion.button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-2 sm:left-4 top-1/2 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 shadow-lg hover:bg-white transition-all border border-white/50 z-30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconChevronLeft
                        size={16}
                        className="sm:w-5 sm:h-5"
                        stroke={2}
                      />
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-2 sm:right-4 top-1/2 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 shadow-lg hover:bg-white transition-all border border-white/50 z-30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconChevronRight
                        size={16}
                        className="sm:w-5 sm:h-5"
                        stroke={2}
                      />
                    </motion.button>
                  </>
                )}

                <motion.button
                  type="button"
                  onClick={onClose}
                  className="absolute right-2 sm:right-4 top-2 sm:top-4 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur-sm text-slate-700 shadow-lg hover:bg-white hover:text-red-600 transition-all border border-white/50 z-40"
                  aria-label="Close quick view"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconX size={16} className="sm:w-5 sm:h-5" stroke={2} />
                </motion.button>
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto border-t border-slate-200/50 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3">
                  {images.map((src, idx) => (
                    <motion.button
                      key={src + idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`relative h-12 w-14 sm:h-16 sm:w-18 shrink-0 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all duration-200 ${
                        idx === activeIndex
                          ? "border-red-400 shadow-md scale-105"
                          : "border-slate-200 hover:border-red-200 hover:scale-102"
                      }`}
                      whileHover={{ scale: idx === activeIndex ? 1.05 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Info side */}
            <div className="flex w-full flex-col gap-4 sm:gap-6 p-4 sm:p-6 md:w-1/2 md:p-8 bg-linear-to-br from-white to-slate-50/30 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Playable Cereal
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                    {product.name}
                  </h2>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-600 font-medium">
                    Product ID: {product.slug}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {formatAmount(product.price)}
                      <span className="text-base sm:text-lg font-medium text-slate-600 ml-1 sm:ml-2">
                        {product.currency}
                      </span>
                    </p>
                  </div>
                  <div>
                    <div
                      className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      <IconPackage
                        size={14}
                        className="sm:w-4 sm:h-4"
                        stroke={1.8}
                      />
                      <span>
                        {inStock
                          ? `${product.stockQuantity} in stock`
                          : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
                {hasReviews && reviewCount > 0 ? (
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-medium">
                    <IconStarFilled
                      size={14}
                      className="sm:w-4 sm:h-4 text-yellow-500"
                    />
                    <span>{averageRating.toFixed(1)}</span>
                    <span className="text-yellow-600">({reviewCount})</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs sm:text-sm">
                    <IconStarFilled
                      size={14}
                      className="sm:w-4 sm:h-4 text-slate-400"
                    />
                    <span>New product</span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100">
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">
                  Description
                </h3>
                <div className="max-h-24 sm:max-h-32 overflow-y-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description ||
                    "No description added for this cereal."}
                </div>
              </div>

              {/* Quantity */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-100">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    Quantity
                  </span>
                  <div className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-slate-50 px-2 sm:px-3 py-1 sm:py-2 border border-slate-200">
                    <motion.button
                      type="button"
                      onClick={handleDecrease}
                      disabled={!inStock || quantity <= 1}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-red-300 disabled:opacity-40 transition-colors"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      aria-label="Decrease quantity"
                    >
                      <IconMinus
                        size={14}
                        className="sm:w-4 sm:h-4"
                        stroke={2}
                      />
                    </motion.button>
                    <motion.span
                      className="min-w-6 sm:min-w-8 text-center text-xs sm:text-sm font-bold text-slate-800"
                      key={quantity}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.15 }}
                    >
                      {quantity}
                    </motion.span>
                    <motion.button
                      type="button"
                      onClick={handleIncrease}
                      disabled={!inStock}
                      className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm border border-slate-200 hover:border-red-300 disabled:opacity-40 transition-colors"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      aria-label="Increase quantity"
                    >
                      <IconPlus
                        size={14}
                        className="sm:w-4 sm:h-4"
                        stroke={2}
                      />
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-3 sm:space-y-4">
                <motion.button
                  type="button"
                  onClick={handleAddClick}
                  className={`flex w-full items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl py-3 sm:py-4 text-sm sm:text-base font-bold text-white shadow-lg transition-all duration-500 disabled:cursor-not-allowed relative overflow-hidden ${
                    isAdded
                      ? "bg-emerald-500 hover:bg-emerald-500 shadow-emerald-200"
                      : isAdding
                      ? "bg-orange-500 hover:bg-orange-500"
                      : !inStock
                      ? "bg-slate-400 shadow-none"
                      : "bg-red-500 hover:bg-red-400 hover:shadow-xl"
                  }`}
                  disabled={!inStock}
                  whileTap={{ scale: !inStock ? 1 : 0.98 }}
                  whileHover={{ scale: !inStock ? 1 : 1.02 }}
                  animate={{
                    scale: isAdded ? [1, 1.05, 1] : 1,
                    transition: isAdded
                      ? { duration: 0.6, times: [0, 0.3, 1] }
                      : { duration: 0.2 },
                  }}
                  aria-label={
                    inStock
                      ? isAdded
                        ? "Successfully added to cart"
                        : `Add ${quantity} ${product.name} to cart`
                      : "Out of stock"
                  }
                >
                  {/* Success animation overlay */}
                  {isAdded && (
                    <motion.div
                      className="absolute inset-0 bg-emerald-400 rounded-xl sm:rounded-2xl"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
                      transition={{ duration: 0.6 }}
                    />
                  )}

                  {/* Loading spinner */}
                  {isAdding && (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}

                  {/* Success checkmark */}
                  {isAdded && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="text-white z-10"
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
                  {!isAdding && !isAdded && (
                    <IconShoppingCart
                      size={18}
                      className="sm:w-5 sm:h-5"
                      stroke={2}
                    />
                  )}

                  <motion.span
                    key={`${isAdding}-${isAdded}-${!inStock}`}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="z-10"
                  >
                    {!inStock
                      ? "Out of Stock"
                      : isAdding
                      ? "Adding to Cart..."
                      : isAdded
                      ? "Added to Cart!"
                      : "Add to Cart"}
                  </motion.span>
                </motion.button>

                <motion.div
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl border-2 border-slate-200 bg-white py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-red-200"
                  >
                    View Full Details
                  </Link>
                </motion.div>

                <p className="text-center text-xs text-slate-500 px-2 sm:px-4 leading-relaxed">
                  Free shipping on orders over ₺200. Taxes calculated at
                  checkout.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
