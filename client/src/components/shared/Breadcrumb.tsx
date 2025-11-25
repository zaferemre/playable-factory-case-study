import { motion } from "motion/react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <motion.nav
      className="text-sm text-slate-500 mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-red-600 transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? "text-slate-900 font-semibold"
                  : "text-slate-700"
              }
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </motion.nav>
  );
}
