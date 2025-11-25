"use client";

import type { Product } from "@/lib/types/types";
import ProductCard from "@/components/product/ProductCard";

interface ShopProductsProps {
  products: Product[];
  loading: boolean;
  error: string;
}

export default function ShopProducts({
  products,
  loading,
  error,
}: ShopProductsProps) {
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="h-64 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!loading && !error && products.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No products match these filters. Try clearing some filters or adjusting
        the price range.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
