import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, RotateCcw, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { fetchQuizForCourse, submitQuiz, fetchCourseById } from "@/lib/api";
import type { Quiz, Course } from "@/types";
import { cn } from "@/lib/utils";

type Result = { score: number; passed: boolean; certificate: { certNumber: string } | null } | null;

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [submitError, setSubmitError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!courseId) return;
    Promise.allSettled([fetchCourseById(courseId), fetchQuizForCourse(courseId)])
      .then(([courseResult, quizResult]) => {
        if (courseResult.status === "fulfilled") setCourse(courseResult.value);
        if (quizResult.status === "fulfilled") setQuiz(quizResult.value);
        else {
          const response = (quizResult.reason as { response?: { status?: number; data?: { message?: string } } })?.response;
          setLoadError(response?.data?.message || (response?.status === 404
            ? "Quiz belum dibuat untuk kelas ini. Admin perlu menambahkan quiz dan soal terlebih dahulu."
            : quizResult.reason instanceof Error ? quizResult.reason.message : "Gagal memuat quiz."));
        }
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  async function handleSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    setSubmitError("");
    const payload = quiz.questions.map((q) => ({ questionId: q.id, selectedOption: answers[q.id] || "" }));
    try {
      const res = await submitQuiz(quiz.id, payload);
      setResult(res);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Gagal mengirim jawaban quiz.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setResult(null);
  }

  if (loading) {
    return (
      <Layout hideFooter>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={28} />
        </div>
      </Layout>
    );
  }

  if (!course || !quiz) {
    return (
      <Layout hideFooter>
        <div className="container-page py-20 text-center">
          <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Quiz tidak dapat dibuka</h1>
          <p role="alert" className="mx-auto mt-3 max-w-lg text-sm text-gray-500 dark:text-gray-400">
            {loadError || "Pastikan kelas dan quiz tersedia, lalu coba lagi."}
          </p>
          <Link to="/dashboard" className="mt-5 inline-block text-sm text-primary-600 hover:underline">Kembali ke dashboard</Link>
        </div>
      </Layout>
    );
  }

  if (result) {
    return (
      <Layout hideFooter>
        <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-8 text-center shadow-sm">
            <span
              className={cn(
                "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
                result.passed ? "bg-green-50" : "bg-red-50"
              )}
            >
              {result.passed ? <CheckCircle2 size={30} className="text-success" /> : <XCircle size={30} className="text-danger" />}
            </span>
            <h1 className="mt-4 font-heading text-xl font-bold text-gray-900 dark:text-white">
              {result.passed ? `Selamat, kamu lulus dengan skor ${result.score}!` : `Skor kamu ${result.score}, belum mencapai nilai minimum (${quiz.passingGrade}). Yuk coba lagi!`}
            </h1>

            {result.passed && result.certificate ? (
              <>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sertifikat No. {result.certificate.certNumber} telah diterbitkan.</p>
                <Button fullWidth className="mt-6 gap-2" onClick={() => navigate("/dashboard/sertifikat")}>
                  <Award size={16} /> Lihat Sertifikat
                </Button>
              </>
            ) : (
              <Button fullWidth className="mt-6 gap-2" onClick={handleRetry}>
                <RotateCcw size={16} /> Ulangi Quiz
              </Button>
            )}
            <Link to="/dashboard" className="mt-4 block text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600">Kembali ke Kelas Saya</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q.id]);

  return (
    <Layout hideFooter>
      <div className="container-page max-w-2xl py-10">
        <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Quiz: {course.title}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {quiz.questions.length} soal pilihan ganda · Nilai kelulusan minimum {quiz.passingGrade}
        </p>

        <div className="mt-8 space-y-8">
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-5">
              <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">
                {idx + 1}. {q.text}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors",
                      answers[q.id] === opt ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"
                    )}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      className="accent-primary-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {submitError && <p role="alert" className="mt-4 text-sm text-danger">{submitError}</p>}
        <Button fullWidth size="lg" className="mt-8" disabled={!allAnswered} isLoading={submitting} onClick={handleSubmit}>
          Kumpulkan Jawaban
        </Button>
      </div>
    </Layout>
  );
}
