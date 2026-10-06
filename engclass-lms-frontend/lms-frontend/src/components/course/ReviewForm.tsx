import { useState } from "react";
import { RatingInput } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";

export function ReviewForm({ onSubmit }: { onSubmit: (rating: number, comment: string) => Promise<void> }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    await onSubmit(rating, comment);
    setSubmitting(false);
    setRating(0);
    setComment("");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-gray-50 p-5">
      <p className="font-heading text-sm font-semibold text-gray-900">Beri Rating & Ulasan</p>
      <div className="mt-3">
        <RatingInput value={rating} onChange={setRating} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ceritakan pengalaman belajarmu di kelas ini..."
        rows={3}
        className="mt-3 w-full rounded-lg border border-gray-200 p-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
      />
      <Button type="submit" size="sm" isLoading={submitting} disabled={rating === 0} className="mt-3">
        Kirim Ulasan
      </Button>
    </form>
  );
}
