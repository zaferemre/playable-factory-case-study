"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { IconSparkles, IconShoppingCart, IconHeart } from "@tabler/icons-react";

const FLAVORS = {
  choco: {
    key: "choco",
    image: "/cereal-main.png",
    grainImage: "/cereal-grain.png",
    name: "Choco Splash",
    description: "Rich cocoa pillows with a light vanilla swirl.",
    restScale: 1.15,
    popScale: 1.28,
  },
  fruity: {
    key: "fruity",
    image: "/fruit-loops.png",
    grainImage: "/fruit-loops-grain.png",
    name: "Fruity Loops",
    description: "Colorful rings with a bright, tangy crunch.",
    restScale: 0.75,
    popScale: 0.85,
  },
} as const;

type FlavorKey = keyof typeof FLAVORS;

export default function Hero() {
  const [flavor, setFlavor] = useState<FlavorKey>("choco");
  const [isLiked, setIsLiked] = useState(false);
  const currentFlavor = FLAVORS[flavor];

  useEffect(() => {
    const interval = setInterval(() => {
      setFlavor((prev) => (prev === "choco" ? "fruity" : "choco"));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const startScale = 0.05;

  return (
    <motion.section
      className="font-fredoka relative flex min-h-[85vh] lg:min-h-[80vh] w-full items-start lg:items-center justify-center overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-orange-50/40  pb-16 lg:pb-0"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* CRUNCH word */}
      <span className="pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 text-[64px] xs:text-[80px] sm:text-[110px] md:text-[180px] lg:text-[230px] xl:text-[300px] font-bold tracking-tight text-red-100 opacity-30 select-none">
        CRUNCH
      </span>

      {/* Floating cereal pieces decoration */}
      <div className="pointer-events-none absolute inset-0 z-5">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-orange-300 to-red-400 opacity-20"
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

      {/* Desktop Main cereal image */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:flex items-center justify-center">
        <motion.div
          key={currentFlavor.key}
          initial={{ scale: startScale, y: 40 }}
          animate={{
            scale: [
              startScale,
              currentFlavor.popScale,
              currentFlavor.restScale,
            ],
            y: [40, -10, 0],
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
            times: [0, 0.25, 1],
          }}
          className="relative h-full w-full"
        >
          <Image
            src={currentFlavor.image}
            alt={`${currentFlavor.name} cereal bowl`}
            fill
            priority
            className="object-contain opacity-95"
          />
        </motion.div>
      </div>

      {/* Mobile Layout - Image at top */}
      <div className="lg:hidden relative z-20 flex flex-col h-full w-full">
        {/* Mobile cereal image at top */}
        <div className="flex items-center justify-center px-4 pt-8 pb-4">
          <motion.div
            key={currentFlavor.key + "-mobile"}
            initial={{ scale: 0.5, y: 20 }}
            animate={{
              scale: [
                0.5,
                currentFlavor.popScale * 1.0,
                currentFlavor.restScale * 1.0,
              ],
              y: [20, -10, 0],
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.25, 1],
            }}
            className="relative w-full max-w-md h-96"
          >
            <Image
              src={currentFlavor.image}
              alt={`${currentFlavor.name} cereal bowl`}
              fill
              priority
              className="object-contain opacity-95"
            />
          </motion.div>
        </div>

        {/* Mobile content section */}
        <div className="px-4 pb-28 space-y-3">
          {/* Mobile flavor info */}
          <motion.div
            className="text-center"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              key={currentFlavor.key + "-mobile-info"}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/60 mx-auto max-w-xs"
            >
              <p className="text-lg font-bold text-slate-900 mb-1">
                {currentFlavor.name}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentFlavor.description}
              </p>
            </motion.div>
          </motion.div>

          {/* Mobile text content */}
          <motion.div
            className="text-center space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-red-500">
              <IconSparkles className="inline w-4 h-4 mr-2" />
              Sip and crunch the fun
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 drop-shadow-sm leading-tight">
              Cereal with the flavor of a{" "}
              <span className="text-red-600">bonus level</span>.
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 max-w-sm mx-auto">
              Playable Crunch is a chocolate pillow cereal inspired by mini
              games. Pour the milk, hear the crunch and start your day like you
              just unlocked a new stage.
            </p>

            {/* Mobile stats */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">98%</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">
                  Kid Approved
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">12</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">
                  Vitamins
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">0g</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">
                  Trans Fat
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex relative z-20 h-full w-full flex-row items-center justify-between px-20 xl:px-40 -mt-8">
        {/* Left text section */}
        <motion.div
          className="flex w-full lg:w-[35%] xl:w-[30%] flex-col gap-4 sm:gap-5 md:gap-6 text-center lg:text-left mt-6 lg:mt-0"
          initial={{ x: -35, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.p
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-red-500"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <IconSparkles className="inline w-4 h-4 mr-2" />
            Sip and crunch the fun
          </motion.p>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold text-slate-900 drop-shadow-sm leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Cereal with the flavor of a{" "}
            <span className="text-red-600">bonus level</span>.
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-lg lg:max-w-none mx-auto lg:mx-0"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Playable Crunch is a chocolate pillow cereal inspired by mini games.
            Pour the milk, hear the crunch and start your day like you just
            unlocked a new stage.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center lg:justify-start gap-6 mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">98%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Kid Approved
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">12</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Vitamins
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">0g</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Trans Fat
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right flavor card - desktop only */}
        <motion.div
          className="hidden lg:flex w-[25%] xl:w-[20%] min-w-[220px] flex-col items-center"
          initial={{ x: 35, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex h-80 w-56 flex-col items-center gap-4 rounded-2xl bg-white/80 px-7 py-8 shadow-lg backdrop-blur-sm border border-white/40">
            <motion.div
              key={currentFlavor.key + "-grain-desktop"}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              className="relative h-28 w-28"
            >
              <Image
                src={currentFlavor.grainImage}
                alt={currentFlavor.name}
                fill
                className="object-contain"
              />
            </motion.div>

            <p className="text-base font-semibold text-slate-900 text-center">
              {currentFlavor.name}
            </p>
            <p className="text-xs text-center text-slate-500 leading-relaxed">
              {currentFlavor.description}
            </p>

            <motion.button
              onClick={handleLike}
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
          </div>
        </motion.div>
      </div>

      {/* Shop button */}
      <motion.div
        className="absolute bottom-20 sm:bottom-24 lg:bottom-1/4 left-1/2 z-30 -translate-x-1/2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link
          href="/shop"
          className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-500 
          px-8 sm:px-12 lg:px-24 py-4 sm:py-5 text-lg sm:text-2xl lg:text-3xl font-bold text-white 
          shadow-xl shadow-red-300/50 hover:shadow-red-400/60 hover:from-red-500 hover:to-red-400 
          transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <IconShoppingCart className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 group-hover:animate-bounce" />
          SHOP NOW
          <motion.span
            className="ml-2 sm:ml-3"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </motion.div>

      {/* Scroll indicator - visible on all devices */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={() => {
          const nextSection = document.querySelector(
            "main > section:nth-child(2)"
          );
          nextSection?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <span className="text-xs font-medium text-slate-400 mb-2 hidden sm:block">
          Scroll to explore
        </span>
        <motion.div
          className="flex flex-col items-center space-y-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-0.5 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full" />
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
