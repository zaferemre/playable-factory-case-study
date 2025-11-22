import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "../components/layout/Header";
import CartDrawer from "../components/layout/CartDrawer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReduxProvider>
            <Header />
            <CartDrawer />
            {children}
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
