import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';
import { generateCertificatePdf } from '../../lib/certificatePdf';

export async function verifyCertificate(certNumber: string) {
  const certificate = await prisma.certificate.findUnique({
    where: { certNumber },
    include: { user: { select: { name: true } }, course: { select: { title: true } } },
  });

  if (!certificate) return { valid: false as const };

  return {
    valid: true as const,
    name: certificate.user.name,
    courseTitle: certificate.course.title,
    issuedAt: certificate.issuedAt,
  };
}

// Response diratakan (courseTitle, userName flat) — harus cocok persis dengan tipe
// `Certificate` di frontend (src/types/index.ts), bukan bentuk mentah Prisma.
export async function listMyCertificates(userId: string) {
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: { select: { title: true, slug: true } },
      user: { select: { name: true } },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return certificates.map((c) => ({
    id: c.id,
    certNumber: c.certNumber,
    userId: c.userId,
    userName: c.user.name,
    courseId: c.courseId,
    courseTitle: c.course.title,
    courseSlug: c.course.slug,
    fileUrl: c.fileUrl,
    issuedAt: c.issuedAt,
  }));
}

export async function downloadMyCertificate(userId: string, certificateId: string) {
  const certificate = await prisma.certificate.findFirst({
    where: { id: certificateId, userId },
    include: { user: { select: { name: true } }, course: { select: { title: true, quiz: { select: { id: true } } } } },
  });
  if (!certificate) throw new HttpError(404, 'Sertifikat tidak ditemukan');

  const quizId = certificate.course.quiz?.id;
  if (!quizId) throw new HttpError(404, 'Data kelulusan tidak ditemukan');
  const passingAttempt = await prisma.quizAttempt.findFirst({
    where: { userId, quizId, passed: true },
    orderBy: { attemptedAt: 'desc' },
    select: { score: true },
  });
  if (!passingAttempt) throw new HttpError(404, 'Data kelulusan tidak ditemukan');

  return generateCertificatePdf({
    name: certificate.user.name,
    courseTitle: certificate.course.title,
    certNumber: certificate.certNumber,
    score: passingAttempt.score,
    issuedAt: certificate.issuedAt,
  });
}
