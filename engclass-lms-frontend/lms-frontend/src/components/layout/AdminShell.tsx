import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, FolderTree, Users, Receipt, Route } from "lucide-react";
import { Layout } from "./Layout";
import { Starfield } from "./Starfield";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/kelas", label: "Kelola Kelas", icon: BookOpen, end: false },
  { to: "/admin/roadmap", label: "Kelola Roadmap", icon: Route, end: false },
  { to: "/admin/kategori", label: "Kategori", icon: FolderTree, end: false },
  { to: "/admin/member", label: "Member", icon: Users, end: false },
  { to: "/admin/transaksi", label: "Transaksi", icon: Receipt, end: false },
];

// Lihat catatan di DashboardShell.tsx — hero band & kartu sidebar sengaja dua elemen
// terpisah dengan warna latar yang sama (HERO_BG), supaya sidebar bisa "mengambang"
// sebagai kartunya sendiri di atas halaman putih, gaya dashboard buildwithangga.com.
const HERO_BG = "bg-primary-50/60 dark:bg-primary-500/[0.05]";

export function AdminShell({
  title,
  description,
  children,
  actions,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Layout hideFooter>
      <div className={cn("relative overflow-hidden border-b border-gray-100 dark:border-gray-800", HERO_BG)}>
        <Starfield density={0.00007} maxStars={60} className="opacity-50 dark:opacity-70" />
        <div className="container-page relative flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
            {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
          </div>
          {actions}
        </div>
      </div>

      <div className="container-page grid grid-cols-1 gap-8 py-8 lg:grid-cols-[240px_1fr] lg:py-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            className={cn(
              "flex gap-1.5 overflow-x-auto rounded-2xl border border-primary-100/60 p-3 shadow-sm lg:flex-col lg:overflow-visible dark:border-primary-500/10",
              HERO_BG
            )}
          >
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-white text-primary-600 shadow-sm dark:bg-surface-darkcard dark:text-primary-300"
                      : "text-gray-600 hover:bg-white/70 dark:text-gray-400 dark:hover:bg-white/5"
                  )
                }
              >
                <link.icon size={17} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </Layout>
  );
}
