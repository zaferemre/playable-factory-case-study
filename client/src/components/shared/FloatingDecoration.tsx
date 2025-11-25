import { motion } from "framer-motion";

interface FloatingDecorationProps {
  count?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-3 h-3 sm:w-4 sm:h-4",
  lg: "w-4 h-4 sm:w-6 sm:h-6",
};

export function FloatingDecoration({
  count = 6,
  className = "",
  size = "md",
  color = "bg-gradient-to-br from-orange-300 to-red-400",
}: FloatingDecorationProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full opacity-20 ${sizeClasses[size]} ${color}`}
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}
