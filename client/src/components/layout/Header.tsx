"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold">
          Playable Shop
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          <Link href="/cart" className="hover:underline">
            Cart
          </Link>
          <Link href="/profile" className="hover:underline">
            Profile
          </Link>
          <Link href="/admin" className="hover:underline">
            Admin
          </Link>

          {loading ? (
            <span className="text-xs text-slate-500">Checking login...</span>
          ) : user ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[140px] truncate text-xs text-slate-700">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="rounded border px-2 py-1 text-xs font-semibold hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
