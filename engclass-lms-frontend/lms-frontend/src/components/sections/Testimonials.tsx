import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { SectionHeading } from "./SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ACCENTS = [
  "bg-violet-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300",
  "bg-blue-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-500",
  "bg-amber-50 text-warning dark:bg-amber-500/10 dark:text-amber-400",
  "bg-green-50 text-success dark:bg-green-500/10 dark:text-green-400",
];

export function Testimonials({ items }: { items: Testimonial[] }) {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="bg-gray-50 py-16 dark:bg-white/[0.02] sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Testimoni Pelajar" title="Kata Mereka yang Sudah Belajar" />

        <div ref={ref} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <div
                key={t.id}
                data-reveal
                className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-surface-darkcard"
              >
                <span className={"flex h-12 w-12 items-center justify-center rounded-xl text-lg " + accent}>
                  <Quote size={22} className="fill-current" />
                </span>

                <div className="mt-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">&ldquo;{t.quote}&rdquo;</p>

                <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <img src={t.avatarUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-surface-darkcard" />
                  <div>
                    <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
