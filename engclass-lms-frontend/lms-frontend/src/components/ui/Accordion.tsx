import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  rightSlot,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  rightSlot?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-gray-900 dark:text-white">{title}</span>
        <span className="flex items-center gap-3 shrink-0">
          {rightSlot}
          <ChevronDown size={18} className={cn("text-gray-500 transition-transform dark:text-gray-400", open && "rotate-180")} />
        </span>
      </button>
      <div className={cn("grid transition-all duration-200 ease-out", open ? "grid-rows-[1fr] opacity-100 pb-4" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden text-sm text-gray-600 leading-relaxed dark:text-gray-400">{children}</div>
      </div>
    </div>
  );
}
