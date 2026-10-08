import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';
import { generateSlug } from '../../utils/slug';

interface RoadmapInput {
  title: string;
  slug?: string;
  description: string;
  thumbnailUrl?: string | null;
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

// Jumlah total menit belajar (sum durationMinutes semua lesson, di semua course anggota).
// Dihitung on-the-fly dari data lessons yang sudah di-include, bukan kolom tersimpan —
// konsisten dengan pola progres roadmap (§17.20): turunan, bukan state baru yang bisa basi.
function sumDurationMinutes(courses: Array<{ course: { lessons: Array<{ durationMinutes: number }> } }>) {
  return courses.reduce(
    (total, rc) => total + rc.course.lessons.reduce((s, l) => s + l.durationMinutes, 0),
    0
  );
}

// FR-39: daftar roadmap publik
export async function listRoadmaps() {
  const roadmaps = await prisma.roadmap.findMany({
    where: { published: true },
    include: {
      courses: {
        include: { course: { select: { published: true, lessons: { select: { durationMinutes: true } } } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return roadmaps.map((r) => {
    // Risiko §24: course yang sudah di-unpublish tidak dihitung agar jumlah yang tampil ke publik akurat
    const publishedCourses = r.courses.filter((rc) => rc.course.published);
    return {
      id: r.id,
      title: r.title,
      slug: r.slug,
      description: r.description,
      thumbnailUrl: r.thumbnailUrl,
      courseCount: publishedCourses.length,
      totalDurationMinutes: sumDurationMinutes(publishedCourses),
    };
  });
}

// FR-39: detail roadmap publik — course yang sudah di-unpublish disembunyikan (mitigasi risiko §24)
export async function getRoadmapDetail(slug: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { slug },
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: { course: { include: { lessons: { select: { durationMinutes: true } } } } },
      },
    },
  });

  if (!roadmap || !roadmap.published) throw new HttpError(404, 'Roadmap tidak ditemukan');

  const publishedCourses = roadmap.courses.filter((rc) => rc.course.published);

  return {
    id: roadmap.id,
    title: roadmap.title,
    slug: roadmap.slug,
    description: roadmap.description,
    thumbnailUrl: roadmap.thumbnailUrl,
    totalDurationMinutes: sumDurationMinutes(publishedCourses),
    courses: publishedCourses.map((rc) => ({
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

export async function listRoadmapsForAdmin() {
  const roadmaps = await prisma.roadmap.findMany({
    include: {
      courses: {
        orderBy: { order: 'asc' },
        include: { course: { select: { id: true, title: true, slug: true, description: true, thumbnailUrl: true, price: true, isFree: true, level: true, published: true, categoryId: true, avgRating: true, reviewCount: true, createdAt: true, lessons: { select: { id: true, courseId: true, title: true, youtubeUrl: true, durationMinutes: true, order: true, isPreview: true } } } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Admin melihat total durasi dari SEMUA course anggota (termasuk yang draft),
  // beda dengan tampilan publik yang cuma menghitung course published.
  return roadmaps.map((r) => ({
    ...r,
    totalDurationMinutes: sumDurationMinutes(r.courses),
  }));
}

// Business rule §17.19: roadmap hanya boleh published=true jika punya minimal 1 course anggota
function assertPublishableOrDraft(published: boolean, courseIds: string[]) {
  if (published && courseIds.length === 0) {
    throw new HttpError(400, 'Roadmap tidak bisa dipublikasikan tanpa minimal 1 course anggota');
  }
}

// Validasi courseIds: semua ID harus benar-benar ada DAN berstatus published —
// tanpa ini, ID tidak valid akan lolos ke database dan baru gagal sebagai FK
// constraint error yang teknis/tidak ramah, bukan pesan error yang jelas ke admin.
async function assertCoursesExistAndPublished(courseIds: string[]) {
  if (courseIds.length === 0) return;

  const uniqueIds = Array.from(new Set(courseIds));
  const found = await prisma.course.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true, published: true, title: true },
  });

  const foundIds = new Set(found.map((c) => c.id));
  const missing = uniqueIds.filter((id) => !foundIds.has(id));
  if (missing.length > 0) {
    throw new HttpError(400, `Course tidak ditemukan: ${missing.join(', ')}`);
  }

  const unpublished = found.filter((c) => !c.published);
  if (unpublished.length > 0) {
    throw new HttpError(
      400,
      `Course berikut belum published, tidak bisa dijadikan anggota roadmap: ${unpublished.map((c) => c.title).join(', ')}`
    );
  }
}

export async function createRoadmap(data: RoadmapInput) {
  assertPublishableOrDraft(data.published, data.courseIds);
  await assertCoursesExistAndPublished(data.courseIds);

  const slug = data.slug ? data.slug : await generateUniqueSlug(data.title);
  if (data.slug) {
    const existing = await prisma.roadmap.findUnique({ where: { slug: data.slug } });
    if (existing) throw new HttpError(409, 'Slug roadmap sudah dipakai');
  }

  // Nested create Prisma (Roadmap + RoadmapCourse sekaligus) sudah atomis secara bawaan —
  // satu query, tidak perlu dibungkus $transaction tambahan.
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
  assertPublishableOrDraft(nextPublished, nextCourseIds);
  if (data.courseIds) {
    await assertCoursesExistAndPublished(data.courseIds);
  }

  // $transaction: hapus relasi lama + buat relasi baru + update data roadmap jadi SATU unit atomis —
  // jika salah satu gagal di tengah jalan, semuanya di-rollback (tidak ada state "roadmap tanpa course" nyasar).
  // PENTING: relasi course HANYA disentuh jika courseIds memang dikirim di request ini —
  // update yang cuma mengubah title/description dkk tidak boleh menghapus course anggota yang sudah ada.
  const operations = [
    ...(data.courseIds
      ? [
          prisma.roadmapCourse.deleteMany({ where: { roadmapId: id } }),
          prisma.roadmapCourse.createMany({
            data: data.courseIds.map((courseId, index) => ({ roadmapId: id, courseId, order: index + 1 })),
          }),
        ]
      : []),
    prisma.roadmap.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        published: data.published,
      },
      include: { courses: true },
    }),
  ];

  const results = await prisma.$transaction(operations);
  return results[results.length - 1];
}

// Hapus roadmap TIDAK menghapus course anggotanya — hanya relasi RoadmapCourse (cascade via FK)
export async function deleteRoadmap(id: string) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id } });
  if (!roadmap) throw new HttpError(404, 'Roadmap tidak ditemukan');
  await prisma.roadmap.delete({ where: { id } });
}
