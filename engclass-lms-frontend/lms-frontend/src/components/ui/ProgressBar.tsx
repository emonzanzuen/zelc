import { useEffect, useState } from "react";

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 50);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className={"h-2 w-full rounded-full bg-gray-200 overflow-hidden dark:bg-gray-800 " + (className || "")}>
      <div
        className="h-full rounded-full bg-primary-500 transition-[width] duration-500 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
