import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { useAuth } from "@/lib/auth-store";

export function SiteLayout({ children }: { children: ReactNode }) {
  const user = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {user && <CartDrawer />}
    </div>
  );
}
