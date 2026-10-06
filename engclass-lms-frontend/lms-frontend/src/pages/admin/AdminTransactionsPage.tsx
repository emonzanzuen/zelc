import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { transactions as allTransactions } from "@/lib/mockData";
import type { TransactionStatus } from "@/types";
import { formatDate, formatRupiah } from "@/lib/utils";

const STATUS_LABEL: Record<TransactionStatus, string> = {
  success: "Sukses",
  pending: "Menunggu",
  failed: "Gagal",
  expired: "Kedaluwarsa",
};
const STATUS_TONE: Record<TransactionStatus, "success" | "warning" | "danger" | "gray"> = {
  success: "success",
  pending: "warning",
  failed: "danger",
  expired: "gray",
};

export default function AdminTransactionsPage() {
  const [status, setStatus] = useState("");

  const filtered = useMemo(() => allTransactions.filter((t) => !status || t.status === status), [status]);
  const totalSuccess = allTransactions.filter((t) => t.status === "success").reduce((s, t) => s + t.amount, 0);

  return (
    <AdminShell title="Transaksi" description={`Total revenue dari transaksi sukses: ${formatRupiah(totalSuccess)}`}>
      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="success">Sukses</option>
          <option value="pending">Menunggu</option>
          <option value="failed">Gagal</option>
          <option value="expired">Kedaluwarsa</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Receipt} message="Tidak ada transaksi dengan status ini." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800/60 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                <th className="px-5 py-3">No. Transaksi</th>
                <th className="px-5 py-3">Kelas</th>
                <th className="px-5 py-3">Jumlah</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 dark:border-gray-800/40 last:border-0">
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{t.transactionNumber}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{t.courseTitle}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{formatRupiah(t.amount)}</td>
                  <td className="px-5 py-3"><Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge></td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
