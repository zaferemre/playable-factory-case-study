"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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
import { getAvailableProducts } from "@/lib/api/productApi";
import type { Product } from "@/lib/types/types";

import {
  IconSearch,
  IconHome,
  IconShoppingCart,
  IconBuilding,
} from "@tabler/icons-react";

// Import modular components
import MobileSearchModal from "./header/MobileSearchModal";
import MobileDock from "./header/MobileDock";
import DesktopSearch from "./header/DesktopSearch";
import AuthSection from "./header/AuthSection";
import CartButton from "./header/CartButton";
import LoginModal from "../auth/LoginModal";

export default function Header() {
  const {
    firebaseUser,
    backendUserId,
    loading,
    logout,
    isAdmin,
    showLoginModal,
    openLoginModal,
    closeLoginModal,
  } = useAuth();

  const dispatch = useAppDispatch();
  const cartCount = useAppSelector(selectCartCount);
  const loadedFromServer = useAppSelector(selectCartLoadedFromServer);

  const [isScrolled, setIsScrolled] = useState(false);

  // search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // cart bump animation
  const [cartBump, setCartBump] = useState(false);
  const prevCartCountRef = useRef<number>(0);

  // hydrate guest cart
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

  // hydrate user cart
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

  // scroll shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // cart bump when items added
  useEffect(() => {
    const prev = prevCartCountRef.current;
    if (cartCount > prev) {
      setCartBump(true);
      const id = window.setTimeout(() => setCartBump(false), 250);
      return () => window.clearTimeout(id);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const handleCartClick = () => {
    dispatch(openCart());
  };

  // product search logic with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const q = searchQuery.trim();

    let cancelled = false;
    const id = window.setTimeout(() => {
      const run = async () => {
        try {
          const products = await getAvailableProducts({ q });
          if (!cancelled) {
            setSearchResults(products.slice(0, 6)); // show top 6
          }
        } catch {
          if (!cancelled) {
            setSearchResults([]);
          }
        } finally {
          if (!cancelled) {
            setSearchLoading(false);
          }
        }
      };
      void run();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [searchQuery]);

  // Search handlers
  const openSearch = () => setIsSearchActive(true);
  const closeSearch = () => {
    setIsSearchActive(false);
    setSearchQuery("");
    setSearchResults([]);
  };
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const openMobileSearch = () => setIsMobileSearchOpen(true);
  const closeMobileSearch = () => {
    setIsMobileSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200/50 hidden md:block"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="relative mx-auto flex max-w-7xl items-center px-6 lg:px-8"
          animate={{
            paddingTop: isScrolled ? 16 : 24,
            paddingBottom: isScrolled ? 16 : 24,
            boxShadow: isScrolled
              ? "0 10px 25px rgba(15,23,42,0.12)"
              : "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Left logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-bold tracking-tight text-slate-900"
              animate={{
                fontSize: isScrolled ? "1.25rem" : "1.5rem",
              }}
              transition={{ duration: 0.3 }}
            >
              Playable
              <span className="font-normal text-slate-500">Shop</span>
            </motion.span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Center nav */}
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-8">
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <IconHome size={18} stroke={1.6} />
              <Link href="/" className="text-sm font-medium">
                Home
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <IconShoppingCart size={18} stroke={1.6} />
              <Link href="/shop" className="text-sm font-medium">
                Shop
              </Link>
            </motion.div>
            {isAdmin && (
              <motion.div
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <IconBuilding size={18} stroke={1.6} />
                <Link href="/admin" className="text-sm font-medium">
                  Admin
                </Link>
              </motion.div>
            )}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right section: search + cart + auth */}
          <div className="flex items-center gap-4">
            <DesktopSearch
              searchQuery={searchQuery}
              searchResults={searchResults}
              searchLoading={searchLoading}
              isSearchActive={isSearchActive}
              onSearchChange={setSearchQuery}
              onSearchOpen={openSearch}
              onSearchClose={closeSearch}
              onClearSearch={clearSearch}
            />

            <CartButton
              cartCount={cartCount}
              cartBump={cartBump}
              onClick={handleCartClick}
              className="h-11 w-11"
            />

            <AuthSection
              loading={loading}
              firebaseUser={firebaseUser}
              logout={logout}
              openLoginModal={openLoginModal}
            />
          </div>
        </motion.div>
      </motion.header>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top Bar with Logo */}
        <motion.div
          className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg border-b border-slate-200/50 px-4 py-3"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Playable
                <span className="font-normal text-slate-500">Shop</span>
              </span>
            </Link>

            {/* Mobile search and cart */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={openMobileSearch}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <IconSearch size={16} stroke={1.8} className="text-slate-600" />
              </motion.button>

              <CartButton
                cartCount={cartCount}
                cartBump={cartBump}
                onClick={handleCartClick}
                className="h-9 w-9"
              />
            </div>
          </div>
        </motion.div>

        {/* Mobile Search Modal */}
        <MobileSearchModal
          isOpen={isMobileSearchOpen}
          searchQuery={searchQuery}
          searchResults={searchResults}
          searchLoading={searchLoading}
          onClose={closeMobileSearch}
          onSearchChange={setSearchQuery}
          onClearSearch={clearSearch}
        />

        {/* Bottom Dock */}
        <MobileDock
          cartCount={cartCount}
          firebaseUser={firebaseUser}
          loading={loading}
          logout={logout}
          openLoginModal={openLoginModal}
          isAdmin={isAdmin}
        />
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
}
