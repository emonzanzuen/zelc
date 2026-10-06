import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Award as AwardIcon, GraduationCap } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { fetchMyEnrollments, type MyEnrollment } from "@/lib/api";
import { cn } from "@/lib/utils";

type FilterKey = "semua" | "berjalan" | "selesai";

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("semua");

  useEffect(() => {
    fetchMyEnrollments().then((data) => {
      setEnrollments(data);
      setLoading(false);
    });
  }, []);

  const filtered = enrollments.filter((e) => {
    if (filter === "berjalan") return e.progress > 0 && e.progress < 100;
    if (filter === "selesai") return e.progress === 100;
    return true;
  });

  return (
    <DashboardShell title="Kelas Saya">
      <div className="mb-6 flex gap-2">
        {([
          ["semua", "Semua"],
          ["berjalan", "Sedang Berjalan"],
          ["selesai", "Selesai"],
        ] as [FilterKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              filter === key ? "bg-primary-600 text-white" : "bg-white dark:bg-surface-darkcard border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          message="Kamu belum mengikuti kelas apapun. Yuk mulai belajar!"
          action={<LinkButton to="/kelas">Lihat Semua Kelas</LinkButton>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map(({ course, progress }) => (
            <div key={course.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-4">
              <div className="flex gap-3">
                <img src={course.thumbnailUrl} alt={course.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-heading text-sm font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{course.categoryName}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{progress}% selesai</span>
                  {progress === 100 && (
                    <span className="flex items-center gap-1 font-medium text-success">
                      <AwardIcon size={12} /> Lulus
                    </span>
                  )}
                </div>
                <ProgressBar value={progress} />
              </div>

              <Link
                to={progress === 100 ? `/dashboard/quiz/${course.id}` : `/dashboard/belajar/${course.id}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary-50 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-100"
              >
                <PlayCircle size={16} />
                {progress === 100 ? "Lihat Quiz / Sertifikat" : progress === 0 ? "Mulai Belajar" : "Lanjutkan Belajar"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
