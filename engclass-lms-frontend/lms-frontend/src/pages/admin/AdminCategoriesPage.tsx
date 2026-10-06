import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { categories as initialCategories, courses } from "@/lib/mockData";
import type { Category } from "@/types";

type FormState = { id?: string; name: string; slug: string };
const emptyForm: FormState = { name: "", slug: "" };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const { showToast } = useToast();

  function courseCount(categoryId: string) {
    return courses.filter((c) => c.categoryId === categoryId).length;
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (form.id) {
      setCategories((prev) => prev.map((c) => (c.id === form.id ? { ...c, name: form.name, slug: form.slug } : c)));
    } else {
      setCategories((prev) => [...prev, { id: `cat-${Date.now()}`, name: form.name, slug: form.slug }]);
    }
    setModalOpen(false);
    showToast("Berhasil disimpan");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    showToast("Berhasil dihapus");
  }

  return (
    <AdminShell
      title="Kategori"
      description={`${categories.length} kategori kelas`}
      actions={
        <Button
          className="gap-2"
          onClick={() => {
            setForm(emptyForm);
            setModalOpen(true);
          }}
        >
          <Plus size={16} /> Tambah Kategori
        </Button>
      }
    >
      {categories.length === 0 ? (
        <EmptyState icon={FolderTree} message="Belum ada kategori. Tambahkan kategori pertama." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800/60 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                <th className="px-5 py-3">Nama</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3">Jumlah Kelas</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/40 last:border-0">
                  <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{c.name}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{c.slug}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{courseCount(c.id)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setForm({ id: c.id, name: c.name, slug: c.slug });
                          setModalOpen(true);
                        }}
                        className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                      >
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="rounded-lg p-2 text-danger hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Kategori" : "Tambah Kategori"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Nama Kategori</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value, slug: slugify(e.target.value), id: form.id })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <Button type="submit" fullWidth className="mt-2">Simpan</Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemLabel={`kategori "${deleteTarget?.name ?? ""}"`} />
    </AdminShell>
  );
}
