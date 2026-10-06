import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { EyeOff, Eye, Trash2, ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { ConfirmDialog } from "@/components/ui/Modal";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { courses as allCourses, reviews as allReviews } from "@/lib/mockData";
import type { Review } from "@/types";
import { formatDate, initials } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

export default function AdminCourseReviewsPage() {
  const { courseId } = useParams();
  const course = allCourses.find((c) => c.id === courseId);
  const [reviews, setReviews] = useState<Review[]>(allReviews.filter((r) => r.courseId === courseId));
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const { showToast } = useToast();

  if (!course) {
    return (
      <AdminShell title="Kelas tidak ditemukan">
        <Link to="/admin/kelas" className="text-primary-600 hover:underline">Kembali</Link>
      </AdminShell>
    );
  }

  function toggleHidden(id: string) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isHidden: !r.isHidden } : r)));
    showToast("Berhasil disimpan");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    showToast("Berhasil dihapus");
  }

  return (
    <AdminShell
      title="Moderasi Review"
      description={course.title}
      actions={
        <Link to="/admin/kelas" className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 px-3.5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
          <ArrowLeft size={15} /> Kembali
        </Link>
      }
    >
      {reviews.length === 0 ? (
        <EmptyState icon={MessageSquare} message="Belum ada review untuk kelas ini." />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                  {initials(r.userName)}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{r.userName}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(r.createdAt)}</span>
                    {r.isHidden && <Badge tone="gray">Disembunyikan</Badge>}
                  </div>
                  <RatingStars rating={r.rating} showValue={false} size={13} />
                  <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{r.comment}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1 sm:flex-col">
                <button
                  onClick={() => toggleHidden(r.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  {r.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                  {r.isHidden ? "Tampilkan" : "Sembunyikan"}
                </button>
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-danger hover:bg-red-50"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemLabel="review ini" />
    </AdminShell>
  );
}
