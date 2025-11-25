import Modal from "@/components/shared/Modal";
import type { Order } from "@/lib/types/types";
import { formatUserLabel } from "./orderStatus";
import StatusBadge from "@/components/shared/StatusBadge";
import { MapPin, Package, User, CreditCard } from "lucide-react";

interface OrderDetailsModalProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  onClose,
}: OrderDetailsModalProps) {
  return (
    <Modal onClose={onClose} title="Order Details">
      <div className="space-y-6">
        {/* Order Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order #{order._id.slice(-8)}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Created {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={order.status} size="lg" />
        </div>

        {/* Customer Information */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Customer
            </h4>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {formatUserLabel(order)}
          </p>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Order Summary
            </h4>
          </div>
          <div className="flex justify-between items-center text-lg font-semibold">
            <span className="text-gray-600 dark:text-gray-400">Total</span>
            <span className="text-gray-900 dark:text-white">
              {order.totalAmount} {order.currency}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-4 w-4 text-gray-400" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Items ({order.items.length})
            </h4>
          </div>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.unitPrice} {order.currency} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(item.unitPrice * item.quantity).toFixed(2)} {order.currency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Shipping Address
              </h4>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {order.shippingAddress.line1}
              </p>
              {order.shippingAddress.line2 && (
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.line2}
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {order.shippingAddress.country}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
