import { Link } from "react-router-dom";
import { Clock, BookOpen, Users, ArrowUpRight } from "lucide-react";
import type { Course } from "@/types";
import { Badge, levelTone } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { formatRupiah } from "@/lib/utils";

export function CourseCard({ course, dataReveal = true }: { course: Course; dataReveal?: boolean }) {
  // Defensive checks untuk mencegah crash saat data belum lengkap
  const enrollmentCount = course.enrollmentCount ?? 0;
  const lessons = course.lessons ?? [];
  const totalMinutes = lessons.reduce((s, l) => s + (l.durationMinutes ?? 0), 0);
  const price = course.price ?? 0;

  return (
    <Link
      to={`/kelas/${course.slug}`}
      data-reveal={dataReveal ? "" : undefined}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary-200 hover:shadow-xl dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30"
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={course.thumbnailUrl || "/placeholder-course.jpg"}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={
              "rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-sm " +
              (course.isFree ? "bg-success" : "bg-hero-gradient")
            }
          >
            {course.isFree ? "Gratis" : "Premium"}
          </span>
        </div>

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 opacity-0 shadow transition-all duration-300 group-hover:opacity-100 dark:bg-surface-darkcard/90 dark:text-gray-200">
          <ArrowUpRight size={15} />
        </span>

        {/* PERBAIKAN 1: Gunakan variabel yang sudah di-safe-check */}
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          <Users size={11} /> {enrollmentCount.toLocaleString("id-ID")} siswa
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={levelTone(course.level)}>{course.level}</Badge>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {course.categoryName}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[2.75rem] font-heading text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-300">
          {course.title}
        </h3>

        <RatingStars rating={course.avgRating ?? 0} reviewCount={course.reviewCount ?? 0} size={13} />

        {/* PERBAIKAN 2: Gunakan array lessons yang sudah di-safe-check */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen size={13} /> {lessons.length} lesson
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {totalMinutes} menit
          </span>
        </div>

        {/* PERBAIKAN 3: Gunakan harga yang sudah di-safe-check */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <p className="font-heading text-lg font-extrabold text-gray-900 dark:text-white">{formatRupiah(price)}</p>
          <span className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-500/10 dark:text-primary-300">
            Lihat Detail
          </span>
        </div>
      </div>
    </Link>
  );
}