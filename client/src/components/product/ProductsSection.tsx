"use client";

import { motion } from "motion/react";
import {
  IconSparkles,
  IconShoppingCart,
  IconArrowRight,
  IconStar,
} from "@tabler/icons-react";
import type { Product } from "@/lib/types/types";
import ProductList from "./ProductList";
import Link from "next/link";

interface ProductsSectionProps {
  products: Product[];
  loading: boolean;
  error: string;
}

export default function ProductsSection({
  products,
  loading,
  error,
}: ProductsSectionProps) {
  const hasProducts = !loading && !error && products.length > 0;

  return (
    <section className="w-full py-16 lg:py-24 bg-gradient-to-br from-white via-red-50/20 to-orange-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-red-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl"></div>
      </div>

      {/* Floating cereal pieces */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-br from-red-300 to-orange-400 rounded-full opacity-20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full text-sm font-medium mb-8 shadow-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <IconSparkles size={16} />
            Our Signature Collection
          </motion.div>

          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 mb-6">
            Premium
            <span className="text-red-600 ml-4">Cereal Experience</span>
          </h2>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover our handcrafted cereal collection, where every bowl
            delivers the perfect fusion of exceptional taste, premium nutrition,
            and gaming-inspired fun.
          </p>

          {hasProducts && (
            <motion.div
              className="flex items-center justify-center gap-2 mt-8 text-slate-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <IconStar size={16} className="text-yellow-500" />
              <span className="text-lg">
                <span className="font-bold text-slate-700">
                  {products.length}
                </span>{" "}
                signature flavor{products.length > 1 ? "s" : ""} available
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Products Display */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="h-80 animate-pulse rounded-3xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-700 text-lg font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-2">
                Please try refreshing the page
              </p>
            </div>
          </motion.div>
        )}

        {!loading && !error && products.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 max-w-lg mx-auto">
              <IconSparkles size={48} className="text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                Coming Soon!
              </h3>
              <p className="text-slate-600">
                Our amazing cereal collection is being prepared. Check back soon
                for delicious updates!
              </p>
            </div>
          </motion.div>
        )}

        {hasProducts && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ProductList products={products.slice(0, 4)} />
          </motion.div>
        )}

        {/* Call to Action */}
        {hasProducts && (
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-600 mb-8 text-lg">
              Ready to transform your breakfast experience?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 
                  text-white font-semibold rounded-full hover:from-red-500 hover:to-red-400 
                  transition-all duration-300 shadow-lg hover:shadow-red-500/25 gap-2 text-lg"
                >
                  <IconShoppingCart size={24} />
                  Shop All Products
                  <IconArrowRight size={20} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-white/80 backdrop-blur-sm
                  text-slate-700 font-semibold rounded-full hover:bg-white 
                  transition-all duration-300 border border-slate-200 hover:border-slate-300 gap-2 text-lg shadow-sm hover:shadow-md"
                >
                  Learn Our Story
                  <IconArrowRight size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
