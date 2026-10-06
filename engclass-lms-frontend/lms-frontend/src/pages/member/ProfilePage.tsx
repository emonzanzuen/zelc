import { useState, type FormEvent } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { initials } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    showToast("Berhasil disimpan");
  }

  if (!user) return null;

  return (
    <DashboardShell title="Edit Profil">
      <div className="max-w-lg rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
            {initials(user.name)}
          </span>
          <div>
            <p className="font-heading font-semibold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3.5 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02] px-3.5 py-2.5 text-sm text-gray-400 dark:text-gray-500"
            />
          </div>
          <Button type="submit" isLoading={saving}>Simpan Perubahan</Button>
        </form>
      </div>
    </DashboardShell>
  );
}
