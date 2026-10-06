import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Lock, PlayCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge, levelTone } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";
import { AccordionItem } from "@/components/ui/Accordion";
import { ReviewList } from "@/components/course/ReviewList";
import { ReviewForm } from "@/components/course/ReviewForm";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { fetchCourseBySlug, fetchCourseReviews, submitReview, enrollFreeCourse } from "@/lib/api";
import type { Course, Review } from "@/types";
import { formatRupiah } from "@/lib/utils";

type Tab = "deskripsi" | "silabus" | "review";

export default function CourseDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [course, setCourse] = useState<Course | null>(null);
  const [reviewData, setReviewData] = useState<{ avgRating: number; reviewCount: number; reviews: Review[] }>({
    avgRating: 0,
    reviewCount: 0,
    reviews: [],
  });
  const [tab, setTab] = useState<Tab>("deskripsi");
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchCourseBySlug(slug).then((c) => {
      setCourse(c);
      setLoading(false);
      if (c) fetchCourseReviews(c.id).then(setReviewData);
    });
  }, [slug]);

  async function handlePrimaryAction() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!course) return;
    if (course.isFree) {
      setEnrolling(true);
      await enrollFreeCourse(course.id);
      setEnrolling(false);
      setIsEnrolled(true);
      showToast("Berhasil enroll! Selamat belajar.");
      navigate(`/dashboard/belajar/${course.id}`);
    } else {
      navigate(`/checkout/${course.id}`);
    }
  }

  async function handleReviewSubmit(rating: number, comment: string) {
    if (!course) return;
    const review = await submitReview(course.id, rating, comment);
    setReviewData((prev) => ({
      avgRating: (prev.avgRating * prev.reviewCount + rating) / (prev.reviewCount + 1),
      reviewCount: prev.reviewCount + 1,
      reviews: [review, ...prev.reviews],
    }));
    showToast("Ulasan berhasil dikirim, terima kasih!");
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={32} />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container-page py-20 text-center">
          <h1 className="font-heading text-2xl font-bold text-gray-900 dark:text-white">Kelas tidak ditemukan</h1>
          <Link to="/kelas" className="mt-4 inline-block text-primary-600 hover:underline">Kembali ke katalog</Link>
        </div>
      </Layout>
    );
  }

  const totalMinutes = course.lessons.reduce((s, l) => s + l.durationMinutes, 0);
  const ctaLabel = !course.isFree ? "Beli Sekarang" : isEnrolled ? "Lanjutkan Belajar" : "Mulai Belajar";

  return (
    <Layout>
      <div className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-surface-dark">
        <div className="container-page py-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/kelas" className="hover:text-primary-600">Kelas</Link>
            <span>/</span>
            <span className="text-gray-700">{course.categoryName}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={levelTone(course.level)}>{course.level}</Badge>
            <Badge tone={course.isFree ? "success" : "primary"}>{course.isFree ? "Gratis" : "Premium"}</Badge>
          </div>
          <h1 className="mt-3 max-w-3xl font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">{course.title}</h1>
          <div className="mt-3">
            <RatingStars rating={reviewData.avgRating || course.avgRating} reviewCount={reviewData.reviewCount || course.reviewCount} />
          </div>
        </div>
      </div>

      <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${course.lessons[0]?.youtubeUrl}`}
              title={course.title}
              allowFullScreen
            />
          </div>

          <div className="mt-6 flex gap-6 border-b border-gray-200 dark:border-gray-800">
            {(["deskripsi", "silabus", "review"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "border-b-2 pb-3 text-sm font-heading font-semibold capitalize transition-colors " +
                  (tab === t ? "border-primary-600 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200")
                }
              >
                {t === "review" ? "Rating & Review" : t}
              </button>
            ))}
          </div>

          <div className="py-6">
            {tab === "deskripsi" && <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{course.description}</p>}

            {tab === "silabus" && (
              <div>
                {course.lessons.map((lesson, i) => (
                  <AccordionItem
                    key={lesson.id}
                    defaultOpen={i === 0}
                    title={
                      <span className="flex items-center gap-2">
                        {lesson.isPreview ? (
                          <PlayCircle size={16} className="text-primary-500" />
                        ) : (
                          <Lock size={15} className="text-gray-400" />
                        )}
                        {lesson.title}
                      </span>
                    }
                    rightSlot={<span className="text-xs text-gray-400">{lesson.durationMinutes} menit</span>}
                  >
                    {lesson.isPreview
                      ? "Lesson ini bisa diakses gratis sebagai preview, tanpa perlu enroll."
                      : "Lesson terkunci — enroll atau beli kelas ini untuk membuka aksesnya."}
                  </AccordionItem>
                ))}
              </div>
            )}

            {tab === "review" && (
              <div className="space-y-6">
                {user && <ReviewForm onSubmit={handleReviewSubmit} />}
                <ReviewList reviews={reviewData.reviews} />
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard">
            <p className="font-heading text-3xl font-extrabold text-gray-900 dark:text-white">{formatRupiah(course.price)}</p>
            <Button onClick={handlePrimaryAction} isLoading={enrolling} fullWidth size="lg" className="mt-5">
              {ctaLabel}
            </Button>

            <ul className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                {course.lessons.length} lesson video
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                Total {totalMinutes} menit materi
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                Quiz akhir + sertifikat kelulusan
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0" />
                Akses selamanya
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
