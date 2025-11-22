import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Playable Shop",
  description: "Ecommerce case study application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="text-lg font-semibold">Playable Shop</div>
              <nav className="flex gap-4">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
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
              </nav>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6">
            {children}
          </main>

          <footer className="border-t bg-white">
            <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-slate-500">
              Playable Shop case study
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
