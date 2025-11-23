"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <motion.section
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* CRUNCH text moved higher */}
      <span
        className="pointer-events-none absolute left-1/2 top-4 z-0 
        -translate-x-1/2 text-[150px] md:text-[230px] lg:text-[300px]
        font-bold tracking-tight text-red-100 opacity-40"
      >
        CRUNCH
      </span>

      {/* Full screen cereal bowl */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.15, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Image
          src="/cereal-main.png"
          alt="Cereal Bowl"
          fill
          priority
          className="object-contain opacity-95"
        />
      </motion.div>

      {/* Foreground layout */}
      <div className="relative z-20 flex h-full w-full items-center justify-between px-10 md:px-16 lg:px-20">
        {/* Left text section with less width, closer inward */}
        <motion.div
          className="w-[26%] min-w-[240px] flex flex-col gap-5 md:gap-6"
          initial={{ x: -35, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-red-400">
            Sip and crunch the fun
          </p>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 drop-shadow-sm">
            Cereal with the flavor of a bonus level.
          </h1>

          <p className="text-sm md:text-base leading-relaxed text-slate-600">
            Playable Crunch is a chocolate pillow cereal inspired by mini games.
            Pour the milk, hear the crunch and start your day like you just
            unlocked a new stage.
          </p>
        </motion.div>

        {/* Right card pulled closer inward */}
        <motion.div
          className="w-[18%] min-w-[220px] flex flex-col items-center"
          initial={{ x: 35, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50/90 
          backdrop-blur px-7 py-8 shadow-md"
          >
            <Image
              src="/cereal-grain.png"
              alt="Choco Splash"
              width={125}
              height={125}
              className="object-cover"
            />

            <p className="text-base font-semibold text-slate-900">
              Choco Splash
            </p>
            <p className="text-xs text-slate-500 text-center">
              Rich cocoa pillows with a light vanilla swirl.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Centered shop button */}
      <motion.div
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 z-30"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-full bg-red-600 
          px-14 py-5 text-base font-bold text-white shadow-xl shadow-red-300 hover:bg-red-500"
        >
          SHOP NOW
        </Link>
      </motion.div>
    </motion.section>
  );
}
