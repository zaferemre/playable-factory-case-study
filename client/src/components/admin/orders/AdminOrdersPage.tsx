"use client";

import { Package } from "lucide-react";
import { useOrdersManagement } from "@/lib/hooks/useOrdersManagement";
import { LoadingSpinner, EmptyState, ErrorAlert } from "@/components/shared";
import {
  OrderStatsCards,
  OrderFilters,
  OrderCard,
  OrderDetailsModal,
} from "@/components/admin/orders";

export default function AdminOrdersPage() {
  const {
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
    setStatusFilter,
    setSearchTerm,
    handleStatusUpdate,
    openOrderModal,
    closeOrderModal,
    clearError,
  } = useOrdersManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage orders, track shipments, and handle customer requests.
          </p>
        </div>
        <OrderStatsCards statusCounts={statusCounts} />
      </div>

      {/* Error Alert */}
      {error && (
        <ErrorAlert message={error} onDismiss={clearError} />
      )}

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        totalOrderCount={totalOrderCount}
        statusCounts={statusCounts}
      />

      {/* Orders Grid */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Orders Found"
            description={
              searchTerm
                ? "Try adjusting your search terms."
                : "Orders will appear here once customers place them."
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                updating={updatingOrderId === order._id}
                onClick={() => openOrderModal(order)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={closeOrderModal}
        />
      )}
    </div>
  );
}
