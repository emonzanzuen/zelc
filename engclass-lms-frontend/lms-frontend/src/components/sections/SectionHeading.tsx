import type { ReactNode } from "react";

// Dipakai di semua section landing page supaya header-nya konsisten: center-aligned,
// eyebrow kecil berwarna primary, judul besar, lalu subjudul abu-abu.
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={"mx-auto max-w-2xl text-center " + className}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-3 text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
}
