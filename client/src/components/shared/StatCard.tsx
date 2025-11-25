import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
  value: string | number;
  label: string;
  color?: "red" | "orange" | "purple" | "blue" | "green";
  size?: "sm" | "md" | "lg";
  className?: string;
  delay?: number;
}

const colorClasses = {
  red: "text-red-600",
  orange: "text-orange-600",
  purple: "text-purple-600",
  blue: "text-blue-600",
  green: "text-green-600",
};

const sizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function StatCard({
  value,
  label,
  color = "red",
  size = "md",
  className = "",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      className={`text-center ${className}`}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <div className={`font-bold ${sizeClasses[size]} ${colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-xs text-slate-500 uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
}
