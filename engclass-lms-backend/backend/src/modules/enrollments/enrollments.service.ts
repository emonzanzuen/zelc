import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';

// Business rule §17.3: course isFree=true -> enroll langsung tanpa transaksi
export async function enrollFreeCourse(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) throw new HttpError(404, 'Kelas tidak ditemukan');
  if (!course.isFree) throw new HttpError(400, 'Kelas ini berbayar, gunakan alur checkout (/transactions/checkout)');

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) throw new HttpError(409, 'Kamu sudah terdaftar di kelas ini');

  return prisma.enrollment.create({ data: { userId, courseId } });
}

// Bug sebelumnya: course.id & categoryName tidak ter-select — course.id dipakai sebagai
// key React & parameter link (/dashboard/belajar/:courseId), tanpa ini link jadi
// "/dashboard/belajar/undefined". categoryName dipakai di DashboardPage sebagai subjudul.
export async function listMyEnrollments(userId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnailUrl: true,
          category: { select: { name: true } },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return enrollments.map((e) => ({
    courseId: e.courseId,
    progress: e.progress,
    enrolledAt: e.enrolledAt,
    course: {
      id: e.course.id,
      title: e.course.title,
      slug: e.course.slug,
      thumbnailUrl: e.course.thumbnailUrl,
      categoryName: e.course.category.name,
    },
  }));
}
