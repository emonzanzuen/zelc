import { useEffect, useState } from "react";
import { Wallet, Receipt, Users, BookOpenCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { fetchAdminStats, fetchMyTransactions } from "@/lib/api";
import type { Transaction } from "@/types";
import { formatRupiah, formatDate } from "@/lib/utils";

interface Stats {
  totalRevenue: number;
  totalTransactions: number;
  totalMembers: number;
  totalPublishedCourses: number;
  topCourses: { title: string; enrollmentCount: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadFailed(false);
    setTxLoading(true);
    setTxError(null);

    Promise.all([fetchAdminStats(), fetchMyTransactions()])
      .then(([statsData, txData]) => {
        if (cancelled) return;
        setStats(toSafeStats(statsData));
        setTransactions(Array.isArray(txData) ? txData : []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Gagal memuat data dashboard admin:", err);
        setLoadFailed(true);
        setTxError(err instanceof Error ? err.message : "Gagal memuat transaksi");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setTxLoading(false);
        }
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
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">Tidak bisa mengambil data dari backend.</p>
          <button onClick={() => window.location.reload()} className="mt-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            Coba Lagi
          </button>
        </div>
      </AdminShell>
    );
  }

  const maxRevenue = Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1);
  const cards = [
    { label: "Total Revenue", value: formatRupiah(stats.totalRevenue), icon: Wallet, tone: "text-primary-600 bg-primary-50 dark:bg-primary-500/10" },
    { label: "Total Transaksi Sukses", value: stats.totalTransactions.toLocaleString("id-ID"), icon: Receipt, tone: "text-accent-600 bg-blue-50 dark:bg-accent-500/10" },
    { label: "Total Member Terdaftar", value: stats.totalMembers.toLocaleString("id-ID"), icon: Users, tone: "text-success bg-green-50 dark:bg-green-500/10" },
    { label: "Course Published", value: stats.totalPublishedCourses, icon: BookOpenCheck, tone: "text-warning bg-amber-50 dark:bg-amber-500/10" },
  ];

  return (
    <AdminShell title="Dashboard" description="Ringkasan performa penjualan & aktivitas platform.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
          <span className={"flex h-10 w-10 items-center justify-center rounded-lg " + c.tone}><c.icon size={19} /></span>
          <p className="mt-3 font-heading text-xl font-extrabold text-gray-900 dark:text-white">{c.value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
        </div>
      ))}</div>
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
        <p className="mb-4 font-heading text-sm font-semibold text-gray-900 dark:text-white">5 Transaksi Terbaru</p>
        {txLoading ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-white/5" />))}</div>
        ) : txError ? (
          <p className="text-sm text-red-500 dark:text-red-400">Gagal memuat transaksi.</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">Belum ada transaksi.</p>
        ) : (
          <div className="space-y-3">{(transactions?.slice(0, 5) ?? []).map((t: Transaction) => (
            <div key={t.id} className="flex items-center justify-between border-b border-gray-50 pb-3 text-sm last:border-0 last:pb-0 dark:border-gray-800/40">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{t.courseTitle ?? "-"}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{t.transactionNumber} • {formatDate(t.createdAt)}</p>
              </div>
              <p className="font-heading font-semibold text-gray-900 dark:text-white">{formatRupiah(t.amount)}</p>
            </div>
          ))}</div>
        )}
      </div>
    </AdminShell>
  );
}