import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types/types";
import {
  getAdminOrders,
  type AdminOverview,
  getAdminOverview,
  updateOrderStatus,
} from "@/lib/api/adminApi";
import { formatUserLabel } from "../../components/admin/orders/orderStatus";

export function useOrdersManagement() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load orders data
  useEffect(() => {
    const loadOrders = async () => {
      setError("");
      setLoading(true);
      try {
        const [overviewData, ordersData] = await Promise.all([
          getAdminOverview(),
          getAdminOrders({
            status: statusFilter === "all" ? undefined : statusFilter,
            page: 1,
            limit: 50,
          }),
        ]);
        setOverview(overviewData);
        setOrders(ordersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, [statusFilter]);

  // Filter orders based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredOrders(
        orders.filter(
          (order) =>
            order._id.toLowerCase().includes(term) ||
            formatUserLabel(order).toLowerCase().includes(term) ||
            order.shippingAddress?.fullName?.toLowerCase().includes(term) ||
            order.shippingAddress?.city?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, orders]);

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError("Failed to update order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const clearError = () => setError("");

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<OrderStatus, number>);

  const totalOrderCount = overview?.totals.orders ?? orders.length;

  return {
    // State
    overview,
    orders,
    filteredOrders,
    statusFilter,
    searchTerm,
    loading,
    error,
    updatingOrderId,
    selectedOrder,
    isModalOpen,
    statusCounts,
    totalOrderCount,

    // Actions
    setStatusFilter,
    setSearchTerm,
    handleStatusUpdate,
    openOrderModal,
    closeOrderModal,
    clearError,
  };
}
