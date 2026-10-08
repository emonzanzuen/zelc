import { Course, Category } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';
import { generateSlug } from '../../utils/slug';

export type CourseSort = 'terbaru' | 'populer' | 'harga-rendah' | 'harga-tinggi';

interface ListCourseParams {
  category?: string;
  level?: string;
  isFree?: boolean;
  search?: string;
  sort?: CourseSort;
  page: number;
  limit: number;
}

// PRD §11.2 & §29.3: urutkan Terbaru/Populer/Harga Terendah/Harga Tertinggi
function resolveOrderBy(sort?: CourseSort) {
  switch (sort) {
    case 'populer':
      return { enrollments: { _count: 'desc' as const } };
    case 'harga-rendah':
      return { price: 'asc' as const };
    case 'harga-tinggi':
      return { price: 'desc' as const };
    case 'terbaru':
    default:
      return { createdAt: 'desc' as const };
  }
}

type CourseWithCategory = Course & { category: Category; _count: { enrollments: number } };

// `enrollmentCount` adalah PENAMBAHAN field baru (bukan ada di §29.3 PRD semula) —
// ditambahkan atas permintaan frontend untuk badge "X siswa" di course card.
function mapCourseCard(course: CourseWithCategory) {
  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    thumbnailUrl: course.thumbnailUrl,
    price: course.price,
    isFree: course.isFree,
    level: course.level,
    avgRating: course.avgRating,
    reviewCount: course.reviewCount,
    enrollmentCount: course._count.enrollments,
    categoryName: course.category?.name ?? null,
  };
}

export async function listCourses(params: ListCourseParams) {
  const { category, level, isFree, search, sort, page, limit } = params;

  const where: Record<string, unknown> = { published: true };
  if (category) where.category = { slug: category };
  if (level) where.level = level;
  if (typeof isFree === 'boolean') where.isFree = isFree;
  if (search) where.title = { contains: search, mode: 'insensitive' };

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where,
      include: { category: true, _count: { select: { enrollments: true } } },
      orderBy: resolveOrderBy(sort),
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.course.count({ where }),
  ]);

  return {
    courses: courses.map(mapCourseCard),
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

export async function getCourseDetail(slug: string, userId?: string) {
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      lessons: { orderBy: { order: 'asc' } },
      quiz: { select: { id: true } },
    },
  });

  if (!course || !course.published) throw new HttpError(404, 'Kelas tidak ditemukan');

  let isEnrolled = false;
  if (userId) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: course.id } },
    });
    isEnrolled = !!enrollment;
  }

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    price: course.price,
    isFree: course.isFree,
    level: course.level,
    avgRating: course.avgRating,
    reviewCount: course.reviewCount,
    categoryName: course.category.name,
    lessons: course.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      durationMinutes: lesson.durationMinutes,
      isPreview: lesson.isPreview,
      locked: !lesson.isPreview && !isEnrolled,
      youtubeUrl: lesson.isPreview || isEnrolled ? lesson.youtubeUrl : undefined,
    })),
    hasQuiz: !!course.quiz,
    isEnrolled,
  };
}

export async function getCourseDetailById(id: string, userId?: string) {
  const course = await prisma.course.findUnique({ where: { id }, select: { slug: true } });
  if (!course) throw new HttpError(404, 'Kelas tidak ditemukan');
  return getCourseDetail(course.slug, userId);
}

interface CourseInput {
  title: string;
  description: string;
  categoryId: string;
  thumbnailUrl?: string;
  price: number;
  isFree: boolean;
  level?: string;
  published?: boolean;
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.course.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

export async function createCourse(authorId: string, data: CourseInput) {
  const slug = await generateUniqueSlug(data.title);
  return prisma.course.create({ data: { ...data, slug, authorId } });
}

export async function updateCourse(id: string, data: Partial<CourseInput & { published: boolean }>) {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new HttpError(404, 'Kelas tidak ditemukan');
  return prisma.course.update({ where: { id }, data });
}

// Business rule §17.11: tidak boleh dihapus permanen jika sudah ada transaksi sukses
export async function deleteCourse(id: string) {
  const course = await prisma.course.findUnique({
    where: { id },
    include: { transactions: { where: { status: 'success' }, take: 1 } },
  });
  if (!course) throw new HttpError(404, 'Kelas tidak ditemukan');
  if (course.transactions.length > 0) {
    throw new HttpError(
      409,
      'Kelas tidak bisa dihapus karena sudah memiliki transaksi sukses. Unpublish saja (published = false).'
    );
  }
  await prisma.course.delete({ where: { id } });
}

export function listCoursesForAdmin() {
  return prisma.course.findMany({
    include: { category: true, lessons: { orderBy: { order: 'asc' } }, quiz: { select: { id: true } }, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
  }).then((courses) => courses.map((course) => ({
    ...course,
    categoryName: course.category.name,
    enrollmentCount: course._count.enrollments,
    hasQuiz: Boolean(course.quiz),
  })));
}
