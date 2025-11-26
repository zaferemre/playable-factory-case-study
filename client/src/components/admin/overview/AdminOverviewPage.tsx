"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product, Order } from "@/lib/types/types";
import {
  getAdminOverview,
  getAdminProducts,
  type AdminOverview,
} from "@/lib/api/adminApi";
import AdminStats from "./AdminStats";
import SalesChart from "./SalesChart";
import RecentOrders from "./RecentOrders";
import ProductSummary from "./ProductSummary";
import Reviews from "./Reviews";

function useAdminOverviewData() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        setOverviewLoading(true);
        const ov = await getAdminOverview();
        setOverview(ov);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load admin overview"
        );
      } finally {
        setOverviewLoading(false);
      }

      try {
        setProductsLoading(true);
        const list = await getAdminProducts();
        setProducts(list);
      } catch (err: unknown) {
        setError((prev) => prev || "Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    };

    void load();
  }, []);

  return {
    overview,
    products,
    overviewLoading,
    productsLoading,
    error,
  };
}

export default function AdminOverviewPage() {
  const { overview, products, overviewLoading, productsLoading, error } =
    useAdminOverviewData();

  const salesChartData = useMemo(() => {
    if (!overview?.recentOrders || overview.recentOrders.length === 0) {
      return [];
    }

    const byDay = new Map<
      string,
      { dateLabel: string; revenue: number; orders: number }
    >();

    overview.recentOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });

      const entry = byDay.get(key) ?? {
        dateLabel: label,
        revenue: 0,
        orders: 0,
      };
      entry.revenue += o.totalAmount;
      entry.orders += 1;
      byDay.set(key, entry);
    });

    const sortedKeys = Array.from(byDay.keys()).sort();
    return sortedKeys.map((k) => {
      const v = byDay.get(k)!;
      return {
        date: v.dateLabel,
        revenue: v.revenue,
        estimatedProfit: Math.round(v.revenue * 0.3),
        orders: v.orders,
      };
    });
  }, [overview]);

  const latestOrders: Order[] = overview?.recentOrders?.slice(0, 4) ?? [];

  const stats = useMemo(() => {
    const totals = overview?.totals;
    const orderCount = totals?.orders ?? 0;
    const paid = totals?.revenueFulfilled ?? 0; // Fixed: use revenueFulfilled instead of revenuePaid
    const averageOrderValue = orderCount > 0 ? paid / orderCount : 0;

    return {
      orderCount,
      paid,
      pending: totals?.revenuePlaced ?? 0, // Fixed: use revenuePlaced for pending
      averageOrderValue,
      productCount: totals?.products ?? products.length,
      activeProducts: totals?.activeProducts ?? 0,
      userCount: totals?.users ?? 0,
      totalRevenue: totals?.revenueTotal ?? 0,
    };
  }, [overview, products.length]);

  return (
    <div className="space-y-8 min-h-screen bg-gray-50/30 dark:bg-gray-950/30">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Admin dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Summary of sales, products and customers across your shop.
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[11px] shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            Today snapshot
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Orders {stats.orderCount}
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Paid {stats.paid.toFixed(2)} TRY
          </p>
          {stats.averageOrderValue > 0 && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Avg order {stats.averageOrderValue.toFixed(2)} TRY
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-900/30 dark:text-red-100">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <AdminStats stats={stats} loading={overviewLoading} />

      {/* Charts and Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesChart data={salesChartData} loading={overviewLoading} />
        <RecentOrders orders={latestOrders} loading={overviewLoading} />
      </div>

      {/* Product Summary and Reviews */}
      <div className="grid gap-6 md:grid-cols-2">
        <ProductSummary products={products} loading={productsLoading} />
        <Reviews limit={5} />
      </div>
    </div>
  );
}
