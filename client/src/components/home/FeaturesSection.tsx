"use client";

import { motion } from "motion/react";
import { IconSparkles, IconShield, IconHeart } from "@tabler/icons-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: IconSparkles,
      title: "Gaming-Inspired Fun",
      description:
        "Every bowl feels like unlocking a new achievement with our gaming-themed cereal pieces.",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: IconShield,
      title: "12 Essential Vitamins",
      description:
        "Boost your day with essential nutrients that keep you powered up for any challenge.",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: IconHeart,
      title: "98% Kid Approved",
      description:
        "Loved by kids and parents alike for its perfect balance of fun and nutrition.",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-white relative">
      {/* Very subtle background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-32 h-32 bg-red-50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-50 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <IconSparkles size={16} />
            Why Choose Playable Crunch?
          </motion.div>

          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4">
            Level Up Your
            <span className="text-red-600 ml-3">Breakfast Game</span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience the perfect fusion of nutrition and fun with cereal
            that&apos;s designed to make every morning feel like a victory.
          </p>
        </motion.div>

        {/* Features Grid - Simplified */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
            >
              {/* Icon */}
              <motion.div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${feature.bgColor} mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon size={36} className={feature.iconColor} />
              </motion.div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-600 leading-relaxed text-lg max-w-sm mx-auto">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
