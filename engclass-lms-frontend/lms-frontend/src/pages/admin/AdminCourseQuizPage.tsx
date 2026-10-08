import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { fetchAdminCourses, fetchAdminQuiz, createAdminQuiz, updateAdminQuiz, deleteAdminQuiz, createAdminQuestion, updateAdminQuestion, deleteAdminQuestion } from "@/lib/api";
import type { Course, Question, Quiz } from "@/types";

type FormState = { id?: string; text: string; options: string[]; correctOption: string };
const emptyForm: FormState = { text: "", options: ["", "", "", ""], correctOption: "" };

export default function AdminCourseQuizPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const { showToast } = useToast();
  const [passingGrade, setPassingGrade] = useState(70);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const questions: Question[] = quiz?.questions ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Question | null>(null);

  async function loadData() {
    if (!courseId) return;
    setLoading(true);
    setError("");
    try {
      const [courses, quizData] = await Promise.all([fetchAdminCourses(), fetchAdminQuiz(courseId)]);
      setCourse(courses.find((item) => item.id === courseId) ?? null);
      setQuiz(quizData);
      setPassingGrade(quizData?.passingGrade ?? 70);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat quiz.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadData(); }, [courseId]);

  if (loading) return <AdminShell title="Kelola Quiz"><p role="status">Memuat quiz...</p></AdminShell>;
  if (!course) {
    return (
      <AdminShell title="Kelas tidak ditemukan">
        <Link to="/admin/kelas" className="text-primary-600 hover:underline">Kembali</Link>
      </AdminShell>
    );
  }

  async function handleSaveQuestion(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const question = { text: form.text, options: form.options, correctOption: form.correctOption };
      if (form.id) await updateAdminQuestion(form.id, question);
      else if (quiz) await createAdminQuestion({ quizId: quiz.id, ...question });
      else await createAdminQuiz({ courseId: course!.id, title: `Quiz Akhir: ${course!.title}`, passingGrade, questions: [question] });
      await loadData();
      setModalOpen(false);
      showToast("Berhasil disimpan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan soal.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuestion() {
    if (!deleteTarget) return;
    try {
      await deleteAdminQuestion(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      showToast("Berhasil dihapus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus soal.");
    }
  }

  async function handleSaveSettings() {
    if (!quiz) return;
    try {
      await updateAdminQuiz(quiz.id, { passingGrade });
      await loadData();
      showToast("Berhasil disimpan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan pengaturan quiz.");
    }
  }

  async function handleDeleteQuiz() {
    if (!quiz) return;
    try {
      await deleteAdminQuiz(quiz.id);
      await loadData();
      showToast("Quiz berhasil dihapus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus quiz.");
    }
  }

  return (
    <AdminShell
      title="Kelola Quiz"
      description={course.title}
      actions={
        <Link to="/admin/kelas" className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-800 px-3.5 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
          <ArrowLeft size={15} /> Kembali
        </Link>
      }
    >
      {error && <p role="alert" className="mb-4 text-sm text-danger">{error}</p>}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Passing Grade</label>
        <input
          type="number"
          min={0}
          max={100}
          value={passingGrade}
          onChange={(e) => setPassingGrade(Number(e.target.value))}
          className="w-24 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
        />
        <span className="text-sm text-gray-400 dark:text-gray-500">dari 100</span>
        <Button size="sm" variant="outline" onClick={handleSaveSettings} disabled={!quiz}>Simpan</Button>
        {quiz && <Button size="sm" variant="outline" onClick={handleDeleteQuiz}>Hapus Quiz</Button>}
        <Button
          size="sm"
          className="ml-auto gap-2"
          onClick={() => {
            setForm(emptyForm);
            setModalOpen(true);
          }}
        >
          <Plus size={15} /> Tambah Soal
        </Button>
      </div>

      <div className="space-y-4">
        {questions.length === 0 && <p className="rounded-lg border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700">Belum ada quiz atau soal. Tambahkan soal pertama untuk membuat quiz.</p>}
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{idx + 1}. {q.text}</p>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => {
                    setForm({ id: q.id, text: q.text, options: q.options, correctOption: q.correctOption || "" });
                    setModalOpen(true);
                  }}
                  className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <Pencil size={15} />
                </button>
                <button onClick={() => setDeleteTarget(q)} className="rounded-lg p-2 text-danger hover:bg-red-50">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {q.options.map((opt) => (
                <div
                  key={opt}
                  className={
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm " +
                    (opt === q.correctOption ? "border-success/40 bg-green-50 text-green-700" : "border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400")
                  }
                >
                  {opt === q.correctOption && <CheckCircle2 size={14} className="shrink-0" />}
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={form.id ? "Edit Soal" : "Tambah Soal"}>
        <form onSubmit={handleSaveQuestion} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">Pertanyaan</label>
            <textarea
              required
              rows={2}
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-dark dark:text-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
            />
          </div>
          {form.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correct"
                checked={form.correctOption === opt && opt !== ""}
                onChange={() => setForm({ ...form, correctOption: opt })}
                className="accent-primary-600"
              />
              <input
                required
                value={opt}
                placeholder={`Opsi ${i + 1}`}
                onChange={(e) => {
                  const options = [...form.options];
                  const wasCorrect = form.correctOption === options[i];
                  options[i] = e.target.value;
                  setForm({ ...form, options, correctOption: wasCorrect ? e.target.value : form.correctOption });
                }}
                className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
              />
            </div>
          ))}
          <p className="text-xs text-gray-400 dark:text-gray-500">Pilih radio button di samping opsi untuk menandai jawaban benar.</p>
          <Button type="submit" fullWidth isLoading={saving} disabled={!form.correctOption} className="mt-2">Simpan</Button>
        </form>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteQuestion} itemLabel="soal ini" />
    </AdminShell>
  );
}
