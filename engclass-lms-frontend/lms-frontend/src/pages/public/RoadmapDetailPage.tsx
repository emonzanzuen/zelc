import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, Lock, PlayCircle, ArrowRight, Route } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge, levelTone } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAuth } from "@/context/AuthContext";
import { fetchRoadmapBySlug, fetchRoadmapProgress, fetchMyEnrollments, type MyEnrollment } from "@/lib/api";
import type { Roadmap } from "@/types";
import { formatRupiah, cn } from "@/lib/utils";

export default function RoadmapDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [progress, setProgress] = useState(0);
  // Diambil lewat fetchMyEnrollments() (lib/api.ts), BUKAN diimpor langsung dari
  // mockData — supaya progres per-course di timeline ikut pindah ke data backend
  // sungguhan begitu VITE_USE_MOCK=false, bukan selalu dummy (celah yang sempat dilaporkan).
  const [enrollments, setEnrollments] = useState<MyEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    fetchRoadmapBySlug(slug).then(async (rm) => {
      if (!active) return;
      const safeRoadmap = rm ? { ...rm, courses: Array.isArray(rm.courses) ? rm.courses.filter((item) => item?.course?.id) : [] } : null;
      setRoadmap(safeRoadmap);
      if (safeRoadmap && user) {
        const [p, myEnrollments] = await Promise.all([fetchRoadmapProgress(safeRoadmap), fetchMyEnrollments()]);
        if (!active) return;
        setProgress(Number.isFinite(p) ? p : 0);
        setEnrollments(Array.isArray(myEnrollments) ? myEnrollments : []);
      } else {
        setEnrollments([]);
      }
    }).catch(() => {
      if (active) {
        setRoadmap(null);
        setEnrollments([]);
      }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug, user]);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      </Layout>
    );
  }

  if (!roadmap) {
    return (
      <Layout>
        <div className="container-page py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Roadmap tidak ditemukan</h1>
          <Link to="/roadmap" className="mt-4 inline-block text-primary-600 hover:underline dark:text-primary-400">Kembali ke daftar roadmap</Link>
        </div>
      </Layout>
    );
  }

  const roadmapCourses = Array.isArray(roadmap.courses) ? roadmap.courses.filter((item) => item?.course?.id) : [];
  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  return (
    <Layout>
      <div className="relative overflow-hidden border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-surface-dark">
        <div className="container-page py-10 sm:py-14">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
              <Route size={13} /> Roadmap Belajar
            </span>
            <h1 className="font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">{roadmap.title}</h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">{roadmap.description}</p>
          </div>

          {user ? (
            <div className="mx-auto mt-6 max-w-sm">
              <div className="mb-1.5 flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                <span>Progres Gabungan Kamu</span>
                <span>{progress}%</span>
              </div>
              <ProgressBar value={progress} />
            </div>
          ) : (
            <div className="mx-auto mt-6 max-w-sm text-center">
              <Link to="/login" className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
                Masuk untuk melacak progres gabunganmu di roadmap ini →
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {roadmapCourses.map((item, i) => {
            const enrollment = safeEnrollments.find((e) => e.courseId === item.course.id);
            const courseProgress = enrollment ? enrollment.progress : 0;
            const isDone = courseProgress === 100;
            const isLast = i === roadmapCourses.length - 1;

            return (
              <div key={item.course.id} className="relative flex gap-5 pb-10 last:pb-0">
                {!isLast && (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-[23px] top-12 h-[calc(100%-2.5rem)] w-0.5",
                      isDone ? "bg-success" : "bg-gray-200 dark:bg-gray-800"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 font-heading text-sm font-bold",
                    isDone
                      ? "border-green-100 bg-success text-white dark:border-green-500/20"
                      : "border-primary-100 bg-white text-primary-600 dark:border-primary-500/20 dark:bg-surface-darkcard dark:text-primary-300"
                  )}
                >
                  {isDone ? <CheckCircle2 size={20} /> : item.order}
                </span>

                <Link
                  to={`/kelas/${item.course.slug}`}
                  className="group flex flex-1 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-lg dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30 sm:flex-row sm:items-center"
                >
                  <img src={item.course.thumbnailUrl} alt={item.course.title} className="h-24 w-full shrink-0 rounded-lg object-cover sm:w-36" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={levelTone(item.course.level)}>{item.course.level}</Badge>
                      <Badge tone={item.course.isFree ? "success" : "primary"}>{item.course.isFree ? "Gratis" : "Premium"}</Badge>
                    </div>
                    <h3 className="mt-1.5 font-heading text-base font-bold text-gray-900 dark:text-white">{item.course.title}</h3>
                    <p className="mt-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{formatRupiah(item.course.price)}</p>
                    {courseProgress > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar value={courseProgress} className="max-w-[140px]" />
                        <span className="text-xs text-gray-400 dark:text-gray-500">{courseProgress}%</span>
                      </div>
                    )}
                  </div>
                  <span className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-300 sm:flex">
                    {courseProgress > 0 ? <PlayCircle size={14} /> : <Lock size={13} />}
                    {courseProgress > 0 ? "Lanjutkan" : "Mulai"}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            );
          })}
          {roadmapCourses.length === 0 && <p className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 dark:border-gray-800 dark:bg-surface-darkcard dark:text-gray-400">Roadmap ini belum memiliki course yang dapat ditampilkan.</p>}
        </div>
      </div>
    </Layout>
  );
}
