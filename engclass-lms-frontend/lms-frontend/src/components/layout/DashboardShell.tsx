import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Award, Receipt, User } from "lucide-react";
import { Layout } from "./Layout";
import { Starfield } from "./Starfield";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/dashboard", label: "Kelas Saya", icon: LayoutGrid, end: true },
  { to: "/dashboard/sertifikat", label: "Sertifikat", icon: Award, end: false },
  { to: "/dashboard/transaksi", label: "Riwayat Transaksi", icon: Receipt, end: false },
  { to: "/profil", label: "Edit Profil", icon: User, end: false },
];

// Hero band & kartu sidebar sengaja pakai warna latar yang SAMA (primary-50/60 tint,
// lihat HERO_BG) tapi dideklarasikan sebagai dua elemen terpisah — supaya sidebar bisa
// "mengambang" sebagai kartu sendiri (rounded + shadow + outline) di atas halaman putih,
// bukan menyatu jadi satu bidang warna raksasa. Gaya ini meniru dashboard buildwithangga.com.
const HERO_BG = "bg-primary-50/60 dark:bg-primary-500/[0.05]";

export function DashboardShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Layout hideFooter>
      <div className={cn("relative overflow-hidden border-b border-gray-100 dark:border-gray-800", HERO_BG)}>
        <Starfield density={0.00007} maxStars={60} className="opacity-50 dark:opacity-70" />
        <div className="container-page relative py-8">
          <h1 className="font-heading text-2xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
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
