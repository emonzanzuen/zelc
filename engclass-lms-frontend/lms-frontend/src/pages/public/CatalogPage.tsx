import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SearchX, BookOpen } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Starfield } from "@/components/layout/Starfield";
import { CourseGrid } from "@/components/course/CourseGrid";
import { CourseFilterBar, type FilterState } from "@/components/course/CourseFilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { fetchCourses, fetchCategories } from "@/lib/api";
import type { Course, Category } from "@/types";

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const filters: FilterState = {
    category: params.get("category") || "",
    level: params.get("level") || "",
    price: params.get("price") || "",
    search: params.get("search") || "",
    sort: (params.get("sort") as FilterState["sort"]) || "",
  };
  const page = Number(params.get("page") || 1);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchCourses({
      category: filters.category || undefined,
      level: filters.level || undefined,
      isFree: filters.price === "free" ? true : filters.price === "paid" ? false : undefined,
      search: filters.search || undefined,
      sort: filters.sort || undefined,
      page,
      limit: 12,
    }).then((res) => {
      setCourses(res.courses);
      setPagination(res.pagination);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.level, filters.price, filters.search, filters.sort, page]);

  function updateFilters(next: FilterState) {
    const p = new URLSearchParams();
    if (next.category) p.set("category", next.category);
    if (next.level) p.set("level", next.level);
    if (next.price) p.set("price", next.price);
    if (next.search) p.set("search", next.search);
    if (next.sort) p.set("sort", next.sort);
    setParams(p);
  }

  function goToPage(n: number) {
    const p = new URLSearchParams(params);
    p.set("page", String(n));
    setParams(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Layout>
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-white dark:border-gray-800 dark:from-primary-500/[0.07] dark:to-surface-dark">
        <Starfield density={0.0001} maxStars={90} className="opacity-60 dark:opacity-80" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] dark:opacity-15"
        />
        <div className="container-page relative py-10 text-center sm:py-14">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <BookOpen size={13} /> Katalog Kelas
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">Kelas Bahasa Inggris</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {pagination.total} kelas tersedia — dari Grammar dasar sampai persiapan TOEFL/IELTS.
          </p>
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        <CourseFilterBar categories={categories} filters={filters} onChange={updateFilters} />

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState icon={SearchX} message="Tidak ada kelas yang cocok dengan filter kamu. Coba ubah kategori atau kata kunci pencarian." />
          ) : (
            <CourseGrid courses={courses} />
          )}
        </div>

        {!loading && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={
                  "h-9 w-9 rounded-lg text-sm font-semibold " +
                  (page === i + 1
                    ? "bg-primary-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5")
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => goToPage(page + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
