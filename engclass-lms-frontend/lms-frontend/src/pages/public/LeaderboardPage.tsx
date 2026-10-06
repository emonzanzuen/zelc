import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Trophy, Clock, BookOpen, Crown, Medal, Flame } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Starfield } from "@/components/layout/Starfield";
import { fetchLeaderboard } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { prefersReducedMotion } from "@/hooks/useLenis";
import { cn, formatMinutes } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

const monthLabel = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" }).format(new Date());

// Konfigurasi visual podium per posisi — tinggi pedestal, warna aksen, ikon.
// Urutan tampil: #2 (kiri) - #1 (tengah, tertinggi) - #3 (kanan), gaya leaderboard game
// / buildwithangga.com/leaderboard.
const PODIUM_CONFIG: Record<number, { order: string; height: string; ring: string; crown?: boolean; medalColor: string; pedestalBg: string }> = {
  1: { order: "sm:order-2", height: "sm:h-44", ring: "ring-amber-400", crown: true, medalColor: "bg-amber-400 text-amber-900", pedestalBg: "from-amber-400 to-amber-500" },
  2: { order: "sm:order-1", height: "sm:h-32", ring: "ring-gray-300", medalColor: "bg-gray-300 text-gray-700", pedestalBg: "from-gray-300 to-gray-400" },
  3: { order: "sm:order-3", height: "sm:h-24", ring: "ring-orange-400", medalColor: "bg-orange-400 text-orange-900", pedestalBg: "from-orange-400 to-orange-500" },
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLeaderboard().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || prefersReducedMotion() || !listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-podium]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "back.out(1.4)" });
      gsap.fromTo("[data-rank-row]", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "power2.out", delay: 0.3 });
    }, listRef);
    return () => ctx.revert();
  }, [loading]);

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <Layout>
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-primary-50/60 to-white dark:border-gray-800 dark:from-primary-500/[0.07] dark:to-surface-dark">
        <Starfield density={0.0001} maxStars={90} className="opacity-60 dark:opacity-80" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] dark:opacity-15"
        />
        <div className="container-page relative py-10 text-center sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <Trophy size={15} />
            Papan Peringkat Siswa Teraktif
          </span>
          <h1 className="mt-4 font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Siapa Paling Rajin Belajar Bulan Ini?
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Peringkat direset setiap awal bulan · Periode {monthLabel}</p>
        </div>
      </div>

      <div ref={listRef} className="container-page py-10 sm:py-14">
        {loading ? (
          <div className="space-y-3">
            <div className="mb-10 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : (
          <>
            {/* PODIUM — 3 besar */}
            <div className="mb-14 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-end">
              {podium.map((entry) => {
                const cfg = PODIUM_CONFIG[entry.rank];
                return (
                  <div key={entry.userId} data-podium className={cn("flex flex-1 flex-col items-center sm:max-w-[220px]", cfg.order)}>
                    {cfg.crown && <Crown size={26} className="mb-1.5 fill-amber-400 text-amber-500" />}
                    <div className="relative">
                      <img
                        src={entry.avatarUrl}
                        alt={entry.name}
                        className={cn("h-20 w-20 rounded-full object-cover ring-4", cfg.ring, "ring-offset-4 ring-offset-white dark:ring-offset-surface-dark")}
                      />
                      <span className={cn("absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-extrabold shadow-md", cfg.medalColor)}>
                        {entry.rank}
                      </span>
                    </div>
                    <p className="mt-3 font-heading text-base font-bold text-gray-900 dark:text-white">{entry.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Flame size={12} className="text-orange-500" /> {formatMinutes(entry.totalMinutesLearned)}
                    </p>

                    {/* Pedestal */}
                    <div
                      className={cn(
                        "mt-4 flex w-full flex-col items-center justify-start rounded-t-2xl bg-gradient-to-b pt-3 shadow-inner",
                        cfg.pedestalBg,
                        cfg.height,
                        "h-20"
                      )}
                    >
                      <span className="font-heading text-3xl font-black text-white/90 drop-shadow-sm">{entry.rank}</span>
                      <span className="mt-0.5 text-[11px] font-semibold text-white/80">{entry.totalLessonsCompleted} lesson</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TABEL — gaya leaderboard game */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-surface-darkcard">
              <div className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 bg-gray-900 px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-gray-300 dark:bg-black/30 sm:grid-cols-[3rem_1fr_8rem_8rem]">
                <span>#</span>
                <span>Nama</span>
                <span className="hidden text-right sm:block">Lesson</span>
                <span className="text-right">Menit Belajar</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {rest.map((entry, idx) => {
                  const isMe = user && entry.userId === user.id;
                  return (
                    <div
                      key={entry.userId}
                      data-rank-row
                      className={cn(
                        "grid grid-cols-[3rem_1fr_auto] items-center gap-3 border-l-4 px-4 py-3.5 text-sm transition-colors sm:grid-cols-[3rem_1fr_8rem_8rem]",
                        isMe
                          ? "border-l-primary-600 bg-primary-50 dark:bg-primary-500/10"
                          : idx % 2 === 0
                          ? "border-l-transparent bg-white dark:bg-surface-darkcard"
                          : "border-l-transparent bg-gray-50/70 dark:bg-white/[0.02]",
                        "hover:border-l-primary-300 hover:bg-primary-50/60 dark:hover:bg-primary-500/5"
                      )}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 font-heading text-xs font-bold text-gray-500 dark:bg-white/5 dark:text-gray-400">
                        {entry.rank}
                      </span>
                      <span className="flex min-w-0 items-center gap-2.5 font-medium text-gray-800 dark:text-gray-200">
                        <img src={entry.avatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                        <span className="truncate">{entry.name}</span>
                        {isMe && <span className="shrink-0 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold text-white">Kamu</span>}
                      </span>
                      <span className="hidden items-center justify-end gap-1 text-gray-500 dark:text-gray-400 sm:flex">
                        <BookOpen size={13} /> {entry.totalLessonsCompleted}
                      </span>
                      <span className="flex items-center justify-end gap-1 font-semibold text-gray-700 dark:text-gray-300">
                        <Clock size={13} className="text-primary-500" /> {formatMinutes(entry.totalMinutesLearned)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
