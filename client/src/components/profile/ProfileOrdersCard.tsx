"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import type { Order } from "@/lib/types/types";
import OrderDetailsModal from "@/components/admin/orders/OrderDetailsModal";
import {
  IconPackage,
  IconClock,
  IconCheck,
  IconTruck,
  IconX,
  IconEye,
  IconChevronRight,
} from "@tabler/icons-react";

interface ProfileOrdersCardProps {
  orders: Order[];
  loading: boolean;
  formatCurrency: (amount: number, currency: string) => string;
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return <IconClock size={14} className="text-yellow-600" />;
    case "confirmed":
    case "processing":
      return <IconPackage size={14} className="text-blue-600" />;
    case "shipped":
      return <IconTruck size={14} className="text-purple-600" />;
    case "delivered":
      return <IconCheck size={14} className="text-green-600" />;
    case "cancelled":
      return <IconX size={14} className="text-red-600" />;
    default:
      return <IconClock size={14} className="text-slate-400" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function ProfileOrdersCard({
  orders,
  loading,
  formatCurrency,
}: ProfileOrdersCardProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  return (
    <motion.div
      className="rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-4 sm:p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-slate-900">
              <IconPackage size={16} className="text-white sm:hidden" />
              <IconPackage size={20} className="text-white hidden sm:block" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">
                Track your order history
              </p>
            </div>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              Loading...
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <IconPackage size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-slate-600 mb-4">
              Start shopping to see your order history here!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
            >
              Start Shopping
              <IconChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <motion.div
                key={order._id}
                className="group relative rounded-2xl border border-slate-200/50 bg-white/50 hover:bg-white/80 p-3 sm:p-4 transition-all duration-200 hover:shadow-md"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500">
                        #{order._id.slice(-8)}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-base sm:text-lg font-bold text-slate-900">
                          {formatCurrency(order.totalAmount, order.currency)}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end sm:text-right">
                        <div className="sm:mr-4">
                          <p className="text-xs sm:text-sm text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100/50 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <IconEye size={14} className="sm:hidden" />
                          <IconEye size={16} className="hidden sm:block" />
                          <span className="hidden sm:inline">View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {orders.length > 5 && (
              <div className="text-center pt-4 border-t border-slate-200/50">
                <p className="text-xs sm:text-sm text-slate-500 mb-3">
                  Showing {Math.min(5, orders.length)} of {orders.length} orders
                </p>
                <Link
                  href="/profile?tab=orders"
                  className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  View All Orders
                  <IconChevronRight size={14} className="sm:hidden" />
                  <IconChevronRight size={16} className="hidden sm:block" />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </motion.div>
  );
}
