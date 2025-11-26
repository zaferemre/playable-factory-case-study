"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";

import Link from "next/link";

interface DockIconButtonProps {
  icon: React.ComponentType<{
    size?: number;
    stroke?: number;
    className?: string;
  }>;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  badge?: number;
}

export function DockIconButton({
  icon: Icon,
  label,
  onClick,
  href,
  className,
  badge,
}: DockIconButtonProps) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative group p-3 rounded-xl cursor-pointer",
        "hover:bg-slate-100 transition-colors",
        className
      )}
    >
      <Icon size={20} stroke={1.6} className="text-slate-700" />
      {badge !== null && badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-[4px] text-[10px] font-bold text-white shadow-md border border-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
      <span
        className={cn(
          "absolute -top-8 left-1/2 -translate-x-1/2",
          "px-2 py-1 rounded text-xs",
          "bg-slate-900 text-white",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity whitespace-nowrap pointer-events-none"
        )}
      >
        {label}
      </span>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
}

interface MobileDockProps {
  cartCount: number;
  firebaseUser: {
    photoURL?: string | null;
    email?: string | null;
    displayName?: string | null;
  } | null;
  loading: boolean;
  logout: () => void;
  openLoginModal: () => void;
  isAdmin: boolean;
}

export default function MobileDock({
  cartCount,
  firebaseUser,
  loading,
  logout,
  openLoginModal,
  isAdmin,
}: MobileDockProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
      <motion.div
        animate={{
          y: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "flex items-center gap-1 p-2 rounded-2xl",
          "backdrop-blur-lg border border-slate-200 shadow-xl",
          "bg-white/90",
          "hover:shadow-2xl transition-shadow duration-300"
        )}
      >
        <DockIconButton
          icon={({ size, stroke, className }) => (
            <svg
              className={className}
              width={size}
              height={size}
              strokeWidth={stroke}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
          )}
          label="Home"
          href="/"
        />
        <DockIconButton
          icon={({ size, stroke, className }) => (
            <svg
              className={className}
              width={size}
              height={size}
              strokeWidth={stroke}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          )}
          label="Cart"
          href="/shop"
          badge={cartCount}
        />
        {isAdmin && (
          <DockIconButton
            icon={({ size, stroke, className }) => (
              <svg
                className={className}
                width={size}
                height={size}
                strokeWidth={stroke}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
              </svg>
            )}
            label="Admin"
            href="/admin"
          />
        )}
        {!loading && (
          <>
            <DockIconButton
              icon={({ size, stroke, className }) => (
                <svg
                  className={className}
                  width={size}
                  height={size}
                  strokeWidth={stroke}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
              label="Profile"
              href="/profile"
            />
            {firebaseUser ? (
              <DockIconButton
                icon={({ size, stroke, className }) => (
                  <svg
                    className={className}
                    width={size}
                    height={size}
                    strokeWidth={stroke}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                )}
                label="Logout"
                onClick={logout}
              />
            ) : (
              <DockIconButton
                icon={({ size, stroke, className }) => (
                  <svg
                    className={className}
                    width={size}
                    height={size}
                    strokeWidth={stroke}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10,17 15,12 10,7" />
                    <line x1="15" x2="3" y1="12" y2="12" />
                  </svg>
                )}
                label="Login"
                onClick={openLoginModal}
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
