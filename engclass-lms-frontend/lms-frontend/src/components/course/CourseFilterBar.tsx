import { Search, X, SlidersHorizontal, Wallet, BarChart3, ArrowDownUp } from "lucide-react";
import type { Category, CourseSortOption } from "@/types";

const LEVELS = ["Pemula", "Menengah", "Mahir"];
const SORTS: { value: CourseSortOption; label: string }[] = [
  { value: "", label: "Urutkan: Relevan" },
  { value: "terbaru", label: "Terbaru" },
  { value: "populer", label: "Paling Populer" },
  { value: "harga-rendah", label: "Harga Terendah" },
  { value: "harga-tinggi", label: "Harga Tertinggi" },
];

export interface FilterState {
  category: string;
  level: string;
  price: string; // "", "free", "paid"
  search: string;
  sort: CourseSortOption;
}

function SelectField({
  icon: Icon,
  value,
  onChange,
  children,
}: {
  icon: React.ElementType;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-gray-700 transition-colors hover:border-primary-200 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-200 dark:hover:border-primary-500/40"
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none">
        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function CourseFilterBar({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: FilterState;
  onChange: (next: FilterState) => void;
}) {
  const categoryName = categories.find((c) => c.id === filters.category)?.name;
  const activeChips: { key: keyof FilterState; label: string }[] = [
    ...(filters.search ? [{ key: "search" as const, label: `"${filters.search}"` }] : []),
    ...(filters.category ? [{ key: "category" as const, label: categoryName || "Kategori" }] : []),
    ...(filters.level ? [{ key: "level" as const, label: filters.level }] : []),
    ...(filters.price ? [{ key: "price" as const, label: filters.price === "free" ? "Gratis" : "Berbayar" }] : []),
  ];

  function clearOne(key: keyof FilterState) {
    onChange({ ...filters, [key]: "" });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Cari nama kelas, mis. 'grammar' atau 'toefl'"
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-200"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <SelectField icon={SlidersHorizontal} value={filters.category} onChange={(v) => onChange({ ...filters, category: v })}>
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </SelectField>

          <SelectField icon={BarChart3} value={filters.level} onChange={(v) => onChange({ ...filters, level: v })}>
            <option value="">Semua Level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </SelectField>

          <SelectField icon={Wallet} value={filters.price} onChange={(v) => onChange({ ...filters, price: v })}>
            <option value="">Gratis & Berbayar</option>
            <option value="free">Gratis</option>
            <option value="paid">Berbayar</option>
          </SelectField>

          <SelectField icon={ArrowDownUp} value={filters.sort} onChange={(v) => onChange({ ...filters, sort: v as CourseSortOption })}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </SelectField>
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3.5 dark:border-gray-800">
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Filter aktif:</span>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => clearOne(chip.key)}
              className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button
            onClick={() => onChange({ category: "", level: "", price: "", search: "", sort: filters.sort })}
            className="ml-auto flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-danger dark:text-gray-500"
          >
            <X size={13} /> Hapus Semua
          </button>
        </div>
      )}
    </div>
  );
}
