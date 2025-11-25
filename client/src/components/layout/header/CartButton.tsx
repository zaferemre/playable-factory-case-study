"use client";

import { motion } from "motion/react";
import { IconShoppingCart } from "@tabler/icons-react";

interface CartButtonProps {
  cartCount: number;
  cartBump: boolean;
  onClick: () => void;
  className?: string;
}

export default function CartButton({
  cartCount,
  cartBump,
  onClick,
  className = "",
}: CartButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Open cart"
      className={`relative group flex items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-sm hover:shadow-md hover:bg-red-50 hover:border-red-200 transition-all duration-300 ${className}`}
      type="button"
      animate={
        cartBump ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] } : { scale: 1 }
      }
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconShoppingCart
        size={22}
        stroke={1.8}
        className="text-slate-700 group-hover:text-red-600 transition-colors duration-300"
      />
      {cartCount > 0 && (
        <motion.span
          className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-lg border-2 border-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </motion.span>
      )}
    </motion.button>
  );
}
