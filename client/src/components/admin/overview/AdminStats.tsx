"use client";

import { Package, Users, DollarSign, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  loading?: boolean;
}

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  loading,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {loading ? "..." : value}
      </p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {subtitle}
      </p>
    </div>
  );
}

interface AdminStatsProps {
  stats: {
    productCount: number;
    activeProducts: number;
    userCount: number;
    orderCount: number;
    totalRevenue: number;
    paid: number;
    averageOrderValue: number;
  };
  loading: boolean;
}

export default function AdminStats({ stats, loading }: AdminStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Products"
        value={stats.productCount}
        subtitle={`${stats.activeProducts} active`}
        icon={Package}
        loading={loading}
      />

      <StatsCard
        title="Customers"
        value={stats.userCount}
        subtitle={`${stats.orderCount} orders`}
        icon={Users}
        loading={loading}
      />

      <StatsCard
        title="Revenue"
        value={`${stats.totalRevenue.toFixed(0)} TRY`}
        subtitle={`${stats.paid.toFixed(0)} fulfilled`}
        icon={DollarSign}
        loading={loading}
      />

      <StatsCard
        title="Avg Order"
        value={
          stats.averageOrderValue > 0
            ? `${stats.averageOrderValue.toFixed(0)} TRY`
            : "0 TRY"
        }
        subtitle={`${stats.orderCount} total orders`}
        icon={TrendingUp}
        loading={loading}
      />
    </div>
  );
}
