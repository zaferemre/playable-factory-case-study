"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  IconTrophy,
  IconDeviceGamepad2,
  IconSparkles,
  IconArrowRight,
  IconHeart,
} from "@tabler/icons-react";

export default function GameZoneSection() {
  const gameFeatures = [
    {
      title: "Morning Boost Quest",
      description:
        "Start each day with an epic breakfast adventure that powers up your energy levels.",
      icon: IconTrophy,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Crunch Combo System",
      description:
        "Mix different flavors to create your own custom breakfast combos, just like in RPGs.",
      icon: IconDeviceGamepad2,
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Collectible Achievements",
      description:
        "Each box features unique artwork and collectible cards inspired by classic gaming.",
      icon: IconSparkles,
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400 opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Pixel-style floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gradient-to-br from-red-400 to-orange-500 opacity-20"
            style={{
              left: `${8 + i * 8}%`,
              top: `${10 + (i % 6) * 15}%`,
              width: i % 3 === 0 ? "8px" : "6px",
              height: i % 3 === 0 ? "8px" : "6px",
            }}
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Header */}
            <div>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-red-500/30"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <IconDeviceGamepad2 size={16} />
                Gaming Experience
              </motion.div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">
                Enter the
                <span className="text-red-400 ml-3">Game Zone</span>
              </h2>

              <p className="text-xl text-slate-300 leading-relaxed">
                Where breakfast meets gaming culture. Every spoonful is designed
                to level up your morning routine with the excitement of your
                favorite games.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {gameFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`p-3 ${feature.bgColor} rounded-xl bg-opacity-10 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-300`}
                  >
                    <feature.icon size={24} className="text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/shop"
                  className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 
                  text-white font-semibold rounded-full hover:from-red-500 hover:to-red-400 
                  transition-all duration-300 shadow-lg hover:shadow-red-500/25 gap-2"
                >
                  <IconTrophy size={20} />
                  Start Playing
                  <IconArrowRight size={16} />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-4 bg-white/10 backdrop-blur-sm
                  text-white font-semibold rounded-full hover:bg-white/20 
                  transition-all duration-300 border border-white/20 hover:border-white/40 gap-2"
                >
                  <IconHeart size={20} />
                  Our Story
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Main game-style container */}
            <div
              className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl 
            border border-slate-600 shadow-2xl backdrop-blur-sm"
            >
              {/* Gaming HUD style header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-mono">
                    PLAYER_READY
                  </span>
                </div>
                <div className="text-slate-400 text-sm font-mono">
                  LEVEL: BREAKFAST
                </div>
              </div>

              {/* Cereal bowl visualization */}
              <motion.div
                className="relative h-64 mb-6 bg-gradient-to-br from-slate-700 to-slate-600 
                rounded-xl border border-slate-500 overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(239, 68, 68, 0.2)",
                    "0 0 40px rgba(249, 115, 22, 0.3)",
                    "0 0 20px rgba(239, 68, 68, 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {/* Simulated cereal pieces */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-gradient-to-br from-red-400 to-orange-500 rounded-full"
                    style={{
                      left: `${20 + (i % 4) * 20}%`,
                      top: `${30 + Math.floor(i / 4) * 20}%`,
                    }}
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 180, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                  />
                ))}

                {/* Center glow effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 
                rounded-xl blur-xl"
                ></div>
              </motion.div>

              {/* Game stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">98%</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    APPROVAL
                  </div>
                </div>
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">12</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    VITAMINS
                  </div>
                </div>
                <div className="p-3 bg-slate-600/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">MAX</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    ENERGY
                  </div>
                </div>
              </div>
            </div>

            {/* Floating achievement badges */}
            {[
              { text: "+100 XP", pos: "top-4 right-4", delay: 0 },
              { text: "COMBO!", pos: "top-16 left-4", delay: 0.5 },
              { text: "LEVEL UP!", pos: "bottom-16 right-8", delay: 1 },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.text}
                className={`absolute ${achievement.pos} px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg`}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0.8],
                  y: [20, 0, 0, -10],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: achievement.delay,
                  repeatDelay: 3,
                }}
              >
                {achievement.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
