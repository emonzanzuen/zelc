import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';

// Business rule §17.16: hanya dihitung dari review yang isHidden=false
async function recalculateCourseRating(courseId: string) {
  const agg = await prisma.review.aggregate({
    where: { courseId, isHidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.course.update({
    where: { id: courseId },
    data: { avgRating: agg._avg.rating ?? 0, reviewCount: agg._count.rating },
  });
}

// Business rule §17.15: hanya member dengan Enrollment aktif yang boleh review, 1 per course (bisa diedit)
export async function createReview(userId: string, courseId: string, rating: number, comment?: string) {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment) throw new HttpError(403, 'Kamu harus mengikuti kelas ini sebelum memberi ulasan');

  const existing = await prisma.review.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const review = existing
    ? await prisma.review.update({ where: { id: existing.id }, data: { rating, comment, isHidden: false } })
    : await prisma.review.create({ data: { userId, courseId, rating, comment } });

  await recalculateCourseRating(courseId);
  return review;
}

export async function listReviews(courseId: string, page: number, limit: number) {
  const where = { courseId, isHidden: false };

  const [reviews, total, course] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where }),
    prisma.course.findUnique({ where: { id: courseId }, select: { avgRating: true, reviewCount: true } }),
  ]);

  return {
    avgRating: course?.avgRating ?? 0,
    reviewCount: course?.reviewCount ?? 0,
    reviews: reviews.map((r) => ({
      id: r.id,
      userName: r.user.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
    })),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function hideReview(id: string) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new HttpError(404, 'Review tidak ditemukan');
  await prisma.review.update({ where: { id }, data: { isHidden: true } });
  await recalculateCourseRating(review.courseId);
}

export async function deleteReview(id: string) {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new HttpError(404, 'Review tidak ditemukan');
  await prisma.review.delete({ where: { id } });
  await recalculateCourseRating(review.courseId);
}
