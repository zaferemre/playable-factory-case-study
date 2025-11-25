import type { OrderStatus } from "@/lib/types/types";
import { statusOptions, statusConfig } from "./orderStatus";

interface OrderStatsCardsProps {
  statusCounts: Record<OrderStatus, number>;
}

export default function OrderStatsCards({
  statusCounts,
}: OrderStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {statusOptions.map((status) => {
        const count = statusCounts[status] || 0;
        const statusInfo = statusConfig[status];
        const StatusIcon = statusInfo.icon;

        return (
          <div
            key={status}
            className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${statusInfo.textColor}`} />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                {status}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
              {count}
            </p>
          </div>
        );
      })}
    </div>
  );
}
