"use client";

import { motion } from "motion/react";
import type { User } from "@/lib/types/types";
import type { User as FirebaseUser } from "firebase/auth";
import {
  IconUser,
  IconMail,
  IconCalendarEvent,
  IconShieldCheck,
  IconEdit,
} from "@tabler/icons-react";

interface ProfileAccountCardProps {
  firebaseUser: FirebaseUser;
  userProfile: User | null;
}

export default function ProfileAccountCard({
  firebaseUser,
  userProfile,
}: ProfileAccountCardProps) {
  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isEmailVerified = firebaseUser.emailVerified;

  return (
    <motion.div
      className="rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 p-6 border-b border-slate-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900">
              <IconUser size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Account Details
              </h2>
              <p className="text-sm text-slate-600">
                Manage your personal information
              </p>
            </div>
          </div>
          <motion.button
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white/50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconEdit size={16} />
            Edit
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mt-1">
                <IconUser size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 mb-1">
                  Full Name
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {firebaseUser.displayName ||
                    userProfile?.name ||
                    "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mt-1">
                <IconMail size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-500">
                    Email Address
                  </p>
                  {isEmailVerified && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700">
                      <IconShieldCheck size={12} />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <p className="text-base font-semibold text-slate-900 break-all">
                  {firebaseUser.email}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {memberSince && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 mt-1">
                  <IconCalendarEvent size={16} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Member Since
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {memberSince}
                  </p>
                </div>
              </div>
            )}

            {userProfile?.role && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-100 mt-1">
                  <IconShieldCheck size={16} className="text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500 mb-1">
                    Account Type
                  </p>
                  <p className="text-base font-semibold text-slate-900 capitalize">
                    {userProfile.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
