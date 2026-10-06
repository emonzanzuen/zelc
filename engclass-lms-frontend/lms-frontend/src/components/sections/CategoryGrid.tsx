import { Link } from "react-router-dom";
import { BookOpenCheck, Mic, PenTool, GraduationCap, Briefcase, ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import { SectionHeading } from "./SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Meniru gaya "Find Your Course by Category" di buildwithangga.com: beberapa kartu
// besar (ikon di kotak warna + judul + subjudul singkat + panah), bukan grid ikon kecil
// seperti sebelumnya. 10 kategori penuh (§27.4 PRD) tetap bisa diakses lewat filter
// di halaman Katalog — di sini dikelompokkan jadi 5 jalur belajar utama supaya tidak
// berat dibaca di landing page.
const TRACKS = [
  {
    icon: BookOpenCheck,
    title: "Grammar & Vocabulary",
    subtitle: "Fondasi tata bahasa dan kosakata dari dasar sampai lanjutan",
    categoryId: "cat-1",
    accent: "bg-violet-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300",
  },
  {
    icon: Mic,
    title: "Speaking & Listening",
    subtitle: "Percaya diri bicara dan memahami native speaker",
    categoryId: "cat-3",
    accent: "bg-blue-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-500",
  },
  {
    icon: PenTool,
    title: "Writing",
    subtitle: "Menulis esai akademik & email profesional yang rapi",
    categoryId: "cat-5",
    accent: "bg-amber-50 text-warning dark:bg-amber-500/10 dark:text-amber-400",
  },
  {
    icon: GraduationCap,
    title: "Persiapan TOEFL/IELTS",
    subtitle: "Strategi lengkap & simulasi soal ala ujian asli",
    categoryId: "cat-6",
    accent: "bg-green-50 text-success dark:bg-green-500/10 dark:text-green-400",
  },
  {
    icon: Briefcase,
    title: "Business English",
    subtitle: "Siap presentasi, email, dan rapat di lingkungan kerja",
    categoryId: "cat-8",
    accent: "bg-rose-50 text-danger dark:bg-rose-500/10 dark:text-rose-400",
  },
];

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const ref = useScrollReveal<HTMLDivElement>([categories]);
  return (
    <section className="bg-white py-16 dark:bg-surface-dark sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Start Learning Today"
          title="Pilih Kategori Belajarmu"
          subtitle="Materi terstruktur per skill, dari dasar sampai siap uji kemampuan."
        />

        <div ref={ref} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TRACKS.map((track) => (
            <Link
              key={track.title}
              to={`/kelas?category=${track.categoryId}`}
              data-reveal
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30"
            >
              <span className={"flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl transition-transform group-hover:scale-105 " + track.accent}>
                <track.icon size={26} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-bold text-gray-900 dark:text-white">{track.title}</h3>
                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{track.subtitle}</p>
              </div>
              <ArrowRight
                size={20}
                className="shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-primary-600 dark:text-gray-600 dark:group-hover:text-primary-400"
              />
            </Link>
          ))}

          <Link
            to="/kelas"
            data-reveal
            className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center transition-all hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-white/[0.02] dark:hover:border-primary-500/40 dark:hover:bg-primary-500/5"
          >
            <span className="font-heading text-sm font-bold text-gray-700 dark:text-gray-200">
              Lihat {categories.length || 10}+ Kategori Lainnya
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
              Jelajahi Katalog Lengkap <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
