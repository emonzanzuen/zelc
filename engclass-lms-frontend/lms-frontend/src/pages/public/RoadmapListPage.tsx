import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Map, BookOpen, ArrowRight, Route } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { fetchRoadmaps } from "@/lib/api";
import type { RoadmapSummary } from "@/types";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function RoadmapListPage() {
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useScrollReveal<HTMLDivElement>([roadmaps]);

  useEffect(() => {
    fetchRoadmaps().then((data) => {
      setRoadmaps(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <div className="border-b border-gray-100 bg-white dark:border-gray-800 dark:bg-surface-dark">
        <div className="container-page py-10 sm:py-14">
          <SectionHeading
            eyebrow="Panduan Belajar Terarah"
            title="Roadmap Belajar"
            subtitle="Tidak tahu harus mulai dari mana? Ikuti jalur yang sudah disusun bertahap dari beberapa kelas sekaligus, menuju satu tujuan belajar yang jelas."
          />
        </div>
      </div>

      <div className="container-page py-10 sm:py-14">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : (
          <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roadmaps.map((rm) => (
              <Link
                key={rm.id}
                to={`/roadmap/${rm.slug}`}
                data-reveal
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={rm.thumbnailUrl} alt={rm.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary-700 shadow-sm dark:bg-surface-darkcard/95 dark:text-primary-300">
                    <Route size={13} /> Roadmap
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-heading text-lg font-extrabold leading-snug text-white">{rm.title}</h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="line-clamp-3 flex-1 text-sm text-gray-500 dark:text-gray-400">{rm.description}</p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <BookOpen size={14} /> {rm.courseCount} Kelas Berurutan
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
                      Lihat Jalur <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {roadmaps.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-surface-darkcard">
                <Map size={26} className="text-primary-500" />
                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Belum ada roadmap yang dipublikasikan.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
