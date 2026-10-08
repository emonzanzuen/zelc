import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { fetchMyTransactions } from "@/lib/api";
import type { Transaction, TransactionStatus } from "@/types";
import { formatDate, formatRupiah } from "@/lib/utils";

const STATUS_LABEL: Record<TransactionStatus, string> = {
  success: "Sukses",
  pending: "Menunggu Pembayaran",
  failed: "Gagal",
  expired: "Kedaluwarsa",
};

const STATUS_TONE: Record<TransactionStatus, "success" | "warning" | "danger" | "gray"> = {
  success: "success",
  pending: "warning",
  failed: "danger",
  expired: "gray",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTransactions()
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTransactions([]);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardShell title="Riwayat Transaksi">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState icon={Receipt} message="Belum ada transaksi. Riwayat pembelian kelasmu akan muncul di sini." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard">
          <div className="hidden grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-gray-100 dark:border-gray-800/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 sm:grid">
            <span>No. Transaksi</span>
            <span>Kelas</span>
            <span>Status</span>
            <span className="text-right">Jumlah</span>
          </div>
          {transactions.map((t) => (
            <div key={t.id} className="grid grid-cols-1 gap-2 border-b border-gray-50 dark:border-gray-800/40 px-5 py-4 text-sm last:border-0 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center sm:gap-4">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{t.transactionNumber}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(t.createdAt)}</p>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t.courseTitle}</p>
              <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
              <p className="font-heading font-semibold text-gray-900 dark:text-white sm:text-right">{formatRupiah(t.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
