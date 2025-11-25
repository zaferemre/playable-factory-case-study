import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: ReactNode;
  alignment?: "left" | "center" | "right";
  className?: string;
}

const alignmentClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export function SectionHeader({
  title,
  subtitle,
  description,
  badge,
  alignment = "center",
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`mb-12 lg:mb-16 ${alignmentClasses[alignment]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {badge && (
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {badge}
        </motion.div>
      )}

      {subtitle && (
        <motion.p
          className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.h2
        className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
