import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';
import { generateCertificateNumber } from '../../utils/generateCode';
import { retryOnUniqueConflict } from '../../utils/retry';

interface QuestionInput {
  text: string;
  options: string[];
  correctOption: string;
}

// FR-19: quiz hanya bisa diakses jika progress course = 100%
export async function getQuizByCourse(courseId: string, userId: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) throw new HttpError(403, 'Kamu belum terdaftar di kelas ini');
  if (enrollment.progress < 100) {
    throw new HttpError(403, 'Selesaikan semua materi dulu sebelum mengerjakan quiz');
  }

  const quiz = await prisma.quiz.findUnique({
    where: { courseId },
    include: { questions: true },
  });
  if (!quiz) throw new HttpError(404, 'Quiz belum tersedia untuk kelas ini');

  return {
    quizId: quiz.id,
    passingGrade: quiz.passingGrade,
    // correctOption sengaja TIDAK dikirim ke client (PRD §29.7)
    questions: quiz.questions.map((q) => ({ id: q.id, text: q.text, options: q.options })),
  };
}

interface AnswerInput {
  questionId: string;
  selectedOption: string;
}

// FR-20 & FR-21: auto-grading + terbitkan sertifikat otomatis jika lulus (sekali per user per course)
export async function submitQuiz(userId: string, quizId: string, answers: AnswerInput[]) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });
  if (!quiz) throw new HttpError(404, 'Quiz tidak ditemukan');

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: quiz.courseId } },
  });
  if (!enrollment || enrollment.progress < 100) {
    throw new HttpError(403, 'Selesaikan semua materi dulu sebelum mengerjakan quiz');
  }

  let correctCount = 0;
  for (const q of quiz.questions) {
    const answer = answers.find((a) => a.questionId === q.id);
    if (answer && answer.selectedOption === q.correctOption) correctCount++;
  }
  const score = quiz.questions.length === 0 ? 0 : Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingGrade;

  await prisma.quizAttempt.create({ data: { userId, quizId, score, passed } });

  let certificate: { certNumber: string } | null = null;

  // Business rule §17.9: sertifikat hanya terbit sekali per user per course, walau quiz diulang
  if (passed) {
    const existingCert = await prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId: quiz.courseId } },
    });

    if (existingCert) {
      certificate = { certNumber: existingCert.certNumber };
    } else {
      const created = await retryOnUniqueConflict(async () => {
        const certNumber = await generateCertificateNumber();
        return prisma.certificate.create({ data: { certNumber, userId, courseId: quiz.courseId } });
      });
      certificate = { certNumber: created.certNumber };
    }
  }

  return { score, passed, certificate };
}

export async function createQuiz(data: {
  courseId: string;
  title: string;
  passingGrade: number;
  questions: QuestionInput[];
}) {
  const existing = await prisma.quiz.findUnique({ where: { courseId: data.courseId } });
  if (existing) throw new HttpError(409, 'Kelas ini sudah punya quiz');

  return prisma.quiz.create({
    data: {
      courseId: data.courseId,
      title: data.title,
      passingGrade: data.passingGrade,
      questions: { create: data.questions },
    },
    include: { questions: true },
  });
}

export async function getQuizForAdmin(courseId: string) {
  const quiz = await prisma.quiz.findUnique({ where: { courseId }, include: { questions: true } });
  return quiz;
}

export function createQuestion(data: QuestionInput & { quizId: string }) {
  return prisma.question.create({ data });
}

export async function updateQuestion(id: string, data: Partial<QuestionInput>) {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw new HttpError(404, 'Soal tidak ditemukan');
  return prisma.question.update({ where: { id }, data });
}

export async function deleteQuestion(id: string) {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw new HttpError(404, 'Soal tidak ditemukan');
  await prisma.question.delete({ where: { id } });
}

export async function updateQuiz(id: string, data: Partial<{ title: string; passingGrade: number }>) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new HttpError(404, 'Quiz tidak ditemukan');
  return prisma.quiz.update({ where: { id }, data });
}

export async function deleteQuiz(id: string) {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new HttpError(404, 'Quiz tidak ditemukan');
  await prisma.$transaction([
    prisma.question.deleteMany({ where: { quizId: id } }),
    prisma.quiz.delete({ where: { id } }),
  ]);
}
