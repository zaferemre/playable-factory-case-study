// app/layout.tsx
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "../components/layout/Header";
import CartDrawer from "../components/layout/CartDrawer";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Playable Crunch",
  description: "Playable cereal shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="/env.js" defer></script>
      </head>
      <body className="font-fredoka bg-white text-slate-900 antialiased">
        <AuthProvider>
          <ReduxProvider>
            <Header />
            <CartDrawer />
            {children}
            <Footer />
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
