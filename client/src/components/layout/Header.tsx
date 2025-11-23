"use client";

import { useEffect } from "react";
import Image from "next/image";
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
  getCartForCurrentUser,
  getOrCreateCartSessionId,
} from "@/lib/api/cartApi";

import {
  IconSearch,
  IconShoppingCart,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";

export default function Header() {
  const { firebaseUser, backendUserId, loading, loginWithGoogle, logout } =
    useAuth();

  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const loadedFromServer = useAppSelector(selectCartLoadedFromServer);

  useEffect(() => {
    if (!backendUserId && !loadedFromServer) {
      const hydrateGuest = async () => {
        try {
          const sessionId = getOrCreateCartSessionId();
          const cart = await getCartForCurrentUser({ sessionId });
          dispatch(setCartFromServer(cart));
        } catch {
          dispatch(setCartFromServer(null));
        }
      };
      hydrateGuest();
    }
  }, [backendUserId, loadedFromServer, dispatch]);

  useEffect(() => {
    if (!backendUserId) return;

    const hydrateUser = async () => {
      try {
        const cart = await getCartForCurrentUser({ userId: backendUserId });
        dispatch(setCartFromServer(cart));
      } catch {
        dispatch(setCartFromServer(null));
      }
    };

    hydrateUser();
  }, [backendUserId, dispatch]);

  const handleCartClick = () => {
    dispatch(openCart());
  };

  const avatarLetter =
    firebaseUser?.email?.charAt(0)?.toUpperCase() ??
    firebaseUser?.displayName?.charAt(0)?.toUpperCase() ??
    "P";

  return (
    <header className=" bg-white">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-3 lg:px-8 lg:py-4">
        {/* Left logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            Playable
            <span className="font-normal text-slate-500">Shop</span>
          </span>
        </Link>

        {/* Center nav */}
        <nav className="flex flex-1 items-center justify-center gap-8 text-sm font-medium text-slate-700 leading-none">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link href="/shop" className="hover:text-slate-900">
            Shop
          </Link>
          <Link href="/admin" className="hover:text-slate-900">
            Admin
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
            type="button"
          >
            <IconSearch size={18} stroke={1.8} className="text-slate-700" />
          </button>

          {/* Cart */}
          <button
            onClick={handleCartClick}
            aria-label="Open cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
            type="button"
          >
            <IconShoppingCart
              size={20}
              stroke={1.8}
              className="text-slate-700"
            />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-3 w-3 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Auth section */}
          {loading ? (
            <span className="text-xs text-slate-500">Checking</span>
          ) : firebaseUser ? (
            <div className="flex items-center gap-3">
              {/* Profile icon button */}
              <Link
                href="/profile"
                aria-label="Profile"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <IconUser size={20} stroke={1.6} className="text-slate-700" />
              </Link>

              {/* Logout icon button */}
              <button
                onClick={logout}
                aria-label="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                type="button"
              >
                <IconLogout size={20} stroke={1.6} className="text-slate-700" />
              </button>

              {/* Avatar */}
              <Link
                href="/profile"
                className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-200"
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
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex h-9 items-center rounded-full bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800"
              type="button"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
