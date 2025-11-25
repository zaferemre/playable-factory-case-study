import { motion } from "motion/react";
import {
  IconMinus,
  IconPlus,
  IconShoppingCart,
  IconCheck,
} from "@tabler/icons-react";

interface ProductPurchaseSectionProps {
  quantity: number;
  stockQuantity: number;
  inStock: boolean;
  adding: boolean;
  added: boolean;
  onQuantityChange: (delta: number) => void;
  onAddToCart: () => void;
}

export default function ProductPurchaseSection({
  quantity,
  stockQuantity,
  inStock,
  adding,
  added,
  onQuantityChange,
  onAddToCart,
}: ProductPurchaseSectionProps) {
  return (
    <div className="space-y-6">
      {inStock && (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">Quantity:</span>
          <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-2">
            <motion.button
              type="button"
              onClick={() => onQuantityChange(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconMinus size={18} className="text-slate-600" />
            </motion.button>
            <span className="mx-6 text-lg font-bold text-slate-900 min-w-8 text-center">
              {quantity}
            </span>
            <motion.button
              type="button"
              onClick={() => onQuantityChange(1)}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconPlus size={18} className="text-slate-600" />
            </motion.button>
          </div>
          <span className="text-sm text-slate-500">
            Max {stockQuantity} available
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          type="button"
          onClick={onAddToCart}
          disabled={!inStock || adding}
          className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold text-white shadow-xl transition-all ${
            added
              ? "bg-emerald-500 hover:bg-emerald-400"
              : "bg-red-500 hover:bg-red-400"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          whileHover={!adding ? { scale: 1.02, y: -2 } : {}}
          whileTap={!adding ? { scale: 0.98 } : {}}
        >
          {adding ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : added ? (
            <IconCheck size={20} stroke={2} />
          ) : (
            <IconShoppingCart size={20} stroke={2} />
          )}
          <span>
            {!inStock
              ? "Out of Stock"
              : added
              ? "Added to Cart"
              : adding
              ? "Adding..."
              : "Add to Cart"}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
