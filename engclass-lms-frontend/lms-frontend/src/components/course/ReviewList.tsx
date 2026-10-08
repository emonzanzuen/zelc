import type { Review } from "@/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";
import { formatDate, initials } from "@/lib/utils";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  if (safeReviews.length === 0) {
    return <EmptyState icon={MessageSquare} message="Belum ada ulasan untuk kelas ini. Jadilah yang pertama!" />;
  }

  return (
    <div className="space-y-5">
      {safeReviews.map((r, index) => (
        <div key={r.id || `${r.userId}-${r.createdAt}-${index}`} className="flex gap-3 border-b border-gray-100 pb-5 last:border-0 dark:border-gray-800">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            {initials(r.userName)}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{r.userName}</p>
              <span className="text-xs text-gray-400 dark:text-gray-500">{formatDate(r.createdAt)}</span>
            </div>
            <RatingStars rating={r.rating} showValue={false} size={13} />
            <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
