import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  message,
  action,
}: {
  icon: LucideIcon;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-surface-darkcard">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/10">
        <Icon size={26} className="text-primary-500" />
      </div>
      <p className="max-w-sm text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
