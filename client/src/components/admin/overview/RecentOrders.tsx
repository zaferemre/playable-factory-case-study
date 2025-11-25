"use client";

import { ShoppingCart } from "lucide-react";
import type { Order } from "@/lib/types/types";

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
}

export default function RecentOrders({ orders, loading }: RecentOrdersProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "fulfilled":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "placed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Recent orders
        </h2>
        {loading && (
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Loading...
          </span>
        )}
      </div>

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <ShoppingCart className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    #{order._id.slice(-8)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {order.totalAmount} {order.currency}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              No orders yet
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Orders will appear here once customers start purchasing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
