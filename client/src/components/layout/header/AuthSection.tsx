"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { IconUser, IconLogout } from "@tabler/icons-react";

interface AuthSectionProps {
  loading: boolean;
  firebaseUser: {
    photoURL?: string | null;
    email?: string | null;
    displayName?: string | null;
  } | null;
  logout: () => void;
  openLoginModal: () => void;
}

export default function AuthSection({
  loading,
  firebaseUser,
  logout,
  openLoginModal,
}: AuthSectionProps) {
  const avatarLetter =
    firebaseUser?.email?.charAt(0)?.toUpperCase() ??
    firebaseUser?.displayName?.charAt(0)?.toUpperCase() ??
    "P";

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-20 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (firebaseUser) {
    return (
      <div className="flex items-center gap-2">
        {/* Profile icon button */}
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/profile"
            aria-label="Profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50/50 backdrop-blur-sm hover:bg-slate-100/50 transition-colors"
          >
            <IconUser size={20} stroke={1.6} className="text-slate-700" />
          </Link>
        </motion.div>

        {/* Logout icon button */}
        <motion.button
          onClick={logout}
          aria-label="Logout"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50/50 backdrop-blur-sm hover:bg-slate-100/50 transition-colors"
          type="button"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconLogout size={20} stroke={1.6} className="text-slate-700" />
        </motion.button>

        {/* Avatar */}
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/profile"
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-200 shadow-sm"
          >
            {firebaseUser.photoURL ? (
              <Image
                src={firebaseUser.photoURL}
                alt="Profile"
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-slate-700">
                {avatarLetter}
              </span>
            )}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.button
      onClick={openLoginModal}
      className="flex h-10 items-center rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 shadow-sm transition-colors"
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      Login
    </motion.button>
  );
}
