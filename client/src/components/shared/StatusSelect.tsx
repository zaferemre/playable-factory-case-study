import { MoreHorizontal } from "lucide-react";
import type { OrderStatus } from "@/lib/types/types";
import { statusOptions } from "../admin/orders/orderStatus";

interface StatusSelectProps {
  value: OrderStatus;
  onChange: (status: OrderStatus) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export default function StatusSelect({
  value,
  onChange,
  disabled = false,
  size = "sm",
}: StatusSelectProps) {
  const sizeClasses = {
    sm: "p-1 pr-6 text-xs",
    md: "p-2 pr-8 text-sm",
  };

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderStatus)}
        disabled={disabled}
        className={`appearance-none bg-transparent border-0 focus:ring-0 cursor-pointer disabled:opacity-50 ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      <MoreHorizontal className="absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
    </div>
  );
}
