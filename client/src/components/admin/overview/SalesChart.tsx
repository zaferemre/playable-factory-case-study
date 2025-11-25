"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface SalesChartData {
  date: string;
  revenue: number;
  estimatedProfit: number;
  orders: number;
}

interface SalesChartProps {
  data: SalesChartData[];
  loading?: boolean;
}

export default function SalesChart({ data, loading }: SalesChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Sales and estimated profit
          </h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Based on recent orders
          </p>
        </div>
        {loading && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Loading...
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              No sales data yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Chart will appear when you have orders
            </p>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickMargin={8} />
              <YAxis tick={{ fontSize: 10 }} tickMargin={4} width={60} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  borderColor: "#e2e8f0",
                  fontSize: 11,
                }}
                formatter={(value, name) => [
                  `${Number(value).toFixed(2)} TRY`,
                  name === "revenue" ? "Revenue" : "Est. Profit",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#ef4444"
                fill="#fee2e2"
                strokeWidth={2}
                name="revenue"
              />
              <Area
                type="monotone"
                dataKey="estimatedProfit"
                stroke="#22c55e"
                fill="#dcfce7"
                strokeWidth={2}
                name="estimatedProfit"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
