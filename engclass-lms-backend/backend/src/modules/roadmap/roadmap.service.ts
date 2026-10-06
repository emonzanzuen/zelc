import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';
import { generateSlug } from '../../utils/slug';

interface RoadmapInput {
  title: string;
  slug?: string;
  description: string;
  thumbnailUrl?: string;
  published: boolean;
  courseIds: string[];
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.roadmap.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`;
  }
  return slug;
}

// FR-39: daftar roadmap publik
export async function listRoadmaps() {
  const roadmaps = await prisma.roadmap.findMany({
    where: { published: true },
    include: { courses: { include: { course: { select: { published: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return roadmaps.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    thumbnailUrl: r.thumbnailUrl,
    // Risiko §24: course yang sudah di-unpublish tidak dihitung agar jumlah yang tampil ke publik akurat
    courseCount: r.courses.filter((rc) => rc.course.published).length,
  }));
}

// FR-39: detail roadmap publik — course yang sudah di-unpublish disembunyikan (mitigasi risiko §24)
export async function getRoadmapDetail(slug: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug },
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: { course: true },
      },
    },
  });

  if (!roadmap || !roadmap.published) throw new HttpError(404, 'Roadmap tidak ditemukan');

  return {
    id: roadmap.id,
    title: roadmap.title,
    slug: roadmap.slug,
    description: roadmap.description,
    thumbnailUrl: roadmap.thumbnailUrl,
    courses: roadmap.courses
      .filter((rc) => rc.course.published)
      .map((rc) => ({
        order: rc.order,
        course: {
          id: rc.course.id,
          slug: rc.course.slug,
          title: rc.course.title,
          thumbnailUrl: rc.course.thumbnailUrl,
          level: rc.course.level,
          price: rc.course.price,
          isFree: rc.course.isFree,
        },
      })),
  };
}

// FR-40 & Business rule §17.20: progres gabungan dihitung on-the-fly, TIDAK disimpan di DB.
// Course yang belum di-enroll member dihitung sebagai 0%.
export async function getRoadmapProgress(roadmapId: string, userId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id: roadmapId },
    include: { courses: true },
  });
  if (!roadmap) throw new HttpError(404, 'Roadmap tidak ditemukan');

  if (roadmap.courses.length === 0) {
    return { roadmapId, progress: 0 };
  }

  const courseIds = roadmap.courses.map((rc) => rc.courseId);
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, courseId: { in: courseIds } },
    select: { courseId: true, progress: true },
  });

  const progressMap = new Map(enrollments.map((e) => [e.courseId, e.progress]));
  const total = courseIds.reduce((sum, id) => sum + (progressMap.get(id) ?? 0), 0);
  const progress = Math.round(total / courseIds.length);

  return { roadmapId, progress };
}

// --- Admin ---

export function listRoadmapsForAdmin() {
  return prisma.roadmap.findMany({
    include: {
      courses: { orderBy: { order: 'asc' }, include: { course: { select: { title: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Business rule §17.19: roadmap hanya boleh published=true jika punya minimal 1 course anggota
async function assertPublishableOrDraft(published: boolean, courseIds: string[]) {
  if (published && courseIds.length === 0) {
    throw new HttpError(400, 'Roadmap tidak bisa dipublikasikan tanpa minimal 1 course anggota');
  }
}

export async function createRoadmap(data: RoadmapInput) {
  await assertPublishableOrDraft(data.published, data.courseIds);

  const slug = data.slug ? data.slug : await generateUniqueSlug(data.title);
  if (data.slug) {
    const existing = await prisma.roadmap.findUnique({ where: { slug: data.slug } });
    if (existing) throw new HttpError(409, 'Slug roadmap sudah dipakai');
  }

  return prisma.roadmap.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      published: data.published,
      courses: {
        create: data.courseIds.map((courseId, index) => ({ courseId, order: index + 1 })),
      },
    },
    include: { courses: true },
  });
}

export async function updateRoadmap(id: string, data: Partial<RoadmapInput>) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id }, include: { courses: true } });
  if (!roadmap) throw new HttpError(404, 'Roadmap tidak ditemukan');

  const nextPublished = data.published ?? roadmap.published;
  const nextCourseIds = data.courseIds ?? roadmap.courses.map((c) => c.courseId);
  await assertPublishableOrDraft(nextPublished, nextCourseIds);

  // Jika courseIds dikirim, timpa seluruh relasi RoadmapCourse (pola replace, sesuai PRD §29.10)
  if (data.courseIds) {
    await prisma.roadmapCourse.deleteMany({ where: { roadmapId: id } });
    await prisma.roadmapCourse.createMany({
      data: data.courseIds.map((courseId, index) => ({ roadmapId: id, courseId, order: index + 1 })),
    });
  }

  return prisma.roadmap.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      published: data.published,
    },
    include: { courses: true },
  });
}

// Hapus roadmap TIDAK menghapus course anggotanya — hanya relasi RoadmapCourse (cascade via FK)
export async function deleteRoadmap(id: string) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id } });
  if (!roadmap) throw new HttpError(404, 'Roadmap tidak ditemukan');
  await prisma.roadmap.delete({ where: { id } });
}
