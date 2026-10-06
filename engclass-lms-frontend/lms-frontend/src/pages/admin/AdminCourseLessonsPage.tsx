import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, GripVertical, ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { courses as allCourses } from "@/lib/mockData";
import type { Lesson } from "@/types";

type FormState = { id?: string; title: string; youtubeUrl: string; durationMinutes: number; isPreview: boolean };
const emptyForm: FormState = { title: "", youtubeUrl: "", durationMinutes: 10, isPreview: false };

export default function AdminCourseLessonsPage() {
  const { courseId } = useParams();
  const course = allCourses.find((c) => c.id === courseId);
  const [lessons, setLessons] = useState<Lesson[]>(course?.lessons || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const { showToast } = useToast();

  if (!course) {
    return (
      <AdminShell title="Kelas tidak ditemukan">
        <Link to="/admin/kelas" className="text-primary-600 hover:underline">Kembali</Link>
      </AdminShell>
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (form.id) {
      setLessons((prev) => prev.map((l) => (l.id === form.id ? { ...l, ...form } : l)));
    } else {
      setLessons((prev) => [
        ...prev,
        { id: `l-${Date.now()}`, courseId: course!.id, order: prev.length + 1, ...form },
      ]);
    }
    setModalOpen(false);
    showToast("Berhasil disimpan");
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setLessons((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    showToast("Berhasil dihapus");
  }

  return (
    <AdminShell
      title="Kelola Materi"
      description={course.title}
      actions={
        <div className="flex gap-2">
          <Link to="/admin/kelas" className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 px-3.5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
            <ArrowLeft size={15} /> Kembali
          </Link>
          <Button
            onClick={() => {
              setForm(emptyForm);
              setModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus size={16} /> Tambah Lesson
          </Button>
        </div>
      }
    >
      <div className="divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard">
        {lessons.length === 0 && <p className="p-6 text-sm text-gray-500 dark:text-gray-400">Belum ada lesson. Tambahkan lesson pertama.</p>}
        {lessons.map((lesson, idx) => (
          <div key={lesson.id} className="flex items-center gap-3 px-5 py-4">
            <GripVertical size={16} className="shrink-0 text-gray-300 dark:text-gray-600" />
            <span className="w-6 shrink-0 text-sm font-semibold text-gray-400 dark:text-gray-500">{idx + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-800 dark:text-gray-200">{lesson.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{lesson.durationMinutes} menit</p>
            </div>
            {lesson.isPreview && <Badge tone="success">Preview Gratis</Badge>}
            <button
              onClick={() => {
                setForm({ id: lesson.id, title: lesson.title, youtubeUrl: lesson.youtubeUrl, durationMinutes: lesson.durationMinutes, isPreview: lesson.isPreview });
                setModalOpen(true);
              }}
              className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <Pencil size={16} />
            </button>
            <button onClick={() => setDeleteTarget(lesson)} className="rounded-lg p-2 text-danger hover:bg-red-50">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Lesson" : "Tambah Lesson"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Judul Lesson</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">URL YouTube (ID video)</label>
            <input
              required
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Durasi (menit)</label>
            <input
              type="number"
              min={1}
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-white/[0.02] px-3 py-2.5">
            <span className="text-sm text-gray-700 dark:text-gray-300">Preview Gratis</span>
            <input
              type="checkbox"
              checked={form.isPreview}
              onChange={(e) => setForm({ ...form, isPreview: e.target.checked })}
              className="h-4 w-4 accent-primary-600"
            />
          </div>
          <Button type="submit" fullWidth className="mt-2">Simpan</Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} itemLabel={`lesson "${deleteTarget?.title ?? ""}"`} />
    </AdminShell>
  );
}
