"use client";

import { motion } from "motion/react";
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
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
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
  );
}
