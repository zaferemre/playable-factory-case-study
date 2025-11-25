"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Package,
  BarChart3,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  User as UserIcon,
  Sun,
  Moon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: BarChart3,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
];

const accountItems: NavItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface AdminSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const { backendUser } = useAuth();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 md:relative md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-sm font-bold text-white">
                PF
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Playable Factory
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Admin Panel
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 space-y-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4">
              <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Account
              </div>
              <div className="space-y-1">
                {accountItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User info */}
          {backendUser && (
            <div className="border-t border-gray-200 p-4 dark:border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-semibold text-white">
                  {getInitials(backendUser.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {backendUser.name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {backendUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { backendUser, loading: authLoading } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  if (authLoading) {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
            Checking admin access...
          </span>
        </div>
      </section>
    );
  }

  if (!backendUser || backendUser.role !== "admin") {
    return (
      <section className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950">
        <div className="mx-auto max-w-md rounded-lg bg-white p-6 text-center shadow-sm dark:bg-gray-900">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <UserIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Access Denied
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You must be logged in as an admin to view this page.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`font-nunito ${
        isDark ? "dark" : ""
      } min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
    >
      <div className="flex min-h-screen">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col md:pl-0">
          {/* Top bar */}

          {/* Main content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </section>
  );
}
