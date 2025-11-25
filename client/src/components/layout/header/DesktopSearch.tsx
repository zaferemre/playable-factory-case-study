"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { IconX, IconSearch, IconStarFilled } from "@tabler/icons-react";
import type { Product } from "@/lib/types/types";

interface DesktopSearchProps {
  searchQuery: string;
  searchResults: Product[];
  searchLoading: boolean;
  isSearchActive: boolean;
  onSearchChange: (query: string) => void;
  onSearchOpen: () => void;
  onSearchClose: () => void;
  onClearSearch: () => void;
}

export default function DesktopSearch({
  searchQuery,
  searchResults,
  searchLoading,
  isSearchActive,
  onSearchChange,
  onSearchOpen,
  onSearchClose,
  onClearSearch,
}: DesktopSearchProps) {
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        onSearchClose();
      }
    };

    if (isSearchActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchActive, onSearchClose]);

  const showDropdown =
    isSearchActive &&
    searchQuery.trim().length > 0 &&
    (searchResults.length > 0 || searchLoading);

  const handleSearchClick = () => {
    if (!isSearchActive) {
      onSearchOpen();
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  return (
    <div
      ref={searchContainerRef}
      className="relative max-w-xs flex-1 lg:max-w-sm"
    >
      <motion.div
        layout
        className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm shadow-sm cursor-text transition-all duration-200 ${
          isSearchActive
            ? "w-full px-4 py-2"
            : "h-10 w-10 justify-center hover:bg-slate-100/50"
        }`}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleSearchClick}
      >
        <IconSearch size={18} stroke={1.8} className="text-slate-600" />
        {isSearchActive && (
          <>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search cereals"
              className="h-7 flex-1 bg-transparent text-xs text-slate-800 outline-none md:text-sm"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearSearch();
                  searchInputRef.current?.focus();
                }}
              >
                <IconX size={12} stroke={1.8} />
              </button>
            )}
            <button
              type="button"
              aria-label="Close search"
              className="hidden h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                onSearchClose();
              }}
            >
              <IconX size={12} stroke={1.8} />
            </button>
          </>
        )}
      </motion.div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-[110%] z-40 mt-1 rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm">
          <div className="max-h-80 overflow-y-auto">
            {searchLoading && (
              <div className="px-3 py-3 text-xs text-slate-500">
                Searching products...
              </div>
            )}

            {!searchLoading && searchResults.length === 0 && (
              <div className="px-3 py-3 text-xs text-slate-500">
                No products found.
              </div>
            )}

            {!searchLoading &&
              searchResults.map((product) => (
                <Link
                  key={product._id}
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 text-xs hover:bg-slate-50"
                  onClick={onSearchClose}
                >
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-slate-100">
                    {product.imageUrls?.[0] ? (
                      <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="line-clamp-1 text-[11px] font-semibold text-slate-900">
                      {product.name}
                    </span>
                    <span className="line-clamp-1 text-[10px] text-slate-500">
                      {product.description || "No description yet"}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] font-semibold text-slate-900">
                      {product.price} {product.currency}
                    </span>
                    {product.reviewCount > 0 && (
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] text-slate-500">
                        <IconStarFilled
                          size={10}
                          stroke={1.7}
                          className="text-yellow-400"
                        />
                        <span>
                          {product.averageRating.toFixed(1)} (
                          {product.reviewCount})
                        </span>
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2.5">
            <span className="text-[10px] text-slate-500">
              Press enter to search all results
            </span>
            <Link
              href={`/shop?q=${encodeURIComponent(searchQuery.trim())}`}
              className="text-[10px] font-semibold text-slate-900 hover:underline"
              onClick={onSearchClose}
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
