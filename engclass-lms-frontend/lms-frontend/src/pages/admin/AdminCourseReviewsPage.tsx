import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EyeOff, Eye, Trash2, ArrowLeft, MessageSquare } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { ConfirmDialog } from "@/components/ui/Modal";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { deleteAdminReview, fetchAdminCourseReviews, fetchAdminCourses, setAdminReviewVisibility } from "@/lib/api";
import type { Course, Review } from "@/types";
import { formatDate, initials } from "@/lib/utils";

export default function AdminCourseReviewsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyReviewId, setBusyReviewId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = useCallback(async () => {
    if (!courseId) {
      setError("ID kelas tidak ditemukan.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [courses, courseReviews] = await Promise.all([
        fetchAdminCourses(),
        fetchAdminCourseReviews(courseId),
      ]);
      setCourse(courses.find((item) => item.id === courseId) ?? null);
      setReviews(courseReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat review kelas.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function toggleHidden(review: Review) {
    setBusyReviewId(review.id);
    try {
      await setAdminReviewVisibility(review.id, !review.isHidden);
      setReviews((current) => current.map((item) => item.id === review.id ? { ...item, isHidden: !item.isHidden } : item));
      showToast(review.isHidden ? "Review ditampilkan" : "Review disembunyikan");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal mengubah status review.", "error");
    } finally {
      setBusyReviewId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusyReviewId(deleteTarget.id);
    try {
      await deleteAdminReview(deleteTarget.id);
      setReviews((current) => current.filter((item) => item.id !== deleteTarget.id));
      showToast("Review berhasil dihapus");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal menghapus review.", "error");
    } finally {
      setBusyReviewId(null);
      setDeleteTarget(null);
    }
  }

  if (!loading && !error && !course) {
    return (
      <AdminShell title="Kelas tidak ditemukan">
        <Link to="/admin/kelas" className="text-primary-600 hover:underline">Kembali</Link>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Moderasi Review"
      description={course?.title ?? "Review kelas"}
      actions={
        <Link to="/admin/kelas" className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 px-3.5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
          <ArrowLeft size={15} /> Kembali
        </Link>
      }
    >
      {loading && <p role="status" className="mb-3 text-sm text-gray-500">Memuat review kelas...</p>}
      {error && (
        <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-danger dark:border-red-900/50 dark:bg-red-950/20">
          <p>{error}</p>
          <button type="button" onClick={() => void loadData()} className="mt-2 font-semibold underline">Coba lagi</button>
        </div>
      )}
      {!loading && !error && reviews.length === 0 && (
        <EmptyState icon={MessageSquare} message="Belum ada review untuk kelas ini." />
      )}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                  {initials(review.userName)}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{review.userName}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(review.createdAt)}</span>
                    {review.isHidden && <Badge tone="gray">Disembunyikan</Badge>}
                  </div>
                  <RatingStars rating={review.rating} showValue={false} size={13} />
                  <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-gray-600 dark:text-gray-400">{review.comment || "Member tidak menambahkan komentar."}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1 sm:flex-col">
                <button
                  type="button"
                  disabled={busyReviewId === review.id}
                  onClick={() => void toggleHidden(review)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-400 dark:hover:bg-white/5"
                >
                  {review.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                  {review.isHidden ? "Tampilkan" : "Sembunyikan"}
                </button>
                <button
                  type="button"
                  disabled={busyReviewId === review.id}
                  onClick={() => setDeleteTarget(review)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-danger hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => void handleDelete()} itemLabel="review ini" />
    </AdminShell>
  );
}
