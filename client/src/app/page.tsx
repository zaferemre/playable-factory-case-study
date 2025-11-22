"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/types";
import { getAvailableProducts } from "@/lib/api/productApi";
import ProductList from "@/components/product/ProductList";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAvailableProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="flex w-full flex-col gap-6 p-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Welcome to Playable Shop</h1>
        <p className="max-w-xl text-sm text-slate-600">
          This is the ecommerce case study built with Next.js, TypeScript,
          Tailwind, Redis caching, and an Express backend.
        </p>
      </div>

      {/* FEATURE CARDS */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold">Browse products</h2>
          <p className="text-xs text-slate-600">
            The shop page will show categories, filters, and search.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold">Cart and checkout</h2>
          <p className="text-xs text-slate-600">
            Add products to cart and simulate checkout with a dummy payment.
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-1 text-sm font-semibold">Admin dashboard</h2>
          <p className="text-xs text-slate-600">
            Manage products and view orders and customers.
          </p>
        </div>
      </div>

      {/* PRODUCT SECTION */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Latest products</h2>

        {loading && (
          <p className="text-sm text-slate-500">Loading products...</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-slate-600">No products yet.</p>
        )}

        {/* new product list component */}
        {!loading && !error && products.length > 0 && (
          <ProductList products={products} />
        )}
      </div>
    </section>
  );
}
