"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/types";
import { getAvailableProducts } from "@/lib/api/productApi";
import ProductList from "@/components/product/ProductList";
import Hero from "@/components/home/Hero";

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
    <main className="w-full">
      {/* HERO, increased scale and removed container padding */}
      <div className="w-full">
        <Hero />
      </div>

      {/* MAIN CONTENT */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        {/* HEADER */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            Welcome to PlayableFactory Cereal Shop
          </h2>
          <p className="max-w-xl text-base text-slate-600">
            A case study ecommerce experience built with Next.js, TypeScript,
            Tailwind, Redis caching and an Express backend.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold">Browse cereals</h3>
            <p className="text-sm text-slate-600">
              Explore fun flavors, playful boxes and limited editions.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold">Cart and checkout</h3>
            <p className="text-sm text-slate-600">
              Add cereals to cart and simulate checkout with a dummy payment.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-base font-semibold">Admin dashboard</h3>
            <p className="text-sm text-slate-600">
              Manage cereal products and view example orders and customers.
            </p>
          </div>
        </div>

        {/* PRODUCT SECTION */}
        <div className="mt-4">
          <h2 className="mb-4 text-xl font-semibold">Latest cereals</h2>

          {loading && (
            <p className="text-sm text-slate-500">Loading products...</p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="text-sm text-slate-600">No products yet.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <ProductList products={products} />
          )}
        </div>
      </section>
    </main>
  );
}
