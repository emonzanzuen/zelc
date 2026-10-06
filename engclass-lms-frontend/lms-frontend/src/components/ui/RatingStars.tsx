import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  showValue = true,
  reviewCount,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={cn(i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-700")}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-700 font-medium dark:text-gray-300">
          {rating.toFixed(1)}
          {typeof reviewCount === "number" && <span className="text-gray-500 font-normal dark:text-gray-400"> ({reviewCount})</span>}
        </span>
      )}
    </div>
  );
}

export function RatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} aria-label={`Beri rating ${i}`}>
          <Star size={26} className={cn(i <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-700", "transition-colors")} />
        </button>
      ))}
    </div>
  );
}
