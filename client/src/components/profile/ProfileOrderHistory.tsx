import { motion } from "framer-motion";
import { IconPackage, IconEye } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/types/types";
import StatusBadge from "@/components/shared/StatusBadge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ProfileEmptyState from "./ProfileEmptyState";

interface ProfileOrderHistoryProps {
  orders: Order[];
  ordersLoading: boolean;
}

export function ProfileOrderHistory({
  orders,
  ordersLoading,
}: ProfileOrderHistoryProps) {
  const router = useRouter();

  if (ordersLoading) {
    return (
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
          <IconPackage className="w-5 h-5 mr-2" />
          Order History
        </h2>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
        <IconPackage className="w-5 h-5 mr-2" />
        Order History
      </h2>

      {orders.length === 0 ? (
        <ProfileEmptyState
          icon={IconPackage}
          title="No Orders Yet"
          description="You haven't placed any orders yet. Start shopping to see your order history here."
          actionLabel="Shop Now"
          onAction={() => router.push("/shop")}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Order #{order.clientOrderId || order._id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <StatusBadge status={order.status} size="sm" />
                  <motion.button
                    onClick={() =>
                      router.push(`/order/${order.clientOrderId || order._id}`)
                    }
                    className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconEye className="w-4 h-4" />
                    <span>View</span>
                  </motion.button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Amount:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Items:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {order.shippingAddress && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping to:
                    </span>
                    <span className="text-gray-900 dark:text-white text-right">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Items Preview */}
              {order.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {order.items.slice(0, 3).map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.quantity}x
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
