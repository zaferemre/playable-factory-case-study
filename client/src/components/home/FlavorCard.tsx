import { motion } from "framer-motion";
import Image from "next/image";
import { IconHeart } from "@tabler/icons-react";
import { cn } from "@/lib/utils/cn";

interface FlavorCardProps {
  name: string;
  description: string;
  grainImage: string;
  isLiked?: boolean;
  onToggleLike?: () => void;
  className?: string;
}

export function FlavorCard({
  name,
  description,
  grainImage,
  isLiked = false,
  onToggleLike,
  className = "",
}: FlavorCardProps) {
  return (
    <motion.div
      className={`w-full max-w-[220px] ${className}`}
      initial={{ x: 35, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex h-80 w-56 flex-col items-center gap-4 rounded-2xl bg-white/80 px-7 py-8 shadow-lg backdrop-blur-sm border border-white/40">
        <motion.div
          key={`${name}-grain`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="relative h-28 w-28"
        >
          <Image src={grainImage} alt={name} fill className="object-contain" />
        </motion.div>

        <p className="text-base font-semibold text-slate-900 text-center">
          {name}
        </p>

        <p className="text-xs text-center text-slate-500 leading-relaxed">
          {description}
        </p>

        {onToggleLike && (
          <motion.button
            onClick={onToggleLike}
            className="mt-auto p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <IconHeart
              size={18}
              className={cn(
                "transition-colors duration-200",
                isLiked ? "fill-red-500 text-red-500" : "text-slate-400"
              )}
            />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
