import type { Review } from "@/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { EmptyState } from "@/components/ui/EmptyState";
import { MessageSquare } from "lucide-react";
import { formatDate, initials } from "@/lib/utils";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <EmptyState icon={MessageSquare} message="Belum ada ulasan untuk kelas ini. Jadilah yang pertama!" />;
  }

  return (
    <div className="space-y-5">
      {reviews.map((r) => (
        <div key={r.id} className="flex gap-3 border-b border-gray-100 pb-5 last:border-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {initials(r.userName)}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-heading text-sm font-semibold text-gray-900">{r.userName}</p>
              <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
            </div>
            <RatingStars rating={r.rating} showValue={false} size={13} />
            <p className="mt-1.5 text-sm text-gray-600">{r.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
