import { motion } from "framer-motion";
import { IconSparkles } from "@tabler/icons-react";
import { StatCard } from "@/components/shared/StatCard";

interface HeroContentProps {
  isMobile?: boolean;
  className?: string;
}

export function HeroContent({
  isMobile = false,
  className = "",
}: HeroContentProps) {
  const stats = [
    { value: "98%", label: "Kid Approved", color: "red" as const },
    { value: "12", label: "Vitamins", color: "orange" as const },
    { value: "0g", label: "Trans Fat", color: "purple" as const },
  ];

  const containerClasses = isMobile
    ? "text-center space-y-4"
    : "flex w-full lg:w-[35%] xl:w-[30%] flex-col gap-4 sm:gap-5 md:gap-6 text-center lg:text-left mt-6 lg:mt-0";

  const titleClasses = isMobile
    ? "text-2xl sm:text-3xl font-bold text-slate-900 drop-shadow-sm leading-tight"
    : "text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-slate-900 drop-shadow-sm leading-tight";

  const descriptionClasses = isMobile
    ? "text-sm leading-relaxed text-slate-600 max-w-sm mx-auto"
    : "text-sm sm:text-base leading-relaxed text-slate-600 max-w-lg lg:max-w-none mx-auto lg:mx-0";

  const statsContainerClasses = isMobile
    ? "flex justify-center gap-4 mt-4"
    : "flex flex-wrap justify-center lg:justify-start gap-6 mt-4";

  return (
    <motion.div
      className={`${containerClasses} ${className}`}
      initial={{ x: isMobile ? 0 : -35, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: isMobile ? 0.3 : 0.2 }}
    >
      <motion.p
        className="text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-red-500"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isMobile ? 0.1 : 0.3 }}
      >
        <IconSparkles className="inline w-4 h-4 mr-2" />
        Sip and crunch the fun
      </motion.p>

      <motion.h1
        className={titleClasses}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isMobile ? 0.2 : 0.4 }}
      >
        Cereal with the flavor of a{" "}
        <span className="text-red-600">bonus level</span>.
      </motion.h1>

      <motion.p
        className={descriptionClasses}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isMobile ? 0.3 : 0.5 }}
      >
        Playable Crunch is a chocolate pillow cereal inspired by mini games.
        Pour the milk, hear the crunch and start your day like you just unlocked
        a new stage.
      </motion.p>

      <motion.div
        className={statsContainerClasses}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isMobile ? 0.4 : 0.6 }}
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            size={isMobile ? "md" : "lg"}
            delay={isMobile ? 0.5 + index * 0.1 : 0.7 + index * 0.1}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
