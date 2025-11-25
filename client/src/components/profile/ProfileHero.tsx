"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { User, UserAddress } from "@/lib/types/types";
import type { User as FirebaseUser } from "firebase/auth";
import {
  IconMapPin,
  IconStarFilled,
  IconShoppingBag,
  IconCurrencyDollar,
  IconStar,
} from "@tabler/icons-react";

interface ProfileHeroProps {
  firebaseUser: FirebaseUser;
  userProfile: User | null;
  avatarLetter: string;
  defaultAddress?: UserAddress;
  ordersCount: number;
  lastOrderDate: Date | null;
  totalSpent: string;
  reviewAverage: number;
  reviewsCount: number;
  error: string;
}

export default function ProfileHero({
  firebaseUser,
  userProfile,
  avatarLetter,
  defaultAddress,
  ordersCount,
  lastOrderDate,
  totalSpent,
  reviewAverage,
  reviewsCount,
  error,
}: ProfileHeroProps) {
  return (
    <motion.section
      className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-transparent to-slate-50/50" />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg sm:h-20 sm:w-20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {firebaseUser.photoURL ? (
                <Image
                  src={firebaseUser.photoURL}
                  alt="Profile"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xl font-bold text-white sm:text-2xl">
                    {avatarLetter}
                  </span>
                </div>
              )}
            </motion.div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                  Playable Profile
                </p>
                {userProfile?.role && (
                  <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                    {userProfile.role}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {firebaseUser.displayName ||
                  userProfile?.name ||
                  "Welcome back!"}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {firebaseUser.email}
              </p>
              {defaultAddress && (
                <div className="flex items-center gap-1 mt-2 text-sm text-slate-600">
                  <IconMapPin size={16} className="text-red-500" />
                  <span>
                    {defaultAddress.city}
                    {defaultAddress.country && `, ${defaultAddress.country}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:gap-4">
            <motion.div
              className="text-center rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/50 p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100">
                <IconShoppingBag size={16} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{ordersCount}</p>
              <p className="text-xs text-slate-600">Orders</p>
              {lastOrderDate && (
                <p className="text-xs text-slate-500 mt-1">
                  Last: {lastOrderDate.toLocaleDateString()}
                </p>
              )}
            </motion.div>

            <motion.div
              className="text-center rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/50 p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-green-100">
                <IconCurrencyDollar size={16} className="text-green-600" />
              </div>
              <p className="text-xl font-bold text-slate-900">{totalSpent}</p>
              <p className="text-xs text-slate-600">Spent</p>
            </motion.div>

            <motion.div
              className="text-center rounded-2xl bg-white/70 backdrop-blur-sm border border-slate-200/50 p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-yellow-100">
                {reviewsCount > 0 ? (
                  <IconStarFilled size={16} className="text-yellow-600" />
                ) : (
                  <IconStar size={16} className="text-yellow-600" />
                )}
              </div>
              {reviewsCount > 0 ? (
                <>
                  <p className="text-xl font-bold text-slate-900">
                    {reviewAverage.toFixed(1)}
                  </p>
                  <p className="text-xs text-slate-600">
                    Reviews ({reviewsCount})
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-slate-900">0</p>
                  <p className="text-xs text-slate-600">Reviews</p>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
