"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { Product, Category } from "@/lib/types/types";
import { getAvailableProducts } from "@/lib/api/productApi";
import { getCategories } from "@/lib/api/categoryApi";

import ProductCard from "@/components/product/ProductCard";
import ShopHeaderBar from "@/components/shop/ShopHeaderBar";
import ShopSidebarFilters from "@/components/shop/ShopSidebarFilters";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconSparkles,
} from "@tabler/icons-react";

type SortOptionKey =
  | "featured"
  | "priceAsc"
  | "priceDesc"
  | "ratingDesc"
  | "ordersDesc";

interface PriceRange {
  min: string;
  max: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: "",
    max: "",
  });
  const [ratingMin, setRatingMin] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortOptionKey>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        setLoading(true);
        const [productsList, categoriesList] = await Promise.all([
          getAvailableProducts(),
          getCategories(),
        ]);
        setProducts(productsList);
        setCategories(categoriesList);
      } catch (err) {
        console.error("Shop page load error", err);
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const maxPrice = useMemo(() => {
    if (!products.length) return 0;
    return Math.max(...products.map((p) => p.price ?? 0));
  }, [products]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedCategoryId("");
    setPriceRange({ min: "", max: "" });
    setRatingMin(null);
    setSortKey("featured");
  };

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => {
        const name = p.name.toLowerCase();
        const slug = p.slug.toLowerCase();
        const description = (p.description || "").toLowerCase();
        return name.includes(q) || slug.includes(q) || description.includes(q);
      });
    }

    // category filter
    if (selectedCategoryId) {
      list = list.filter((p) => {
        if (!p.category) return false;
        if (typeof p.category === "string") {
          return p.category === selectedCategoryId;
        }
        return p.category._id === selectedCategoryId;
      });
    }

    // price filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    list = list.filter(
      (p) => (p.price || 0) >= minPrice && (p.price || 0) <= maxPrice
    );

    // rating filter
    if (ratingMin !== null) {
      list = list.filter((p) => (p.averageRating || 0) >= ratingMin);
    }

    // sorting
    switch (sortKey) {
      case "priceAsc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceDesc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "ratingDesc":
        list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "ordersDesc":
        // Assuming we have an orderCount field, fallback to featured
        list.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
        break;
      default:
        // featured - keep original order or sort by some featured criteria
        break;
    }

    return list;
  }, [products, search, selectedCategoryId, priceRange, ratingMin, sortKey]);

  const shownCount = filteredAndSortedProducts.length;
  const totalCount = products.length;

  const hasActiveFilters = Boolean(
    search.trim() ||
      selectedCategoryId ||
      priceRange.min ||
      priceRange.max ||
      ratingMin !== null ||
      sortKey !== "featured"
  );

  const sortLabelMap: Record<SortOptionKey, string> = {
    featured: "Featured",
    priceAsc: "Price low to high",
    priceDesc: "Price high to low",
    ratingDesc: "Customer reviews",
    ordersDesc: "Most ordered",
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50/30 to-white pt-4">
      {/* Main Content with Sidebar Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
        {/* Header Bar with Sorting */}
        <ShopHeaderBar
          totalCount={totalCount}
          shownCount={shownCount}
          sortKey={sortKey}
          onSortKeyChange={setSortKey}
          hasActiveFilters={hasActiveFilters}
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          sortLabelMap={sortLabelMap}
        />

        <div className="flex gap-6 mt-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="border-r border-slate-100 bg-white pr-4">
              <ShopSidebarFilters
                search={search}
                onSearchChange={setSearch}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={setSelectedCategoryId}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                ratingMin={ratingMin}
                onRatingMinChange={setRatingMin}
                onClearAllFilters={clearAllFilters}
                maxPrice={maxPrice}
                currency="TRY"
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Header with Search and Filter Toggle */}
            <div className="lg:hidden px-6 py-6 bg-white border-b border-slate-100">
              <div className="flex gap-4 items-center mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <IconSearch
                      size={18}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Search cereals..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white shadow-sm text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-full bg-white text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium"
                >
                  <IconFilter size={16} />
                  Filters
                </button>
              </div>

              {/* Mobile Active Filters */}
              {(selectedCategoryId ||
                priceRange.min ||
                priceRange.max ||
                ratingMin !== null) && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-slate-600">
                    Filters:
                  </span>
                  {selectedCategoryId && (
                    <FilterChip
                      label={
                        categories.find((c) => c._id === selectedCategoryId)
                          ?.name || "Category"
                      }
                      onClear={() => setSelectedCategoryId("")}
                    />
                  )}
                  {priceRange.min && (
                    <FilterChip
                      label={`Min: $${priceRange.min}`}
                      onClear={() => setPriceRange((p) => ({ ...p, min: "" }))}
                    />
                  )}
                  {priceRange.max && (
                    <FilterChip
                      label={`Max: $${priceRange.max}`}
                      onClear={() => setPriceRange((p) => ({ ...p, max: "" }))}
                    />
                  )}
                  {ratingMin !== null && (
                    <FilterChip
                      label={`${ratingMin}+ stars`}
                      onClear={() => setRatingMin(null)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Products Section */}
            <section className="p-6 lg:py-12 lg:px-8">
              {loading ? (
                <div className="grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="h-96 animate-pulse rounded-3xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                    />
                  ))}
                </div>
              ) : error ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                    <IconX size={48} className="text-red-400 mx-auto mb-4" />
                    <p className="text-red-700 text-lg font-medium mb-2">
                      {error}
                    </p>
                    <p className="text-red-600 text-sm">
                      Please try refreshing the page
                    </p>
                  </div>
                </motion.div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 max-w-lg mx-auto">
                    <IconSearch
                      size={48}
                      className="text-slate-400 mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">
                      No products found
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Try adjusting your search or filters to find what
                      you&apos;re looking for.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold text-slate-900">
                      {shownCount} Product{shownCount !== 1 ? "s" : ""}
                      {products.length !== shownCount &&
                        ` of ${products.length}`}
                    </h2>
                  </motion.div>

                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filteredAndSortedProducts.map((product, index) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <motion.div
            className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto"
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Mobile Filter Content */}
            <ShopSidebarFilters
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              ratingMin={ratingMin}
              onRatingMinChange={setRatingMin}
              onClearAllFilters={clearAllFilters}
              maxPrice={maxPrice}
              currency="TRY"
            />

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors"
              >
                Show {shownCount} Result{shownCount !== 1 ? "s" : ""}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}

function FilterChip(props: { label: string; onClear: () => void }) {
  const { label, onClear } = props;
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
    >
      <span>{label}</span>
      <IconX size={14} stroke={1.8} className="text-red-500" />
    </button>
  );
}
