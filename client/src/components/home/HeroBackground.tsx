import { motion } from "framer-motion";
import { FloatingDecoration } from "@/components/shared/FloatingDecoration";

export function HeroBackground() {
  return (
    <>
      {/* CRUNCH word background */}
      <span className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 text-[64px] xs:text-[80px] sm:text-[110px] md:text-[180px] lg:text-[230px] xl:text-[300px] font-bold tracking-tight text-red-100 opacity-30 select-none">
        CRUNCH
      </span>

      {/* Floating cereal pieces decoration */}
      <FloatingDecoration
        count={6}
        className="z-5"
        color="bg-gradient-to-br from-orange-300 to-red-400"
      />

      {/* Scroll indicator - mobile only */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="w-1 h-8 bg-gradient-to-b from-transparent via-slate-300 to-transparent rounded-full"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </>
  );
}
