import { motion } from "motion/react";
import {
  IconSparkles,
  IconShare,
  IconHeart,
  IconStarFilled,
  IconStar,
} from "@tabler/icons-react";

interface ProductHeaderProps {
  name: string;
  categoryName: string;
  averageRating: number;
  reviewCount: number;
  price: number;
  currency: string;
  onShowReviews: () => void;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("tr-TR").format(amount);
}

export default function ProductHeader({
  name,
  categoryName,
  averageRating,
  reviewCount,
  price,
  currency,
  onShowReviews,
}: ProductHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            <IconSparkles size={14} />
            <span>{categoryName}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            {name}
          </h1>
        </div>
        <div className="flex gap-2">
          <motion.button
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconShare size={20} className="text-slate-600" />
          </motion.button>
          <motion.button
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconHeart size={20} className="text-slate-600" />
          </motion.button>
        </div>
      </div>

      {/* Rating & Price */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.round(averageRating);
              const StarIcon = filled ? IconStarFilled : IconStar;
              return (
                <StarIcon
                  key={i}
                  size={18}
                  stroke={1.5}
                  className={filled ? "text-yellow-400" : "text-slate-300"}
                />
              );
            })}
          </div>
          <span className="font-semibold text-slate-700">
            {averageRating.toFixed(1)}
          </span>
          <button
            onClick={onShowReviews}
            className="text-sm text-red-600 hover:text-red-700 font-medium underline"
          >
            ({reviewCount} reviews)
          </button>
        </div>
        <div className="text-3xl font-bold text-slate-900">
          {formatAmount(price)} {currency}
        </div>
      </div>
    </div>
  );
}
