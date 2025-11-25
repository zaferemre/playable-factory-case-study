import { Clock, Package, CheckCircle, XCircle } from "lucide-react";
import type { OrderStatus, Order } from "@/lib/types/types";

export const statusOptions: OrderStatus[] = [
  "draft",
  "placed",
  "fulfilled",
  "cancelled",
];

export const statusConfig = {
  draft: {
    icon: Clock,
    color: "gray",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-800 dark:text-gray-300",
  },
  placed: {
    icon: Package,
    color: "blue",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-800 dark:text-blue-300",
  },
  fulfilled: {
    icon: CheckCircle,
    color: "green",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-800 dark:text-green-300",
  },
  cancelled: {
    icon: XCircle,
    color: "red",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    textColor: "text-red-800 dark:text-red-300",
  },
} as const;

export function formatUserLabel(order: Order): string {
  const u = (
    order as { user?: { email?: string; _id?: string } | string } | Order
  ).user;
  if (!u) return "Guest";
  if (typeof u === "string") return `User ${u.slice(-8)}`;
  if (typeof u === "object") {
    if (u.email) return u.email as string;
    if (u._id) return `User ${String(u._id).slice(-8)}`;
  }
  return "Customer";
}
