import { useState } from "react";
import { Plus, HelpCircle, Mail } from "lucide-react";
import type { FaqItem } from "@/types";
import { cn } from "@/lib/utils";

// Meniru gaya "Tanya BuildWithAngga": eyebrow + judul dengan emoji, lalu tiap pertanyaan
// jadi kartu tersendiri (bukan daftar bergaris polos) supaya terasa lebih "upgraded".
export function FAQSection({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 dark:bg-surface-dark sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <HelpCircle size={14} />
            Tanya ZELC
          </span>
          <h2 className="font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {items.map((f, i) => {
            const open = openIndex === i;
            return (
              <div
                key={f.question}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white transition-colors dark:bg-surface-darkcard",
                  open ? "border-primary-200 shadow-md dark:border-primary-500/30" : "border-gray-200 dark:border-gray-800"
                )}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center gap-3 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold transition-colors",
                      open
                        ? "bg-primary-600 text-white"
                        : "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-heading text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                    {f.question}
                  </span>
                  <Plus size={18} className={cn("shrink-0 text-gray-400 transition-transform duration-200", open && "rotate-45 text-primary-600 dark:text-primary-300")} />
                </button>
                <div className={cn("grid transition-all duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden px-5 pb-5 pl-16 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {f.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-800 dark:bg-white/[0.02] sm:flex-row sm:text-left">
          <div>
            <p className="font-heading text-sm font-bold text-gray-900 dark:text-white">Masih ada pertanyaan lain?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tim kami siap bantu di jam kerja, Senin–Jumat.</p>
          </div>
          <a
            href="mailto:halo@zelc.id"
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <Mail size={15} /> Hubungi Kami
          </a>
        </div>
      </div>
    </section>
  );
}
