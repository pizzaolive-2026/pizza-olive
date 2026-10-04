import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Pizza Olive – Authentic Italian Pizza & Pasta",
  description: "Order authentic Italian pizza, pasta, sides and combos from Pizza Olive at 275 Dundas St W, Toronto. Fresh ingredients, fast delivery, easy online ordering.",
  metadataBase: new URL("https://pizza-olive.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pizza Olive – Authentic Italian Pizza & Pasta",
    description: "Order authentic Italian pizza, pasta, sides and combos from Pizza Olive at 275 Dundas St W, Toronto. Fresh ingredients, fast delivery, easy online ordering.",
    url: "https://pizza-olive.vercel.app",
    siteName: "Pizza Olive",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
