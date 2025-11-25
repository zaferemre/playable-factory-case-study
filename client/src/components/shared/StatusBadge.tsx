import type { OrderStatus } from "@/lib/types/types";
import { Clock } from "lucide-react";
import { statusConfig } from "../admin/orders";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo?.icon || Clock;

  const fallbackStatusInfo = {
    icon: Clock,
    color: "gray",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-300",
  };

  const displayStatusInfo = statusInfo || fallbackStatusInfo;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-2 text-sm",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${displayStatusInfo.bgColor} ${displayStatusInfo.textColor}`}
    >
      <StatusIcon className={iconSizes[size]} />
      <span className="capitalize">{status}</span>
      {!statusInfo && (
        <span className="text-xs text-red-500 ml-1">(Unknown)</span>
      )}
    </span>
  );
}
