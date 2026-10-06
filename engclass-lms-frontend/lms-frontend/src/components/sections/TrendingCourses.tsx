import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Sparkles, Gift, TrendingUp, LayoutGrid } from "lucide-react";
import type { Course } from "@/types";
import { CourseGrid } from "@/components/course/CourseGrid";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

type FilterKey = "semua" | "gratis" | "populer" | "trending" | "terbaru";

const FILTERS: { key: FilterKey; label: string; icon: React.ElementType }[] = [
  { key: "semua", label: "Semua", icon: LayoutGrid },
  { key: "gratis", label: "Gratis", icon: Gift },
  { key: "populer", label: "Populer", icon: TrendingUp },
  { key: "trending", label: "Trending", icon: Flame },
  { key: "terbaru", label: "Terbaru", icon: Sparkles },
];

function sortCourses(courses: Course[], filter: FilterKey): Course[] {
  const list = [...courses];
  switch (filter) {
    case "gratis":
      return list.filter((c) => c.isFree);
    case "populer":
      return list.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    case "trending":
      return list.sort((a, b) => b.reviewCount * b.avgRating - a.reviewCount * a.avgRating);
    case "terbaru":
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return list;
  }
}

export function TrendingCourses({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<FilterKey>("semua");

  const filtered = useMemo(() => sortCourses(courses, filter).slice(0, 8), [courses, filter]);

  return (
    <section className="bg-gray-50 py-16 dark:bg-white/[0.02] sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Jelajahi Kelas" title="Kelas" subtitle="Materi paling update, pilih berdasarkan yang paling cocok untukmu." />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                filter === f.key
                  ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:bg-surface-darkcard dark:text-gray-300 dark:hover:border-primary-500/40"
              )}
            >
              <f.icon size={14} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Belum ada kelas untuk filter ini.</p>
          ) : (
            <CourseGrid courses={filtered} />
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/kelas"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary-500/40"
          >
            Lihat Semua Kelas <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
