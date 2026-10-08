import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ListVideo, HelpCircle, MessageSquare } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { RatingStars } from "@/components/ui/RatingStars";
import { useToast } from "@/components/ui/Toast";
import { fetchAdminCourses, fetchAdminCategories, createCourse, updateCourse, deleteCourse } from "@/lib/api";
import type { Course, CourseLevel, Category } from "@/types";
import { formatRupiah } from "@/lib/utils";

const LEVELS: CourseLevel[] = ["Pemula", "Menengah", "Mahir"];

type FormState = {
  id?: string;
  title: string;
  categoryId: string;
  level: CourseLevel;
  price: number;
  isFree: boolean;
  published: boolean;
  description: string;
  thumbnailUrl: string;
};

const emptyForm: FormState = {
  title: "",
  categoryId: "",
  level: "Pemula",
  price: 0,
  isFree: false,
  published: true,
  description: "",
  thumbnailUrl: "",
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const { showToast } = useToast();

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [courseData, categoryData] = await Promise.all([fetchAdminCourses(), fetchAdminCategories()]);
      setCourses(courseData);
      setCategories(categoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data kelas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadData(); }, []);

  function openCreate() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setModalOpen(true);
  }

  function openEdit(course: Course) {
    setForm({
      id: course.id,
      title: course.title,
      categoryId: course.categoryId,
      level: course.level,
      price: course.price,
      isFree: course.isFree,
      published: course.published,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl ?? "",
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { title: form.title.trim(), description: form.description.trim(), thumbnailUrl: form.thumbnailUrl.trim() || undefined, categoryId: form.categoryId, level: form.level, price: form.isFree ? 0 : form.price, isFree: form.isFree, published: form.published };
      if (form.id) await updateCourse(form.id, payload);
      else await createCourse(payload);
      await loadData();
      setModalOpen(false);
      showToast("Berhasil disimpan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan kelas.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCourse(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      showToast("Berhasil dihapus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus kelas.");
    }
  }

  return (
    <AdminShell
      title="Kelola Kelas"
      description={`${courses.length} kelas terdaftar`}
      actions={
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Tambah Kelas
        </Button>
      }
    >
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</div>}
      {loading && <p role="status" className="mb-4 text-sm text-gray-500">Memuat kelas...</p>}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800/60 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              <th className="px-5 py-3">Judul</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Harga</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Enrollment</th>
              <th className="px-5 py-3">Rating</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800/40 last:border-0">
                <td className="max-w-[220px] px-5 py-3">
                  <p className="line-clamp-1 font-medium text-gray-800 dark:text-gray-200">{c.title}</p>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{c.categoryName}</td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{formatRupiah(c.price)}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge tone={c.isFree ? "success" : "primary"}>{c.isFree ? "Gratis" : "Berbayar"}</Badge>
                    <Badge tone={c.published ? "success" : "gray"}>{c.published ? "Published" : "Draft"}</Badge>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{c.enrollmentCount.toLocaleString("id-ID")}</td>
                <td className="px-5 py-3"><RatingStars rating={c.avgRating} showValue={false} size={13} /></td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/admin/kelas/${c.id}/materi`} title="Kelola Materi" className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
                      <ListVideo size={16} />
                    </Link>
                    <Link to={`/admin/kelas/${c.id}/quiz`} title="Kelola Quiz" className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
                      <HelpCircle size={16} />
                    </Link>
                    <Link to={`/admin/kelas/${c.id}/review`} title="Moderasi Review" className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
                      <MessageSquare size={16} />
                    </Link>
                    <button onClick={() => openEdit(c)} title="Edit" className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} title="Hapus" className="rounded-lg p-2 text-danger hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Kelas" : "Tambah Kelas"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Judul Kelas</label>
            <input
              required
              minLength={3}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Deskripsi</label>
            <textarea
              required
              minLength={10}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">URL Thumbnail</label>
            <input
              value={form.thumbnailUrl}
              type="url"
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              placeholder="Hasil upload dari endpoint /admin/upload"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Kategori</label>
              <select
                required
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as CourseLevel })}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2.5">
            <span className="text-sm text-gray-700 dark:text-gray-300">Kelas Gratis</span>
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
              className="h-4 w-4 accent-primary-600"
            />
          </div>

          {!form.isFree && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Harga (Rp)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2.5">
            <span className="text-sm text-gray-700 dark:text-gray-300">Publish Kelas</span>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 accent-primary-600"
            />
          </div>

          <Button type="submit" fullWidth isLoading={saving} className="mt-2">Simpan</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemLabel={`kelas "${deleteTarget?.title ?? ""}"`}
      />
    </AdminShell>
  );
}
