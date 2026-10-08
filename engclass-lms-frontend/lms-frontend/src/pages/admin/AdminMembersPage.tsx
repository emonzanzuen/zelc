import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import { fetchAdminMembers, type AdminMember } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchAdminMembers().then((data) => { if (active) setMembers(data); })
      .catch((err: unknown) => { if (active) setError(err instanceof Error ? err.message : "Gagal memuat member."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
      const matchMethod = !method || m.signupMethod === method;
      return matchSearch && matchMethod;
    });
  }, [members, search, method]);

  return (
    <AdminShell title="Member" description={`${members.length} member terdaftar`}>
      {loading && <p role="status" className="mb-3 text-sm text-gray-500">Memuat member...</p>}
      {error && <p role="alert" className="mb-3 text-sm text-danger">{error}</p>}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none"
          />
        </div>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:border-primary-500 focus:outline-none"
        >
          <option value="">Semua Metode Daftar</option>
          <option value="Email">Email</option>
          <option value="Google">Google</option>
        </select>
      </div>

      {!loading && filtered.length === 0 ? (
        <EmptyState icon={Users} message="Tidak ada member yang cocok dengan pencarian." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800/60 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Tanggal Daftar</th>
                <th className="px-5 py-3">Metode</th>
                <th className="px-5 py-3">Kelas Diikuti</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800/40 last:border-0">
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{m.name}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{m.email}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{formatDate(m.registeredAt)}</td>
                  <td className="px-5 py-3"><Badge tone={m.signupMethod === "Google" ? "primary" : "gray"}>{m.signupMethod}</Badge></td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{m.coursesJoined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
