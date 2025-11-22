import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import ClientProviders from "@/components/layout/ClientProviders";

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
        <ClientProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6">
              {children}
            </main>
            <footer className="border-t bg-white">
              <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-slate-500">
                Playable Shop case study
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
