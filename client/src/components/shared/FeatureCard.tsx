import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  description: string;
  iconColor?: string;
  bgColor?: string;
  delay?: number;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-purple-600",
  bgColor = "bg-purple-50",
  delay = 0,
  className = "",
}: FeatureCardProps) {
  return (
    <motion.div
      className={`group p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <div
        className={`w-16 h-16 rounded-2xl ${bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`w-8 h-8 ${iconColor}`} size={32} />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>

      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
