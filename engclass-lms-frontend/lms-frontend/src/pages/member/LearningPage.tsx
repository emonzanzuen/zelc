import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, Lock, Loader2, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useToast } from "@/components/ui/Toast";
import { fetchCourseById, markLessonComplete, fetchMyEnrollments } from "@/lib/api";
import type { Course } from "@/types";
import { cn, youtubeEmbedUrl } from "@/lib/utils";

export default function LearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    let active = true;
    setLoading(true);
    // Progres awal diambil lewat fetchMyEnrollments() (lib/api.ts), bukan import
    // langsung dari mockData — pola yang sama dengan perbaikan di RoadmapDetailPage,
    // supaya ikut pindah ke data backend sungguhan begitu VITE_USE_MOCK=false.
    Promise.all([fetchCourseById(courseId), fetchMyEnrollments()])
      .then(([c, myEnrollments]) => {
        if (!active) return;
        const lessons = Array.isArray(c?.lessons) ? c.lessons : [];
        const enrollments = Array.isArray(myEnrollments) ? myEnrollments : [];
        setCourse(c ? { ...c, lessons } : null);
        setActiveLessonId(lessons[0]?.id || null);
        if (c) {
          const existing = enrollments.find((e) => e.courseId === c.id);
          const completedCount = existing ? Math.min(lessons.length, Math.max(0, Math.round((existing.progress / 100) * lessons.length))) : 0;
          setCompletedIds(new Set(lessons.slice(0, completedCount).map((lesson) => lesson.id)));
        } else {
          setCompletedIds(new Set());
        }
      })
      .catch((error: unknown) => {
        if (active) showToast(error instanceof Error ? error.message : "Gagal memuat materi.", "error");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [courseId]);

  if (loading) {
    return (
      <Layout hideFooter>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={28} />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout hideFooter>
        <div className="container-page py-20 text-center">
          <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Kelas tidak ditemukan</h1>
        </div>
      </Layout>
    );
  }

  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const activeLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];
  const progress = lessons.length ? Math.round((completedIds.size / lessons.length) * 100) : 0;
  const allComplete = lessons.length > 0 && progress === 100;

  if (!activeLesson) {
    return (
      <Layout hideFooter>
        <div className="container-page py-12">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400">&larr; Kembali ke Kelas Saya</Link>
          <h1 className="mt-3 font-heading text-xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          <p className="mt-4 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500 dark:border-gray-800 dark:bg-surface-darkcard dark:text-gray-400">Belum ada lesson untuk kelas ini.</p>
        </div>
      </Layout>
    );
  }

  async function handleMarkComplete() {
    if (!activeLesson || completedIds.has(activeLesson.id)) return;
    setMarking(true);
    try {
      await markLessonComplete(activeLesson.id);
      setCompletedIds((prev) => new Set(prev).add(activeLesson.id));
      showToast("Lesson ditandai selesai");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Gagal menyimpan progres lesson.", "error");
    } finally {
      setMarking(false);
    }
  }

  return (
    <Layout hideFooter>
      <div className="container-page py-8">
        <div className="mb-6">
          <Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">&larr; Kembali ke Kelas Saya</Link>
          <h1 className="mt-2 font-heading text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{course.title}</h1>
          <div className="mt-3 max-w-md">
            <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{progress}% selesai</span>
              <span>{completedIds.size}/{lessons.length} lesson</span>
            </div>
            <ProgressBar value={progress} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              {youtubeEmbedUrl(activeLesson.youtubeUrl) ? (
                <iframe className="h-full w-full" src={youtubeEmbedUrl(activeLesson.youtubeUrl)} title={activeLesson.title} allowFullScreen />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-300">Video lesson belum tersedia</div>
              )}
            </div>
            <h2 className="mt-4 font-heading text-lg font-semibold text-gray-900 dark:text-white">{activeLesson.title}</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={handleMarkComplete} isLoading={marking} disabled={completedIds.has(activeLesson.id)}>
                {completedIds.has(activeLesson.id) ? "Sudah Ditandai Selesai" : "Tandai Selesai"}
              </Button>
              <Button
                variant="outline"
                disabled={!allComplete}
                onClick={() => navigate(`/dashboard/quiz/${course.id}`)}
                className="gap-2"
              >
                Kerjakan Quiz
                <ArrowRight size={16} />
              </Button>
            </div>
            {!allComplete && (
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Selesaikan semua lesson untuk membuka tombol quiz.</p>
            )}
          </div>

          <aside className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-surface-darkcard lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <p className="px-2 py-1 text-sm font-heading font-semibold text-gray-900 dark:text-white">Daftar Lesson</p>
            <div className="mt-1 flex flex-col gap-1">
              {lessons.map((lesson) => {
                const isDone = completedIds.has(lesson.id);
                const isActive = lesson.id === activeLesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors",
                      isActive ? "bg-primary-50 text-primary-700" : "hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 size={17} className="shrink-0 text-success" />
                    ) : lesson.isPreview ? (
                      <Circle size={17} className="shrink-0 text-gray-300 dark:text-gray-600" />
                    ) : (
                      <Lock size={15} className="shrink-0 text-gray-300 dark:text-gray-600" />
                    )}
                    <span className="flex-1 font-medium">{lesson.title}</span>
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{lesson.durationMinutes}m</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
