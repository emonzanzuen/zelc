import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';

interface LessonInput {
  courseId: string;
  title: string;
  youtubeUrl: string;
  durationMinutes: number;
  order: number;
  isPreview: boolean;
}

export function createLesson(data: LessonInput) {
  return prisma.lesson.create({ data });
}

export async function updateLesson(id: string, data: Partial<Omit<LessonInput, 'courseId'>>) {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new HttpError(404, 'Materi tidak ditemukan');
  return prisma.lesson.update({ where: { id }, data });
}

export async function deleteLesson(id: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new HttpError(404, 'Materi tidak ditemukan');
  await prisma.lesson.delete({ where: { id } });
}

// FR-17: tandai lesson selesai (tercatat di LessonProgress) + hitung ulang Enrollment.progress
export async function completeLesson(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) throw new HttpError(404, 'Materi tidak ditemukan');

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
  });
  if (!enrollment) throw new HttpError(403, 'Kamu belum terdaftar di kelas ini');

  // idempotent: aman dipanggil berkali-kali untuk lesson yang sama
  await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: {},
    create: { userId, lessonId },
  });

  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
  const completedLessons = await prisma.lessonProgress.count({
    where: { userId, lesson: { courseId: lesson.courseId } },
  });

  const progress = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  await prisma.enrollment.update({ where: { id: enrollment.id }, data: { progress } });

  return { lessonId, courseProgress: progress };
}
