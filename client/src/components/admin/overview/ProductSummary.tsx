"use client";

import { Package, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import type { Product } from "@/lib/types/types";

interface ProductSummaryProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductSummary({
  products,
  loading,
}: ProductSummaryProps) {
  const getTopProducts = () => {
    return products
      .sort((a, b) => (b.totalUnitsSold || 0) - (a.totalUnitsSold || 0))
      .slice(0, 5);
  };

  const getLowStockProducts = () => {
    return products
      .filter((product) => (product.stockQuantity || 0) < 10)
      .sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0))
      .slice(0, 3);
  };

  const topProducts = getTopProducts();
  const lowStockProducts = getLowStockProducts();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Product Overview
        </h2>
        {loading && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Loading...
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Top Products Section */}
        <div>
          <div className="mb-2 flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Top Selling
            </h3>
          </div>
          <div className="space-y-2">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100 dark:bg-green-900/30">
                      <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {product.totalUnitsSold || 0} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${product.price}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ${(product.totalRevenue || 0).toFixed(0)} revenue
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No sales data available
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Section */}
        {lowStockProducts.length > 0 && (
          <div>
            <div className="mb-2 flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Low Stock Alert
              </h3>
            </div>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between rounded-lg bg-orange-50 p-2 dark:bg-orange-900/20"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-100 dark:bg-orange-900/30">
                      <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </p>
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        Only {product.stockQuantity || 0} left
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      ${product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Total Products
                </p>
                <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                  {products.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-purple-50 p-2 dark:bg-purple-900/20">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Avg Price
                </p>
                <p className="text-lg font-semibold text-purple-800 dark:text-purple-300">
                  $
                  {products.length > 0
                    ? (
                        products.reduce((sum, p) => sum + p.price, 0) /
                        products.length
                      ).toFixed(0)
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
