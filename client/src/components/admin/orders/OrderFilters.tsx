import { Search, Filter } from "lucide-react";
import type { OrderStatus } from "@/lib/types/types";
import { statusOptions } from "./orderStatus";

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusFilterChange: (filter: OrderStatus | "all") => void;
  totalOrderCount: number;
  statusCounts: Record<OrderStatus, number>;
}

export default function OrderFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalOrderCount,
  statusCounts,
}: OrderFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, or city..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as OrderStatus | "all")
            }
            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white transition-colors"
          >
            <option value="all">All Orders ({totalOrderCount})</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)} (
                {statusCounts[status] || 0})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
