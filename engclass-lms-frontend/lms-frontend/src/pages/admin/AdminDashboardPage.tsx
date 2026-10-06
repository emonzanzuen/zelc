import { useEffect, useState } from "react";
import { Wallet, Receipt, Users, BookOpenCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { fetchAdminStats } from "@/lib/api";
import { formatRupiah, formatDate } from "@/lib/utils";
import { transactions as mockTransactions } from "@/lib/mockData";

interface Stats {
  totalRevenue: number;
  totalTransactions: number;
  totalMembers: number;
  totalPublishedCourses: number;
  topCourses: { title: string; enrollmentCount: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

// Nilai default untuk SETIAP field — dipakai saat field itu hilang dari response,
// bukan hanya saat seluruh objek `stats` null. Ini yang sebelumnya kurang: menimpa
// `stats` dengan default HANYA saat `stats` sendiri null/undefined (`stats ?? {...}`)
// tidak melindungi kalau `stats` sudah berupa objek tapi salah satu field-nya hilang
// (mis. backend baru mengembalikan `{ totalRevenue }` tanpa `monthlyRevenue`) — pada
// kasus itu `stats` tetap truthy sehingga fallback top-level tidak pernah terpakai,
// dan `.map()` di bawah tetap meledak karena field itu `undefined`.
function toSafeStats(data: unknown): Stats {
  const d = (data ?? {}) as Partial<Stats>;
  return {
    totalRevenue: d.totalRevenue ?? 0,
    totalTransactions: d.totalTransactions ?? 0,
    totalMembers: d.totalMembers ?? 0,
    totalPublishedCourses: d.totalPublishedCourses ?? 0,
    topCourses: Array.isArray(d.topCourses) ? d.topCourses : [],
    monthlyRevenue: Array.isArray(d.monthlyRevenue) ? d.monthlyRevenue : [],
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    fetchAdminStats()
      .then((data) => {
        if (cancelled) return;
        setStats(toSafeStats(data));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Gagal memuat statistik admin:", err);
        setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <AdminShell title="Dashboard">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      </AdminShell>
    );
  }

  if (loadFailed || !stats) {
    return (
      <AdminShell title="Dashboard">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-danger/30 bg-red-50 p-8 text-center dark:bg-red-500/10">
          <AlertTriangle size={24} className="text-danger" />
          <p className="font-heading text-base font-bold text-gray-900 dark:text-white">Gagal memuat statistik</p>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            Tidak bisa mengambil data dari <code>/admin/stats</code>. Pastikan backend berjalan dan endpoint ini
            mengembalikan format sesuai §29.12 PRD, atau set <code>VITE_USE_MOCK=true</code> di <code>.env</code> untuk
            memakai data dummy sementara backend belum siap.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Coba Lagi
          </button>
        </div>
      </AdminShell>
    );
  }

  // Dari sini `stats` sudah pasti lengkap (hasil toSafeStats) — aman dipakai langsung
  // tanpa `?? []`/`?? 0` bertebaran di JSX, karena normalisasinya sudah selesai di satu tempat.
  const maxRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1);

  const cards = [
    { label: "Total Revenue", value: formatRupiah(stats.totalRevenue), icon: Wallet, tone: "text-primary-600 bg-primary-50 dark:bg-primary-500/10" },
    { label: "Total Transaksi Sukses", value: stats.totalTransactions.toLocaleString("id-ID"), icon: Receipt, tone: "text-accent-600 bg-blue-50 dark:bg-accent-500/10" },
    { label: "Total Member Terdaftar", value: stats.totalMembers.toLocaleString("id-ID"), icon: Users, tone: "text-success bg-green-50 dark:bg-green-500/10" },
    { label: "Course Published", value: stats.totalPublishedCourses, icon: BookOpenCheck, tone: "text-warning bg-amber-50 dark:bg-amber-500/10" },
  ];

  return (
    <AdminShell title="Dashboard" description="Ringkasan performa penjualan & aktivitas platform.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
            <span className={"flex h-10 w-10 items-center justify-center rounded-lg " + c.tone}>
              <c.icon size={19} />
            </span>
            <p className="mt-3 font-heading text-xl font-extrabold text-gray-900 dark:text-white">{c.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-600" />
            <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">Revenue per Bulan</p>
          </div>
          {stats.monthlyRevenue.length === 0 ? (
            <p className="flex h-[180px] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
              Belum ada data revenue bulanan.
            </p>
          ) : (
            <div className="flex items-end gap-3" style={{ height: 180 }}>
              {stats.monthlyRevenue.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-primary-500 transition-all"
                    style={{ height: `${Math.max(6, (m.revenue / maxRevenue) * 140)}px` }}
                    title={formatRupiah(m.revenue)}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
          <p className="mb-4 font-heading text-sm font-semibold text-gray-900 dark:text-white">Course Terlaris</p>
          {stats.topCourses.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada data course terlaris.</p>
          ) : (
            <div className="space-y-3">
              {stats.topCourses.map((c, i) => (
                <div key={c.title} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
                    {i + 1}
                  </span>
                  <p className="line-clamp-1 flex-1 text-sm text-gray-700 dark:text-gray-300">{c.title}</p>
                  <span className="shrink-0 text-xs font-semibold text-gray-500 dark:text-gray-400">{c.enrollmentCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
        <p className="mb-4 font-heading text-sm font-semibold text-gray-900 dark:text-white">5 Transaksi Terbaru</p>
        <div className="space-y-3">
          {mockTransactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center justify-between border-b border-gray-50 pb-3 text-sm last:border-0 last:pb-0 dark:border-gray-800/40">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{t.courseTitle}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t.transactionNumber} · {formatDate(t.createdAt)}</p>
              </div>
              <p className="font-heading font-semibold text-gray-900 dark:text-white">{formatRupiah(t.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
