import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Route, X } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { fetchAdminRoadmaps, fetchAdminCourses, createRoadmap, updateRoadmap, deleteRoadmap } from "@/lib/api";
import type { Course } from "@/types";
import type { Roadmap, RoadmapCourseItem } from "@/types";

type FormState = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  published: boolean;
  selectedCourseIds: string[];
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  description: "",
  thumbnailUrl: "",
  published: true,
  selectedCourseIds: [],
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Roadmap | null>(null);
  const { showToast } = useToast();

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [roadmapData, courseData] = await Promise.all([fetchAdminRoadmaps(), fetchAdminCourses()]);
      setRoadmaps(roadmapData);
      setAllCourses(courseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat roadmap.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadData(); }, []);

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(rm: Roadmap) {
    setForm({
      id: rm.id,
      title: rm.title,
      slug: rm.slug,
      description: rm.description,
      thumbnailUrl: rm.thumbnailUrl,
      published: rm.published,
      selectedCourseIds: [...rm.courses].sort((a, b) => a.order - b.order).map((c) => c.course.id),
    });
    setModalOpen(true);
  }

  function toggleCourse(courseId: string) {
    setForm((prev) => {
      const exists = prev.selectedCourseIds.includes(courseId);
      return {
        ...prev,
        selectedCourseIds: exists
          ? prev.selectedCourseIds.filter((id) => id !== courseId)
          : [...prev.selectedCourseIds, courseId],
      };
    });
  }

  function moveCourse(index: number, direction: -1 | 1) {
    setForm((prev) => {
      const ids = [...prev.selectedCourseIds];
      const target = index + direction;
      if (target < 0 || target >= ids.length) return prev;
      [ids[index], ids[target]] = [ids[target], ids[index]];
      return { ...prev, selectedCourseIds: ids };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        slug: slugify(form.slug || form.title),
        description: form.description.trim(),
        thumbnailUrl: form.thumbnailUrl.trim() || null,
        published: form.published,
        courseIds: form.selectedCourseIds,
      };
      if (form.id) await updateRoadmap(form.id, payload);
      else await createRoadmap(payload);
      await loadData();
      setModalOpen(false);
      showToast("Berhasil disimpan");
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const validationErrors = Object.entries(apiError.response?.data?.errors ?? {})
        .flatMap(([field, messages]) => messages.map((message) => `${field}: ${message}`));
      setError(validationErrors.join("; ") || apiError.response?.data?.message || (err instanceof Error ? err.message : "Gagal menyimpan roadmap."));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteRoadmap(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      showToast("Berhasil dihapus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus roadmap.");
    }
  }

  const selectedCourses = form.selectedCourseIds
    .map((id) => allCourses.find((c) => c.id === id))
    .filter((c): c is (typeof allCourses)[number] => !!c);

  return (
    <AdminShell
      title="Kelola Roadmap"
      description={`${roadmaps.length} roadmap belajar`}
      actions={
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Tambah Roadmap
        </Button>
      }
    >
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">{error}</div>}
      {loading && <p role="status" className="mb-4 text-sm text-gray-500">Memuat roadmap...</p>}
      {roadmaps.length === 0 ? (
        <EmptyState icon={Route} message="Belum ada roadmap. Susun roadmap pertama dari kelas-kelas yang sudah ada." />
      ) : (
        <div className="space-y-3">
          {roadmaps.map((rm) => (
            <div key={rm.id} className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard sm:flex-row sm:items-center">
              <img src={rm.thumbnailUrl} alt={rm.title} className="h-20 w-32 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone={rm.published ? "success" : "gray"}>{rm.published ? "Published" : "Draft"}</Badge>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{rm.courses.length} kelas</span>
                </div>
                <h3 className="mt-1 font-heading text-sm font-bold text-gray-900 dark:text-white">{rm.title}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                  {rm.courses.map((c) => c.course.title).join(" → ")}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => openEdit(rm)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
                  <Pencil size={16} />
                </button>
                <button onClick={() => setDeleteTarget(rm)} className="rounded-lg p-2 text-danger hover:bg-red-50 dark:hover:bg-red-500/10">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Roadmap" : "Tambah Roadmap"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Judul Roadmap</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-800 dark:bg-surface-dark dark:text-gray-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Deskripsi</label>
              <textarea
                required
                minLength={10}
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-800 dark:bg-surface-dark dark:text-gray-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">URL Thumbnail</label>
            <input
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              placeholder="Hasil upload dari endpoint /admin/upload"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none dark:border-gray-800 dark:bg-surface-dark dark:text-gray-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Pilih Kelas & Urutkan ({selectedCourses.length} dipilih)
            </label>
            {selectedCourses.length > 0 && (
              <div className="mb-2 space-y-1.5 rounded-lg border border-gray-200 p-2 dark:border-gray-800">
                {selectedCourses.map((c, idx) => (
                  <div key={c.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs dark:bg-white/[0.03]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{c.title}</span>
                    <button type="button" onClick={() => moveCourse(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 dark:hover:text-gray-200">
                      <ArrowUp size={13} />
                    </button>
                    <button type="button" onClick={() => moveCourse(idx, 1)} disabled={idx === selectedCourses.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30 dark:hover:text-gray-200">
                      <ArrowDown size={13} />
                    </button>
                    <button type="button" onClick={() => toggleCourse(c.id)} className="text-gray-400 hover:text-danger">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="max-h-36 overflow-y-auto rounded-lg border border-gray-200 p-2 dark:border-gray-800">
              {allCourses
                .filter((c) => c.published)
                .filter((c) => !form.selectedCourseIds.includes(c.id))
                .map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => toggleCourse(c.id)}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
                  >
                    <span className="truncate">{c.title}</span>
                    <Plus size={13} className="shrink-0" />
                  </button>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 dark:bg-white/[0.02]">
            <span className="text-sm text-gray-700 dark:text-gray-300">Publish Roadmap</span>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="h-4 w-4 accent-primary-600"
            />
          </div>

          <Button type="submit" fullWidth disabled={form.published && selectedCourses.length === 0} className="mt-2">
            Simpan
          </Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemLabel={`roadmap "${deleteTarget?.title ?? ""}"`} />
    </AdminShell>
  );
}
