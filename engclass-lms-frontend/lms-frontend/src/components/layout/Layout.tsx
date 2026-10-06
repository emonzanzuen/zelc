import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useLenis } from "@/hooks/useLenis";

export function Layout({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  useLenis();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
