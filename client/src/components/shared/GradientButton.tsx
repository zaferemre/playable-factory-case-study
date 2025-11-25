import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface GradientButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "secondary" | "success";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  primary:
    "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-300/50 hover:shadow-red-400/60",
  secondary:
    "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-300/50 hover:shadow-blue-400/60",
  success:
    "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-300/50 hover:shadow-green-400/60",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
  xl: "px-8 sm:px-12 lg:px-24 py-4 sm:py-5 text-lg sm:text-2xl lg:text-3xl",
};

export function GradientButton({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
}: GradientButtonProps) {
  const baseClasses = `
    group inline-flex items-center justify-center rounded-full 
    font-bold text-white shadow-xl transition-all duration-300 
    transform hover:scale-105 active:scale-95 disabled:opacity-50 
    disabled:cursor-not-allowed disabled:hover:scale-100
  `;

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href && !disabled) {
    return (
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link href={href} className={classes}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {children}
    </motion.button>
  );
}
