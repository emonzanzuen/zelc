import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "success" | "warning" | "primary" | "gray" | "danger";

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  primary: "bg-violet-50 text-violet-700 dark:bg-primary-500/10 dark:text-primary-300",
  gray: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export function Badge({ tone = "gray", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

export function levelTone(level: string): BadgeTone {
  if (level === "Pemula") return "success";
  if (level === "Menengah") return "warning";
  return "primary";
}
