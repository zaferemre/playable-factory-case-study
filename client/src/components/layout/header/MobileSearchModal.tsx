"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { IconX, IconSearch, IconStarFilled } from "@tabler/icons-react";
import type { Product } from "@/lib/types/types";

interface MobileSearchModalProps {
  isOpen: boolean;
  searchQuery: string;
  searchResults: Product[];
  searchLoading: boolean;
  onClose: () => void;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
}

export default function MobileSearchModal({
  isOpen,
  searchQuery,
  searchResults,
  searchLoading,
  onClose,
  onSearchChange,
  onClearSearch,
}: MobileSearchModalProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white shadow-xl"
          >
            {/* Search Header */}
            <div className="flex items-center gap-4 p-4 border-b border-slate-100">
              <div className="flex-1 relative">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
                  <IconSearch
                    size={18}
                    stroke={1.8}
                    className="text-slate-600"
                  />
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search cereals..."
                    className="flex-1 bg-transparent text-sm text-slate-800 outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={onClearSearch}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors"
                    >
                      <IconX
                        size={14}
                        stroke={1.8}
                        className="text-slate-600"
                      />
                    </button>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <IconX size={20} stroke={1.8} className="text-slate-600" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery.trim().length > 0 && (
                <>
                  {searchLoading && (
                    <div className="px-4 py-6 text-center">
                      <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                        Searching products...
                      </div>
                    </div>
                  )}

                  {!searchLoading && searchResults.length === 0 && (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-slate-500">
                        No products found.
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Try different keywords
                      </p>
                    </div>
                  )}

                  {!searchLoading && searchResults.length > 0 && (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product.slug}`}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                          onClick={onClose}
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            {product.imageUrls?.[0] ? (
                              <img
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                              {product.description || "No description yet"}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-sm font-semibold text-slate-900">
                                {product.price} {product.currency}
                              </span>
                              {product.reviewCount > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                                  <IconStarFilled
                                    size={12}
                                    className="text-yellow-400"
                                  />
                                  {product.averageRating.toFixed(1)} (
                                  {product.reviewCount})
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}

                      {searchResults.length > 0 && (
                        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50">
                          <Link
                            href={`/shop?q=${encodeURIComponent(
                              searchQuery.trim()
                            )}`}
                            className="block text-center text-sm font-medium text-slate-900 hover:text-red-600 transition-colors"
                            onClick={onClose}
                          >
                            View all results for &ldquo;{searchQuery.trim()}
                            &rdquo;
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {searchQuery.trim().length === 0 && (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-slate-500">
                    Start typing to search products
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
