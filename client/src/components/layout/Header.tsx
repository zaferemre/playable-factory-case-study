"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  openCart,
  selectCartCount,
  selectCartLoadedFromServer,
  setCartFromServer,
} from "@/lib/store/cartSlice";
import {
  getCartBySessionId,
  getOrCreateCartSessionId,
} from "@/lib/api/cartApi";

export default function Header() {
  const { user, loading, loginWithGoogle, logout } = useAuth();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const loadedFromServer = useAppSelector(selectCartLoadedFromServer);

  // hydrate cart from backend on first load using session based cart
  useEffect(() => {
    if (loadedFromServer) return;

    const hydrate = async () => {
      try {
        const sessionId = getOrCreateCartSessionId();
        const cart = await getCartBySessionId(sessionId);
        dispatch(setCartFromServer(cart));
      } catch (err: any) {
        // 404 or error just means empty cart
        console.warn("No server cart found, using empty cart");
        dispatch(setCartFromServer(null));
      }
    };

    hydrate();
  }, [loadedFromServer, dispatch]);

  const handleCartClick = () => {
    dispatch(openCart());
  };

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

          {/* Cart button with badge */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative flex items-center gap-1 text-sm hover:underline"
          >
            <span>Cart</span>
            <span role="img" aria-label="cart">
              🛒
            </span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-[4px] text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

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
