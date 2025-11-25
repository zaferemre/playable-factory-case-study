import { MapPin, Calendar, DollarSign, Package } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types/types";
import { formatUserLabel } from "./orderStatus";
import StatusBadge from "@/components/shared/StatusBadge";
import StatusSelect from "@/components/shared/StatusSelect";

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
  updating: boolean;
  onClick: () => void;
}

export default function OrderCard({
  order,
  onStatusUpdate,
  updating,
  onClick,
}: OrderCardProps) {
  const handleStatusUpdate = (newStatus: OrderStatus) => {
    onStatusUpdate(order._id, newStatus);
  };

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200 dark:border-gray-800 dark:bg-gray-900 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                #{order._id.slice(-8)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatUserLabel(order)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {order.totalAmount} {order.currency}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {order.items.length} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
            {order.shippingAddress && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400 truncate">
                  {order.shippingAddress.city}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={order.status} size="sm" />
          <StatusSelect
            value={order.status}
            onChange={handleStatusUpdate}
            disabled={updating}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
