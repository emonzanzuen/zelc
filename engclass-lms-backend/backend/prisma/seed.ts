// Seed data LMS — mengisi database dengan dataset relasional lengkap (bukan mock frontend).
//
//   npm run seed          Mode AMAN : menambah yang belum ada, memperbarui konten katalog.
//                         Tidak menghapus apa pun. Data milik member nyata tidak disentuh.
//   npm run seed:reset    Mode RESET: MENGHAPUS SELURUH data aplikasi lalu mengisi ulang dari nol
//                         (linimasa & leaderboard disegarkan ke "hari ini"). Hanya untuk dev/staging.
//   npm run seed:verify   Memeriksa dataset terhadap schema.prisma tanpa menyentuh database.
//
// Dataset dibangun oleh seed-data/build-dataset.ts (fungsi murni, deterministik). File ini hanya
// bertugas menulisnya ke database, memetakan ID bila baris dengan kunci alami yang sama sudah ada
// (mis. kategori/course dari seed lama), dan menghitung ulang rating course.

import fs from 'fs';
import path from 'path';
import type { PrismaClient } from '@prisma/client';
import {
  ADMIN_EMAIL, ADMIN_PASSWORD, DEMO_MEMBER_EMAIL, MEMBER_PASSWORD, buildDataset, type Dataset,
} from './build-dataset';

export interface SeedOptions {
  reset: boolean;
  adminPasswordHash: string;
  memberPasswordHash: string;
  now?: Date;
  log?: (msg: string) => void;
}

/** Hapus semua data aplikasi, urutan anak -> induk (FK default Restrict). */
async function wipeAll(prisma: PrismaClient, log: (m: string) => void) {
  log('🧹 Menghapus seluruh data aplikasi...');
  await prisma.roadmapCourse.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
}

function nextCertNumber(n: string): string {
  const m = /^CERT-(\d{4})-(\d{5})$/.exec(n);
  if (!m) return n;
  return `CERT-${m[1]}-${String(Number(m[2]) + 1).padStart(5, '0')}`;
}

export async function runSeed(prisma: PrismaClient, opts: SeedOptions): Promise<Dataset> {
  const log = opts.log ?? (() => undefined);
  const videos = JSON.parse(fs.readFileSync(path.join(__dirname, 'lesson-videos.json'), 'utf8'));
  const ds = buildDataset({ now: opts.now ?? new Date(), videos, adminPasswordHash: opts.adminPasswordHash, memberPasswordHash: opts.memberPasswordHash });

  if (opts.reset) await wipeAll(prisma, log);

  // Peta id dataset -> id sebenarnya di DB (berbeda bila baris dengan kunci alami sama sudah ada).
  const idMap = new Map<string, string>();
  const m = (id: string) => idMap.get(id) ?? id;

  // ---- Users (kunci alami: email). Password/googleId milik user yang sudah ada tidak diubah. ----
  for (const u of ds.users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      idMap.set(u.id, existing.id);
      await prisma.user.update({
        where: { id: existing.id },
        data: { name: u.name, avatarUrl: u.avatarUrl, ...(u.role === 'ADMIN' ? { role: 'ADMIN' as const } : {}) },
      });
    } else {
      await prisma.user.create({ data: u });
    }
  }
  log(`   users            ${ds.users.length}`);

  // ---- Categories (slug) ----
  for (const c of ds.categories) {
    const existing = await prisma.category.findUnique({ where: { slug: c.slug } });
    if (existing) {
      idMap.set(c.id, existing.id);
      await prisma.category.update({ where: { id: existing.id }, data: { name: c.name } });
    } else {
      await prisma.category.create({ data: c });
    }
  }
  log(`   categories       ${ds.categories.length}`);

  // ---- Courses (slug) ----
  for (const c of ds.courses) {
    const { id, ...rest } = c;
    const data = { ...rest, categoryId: m(c.categoryId), authorId: m(c.authorId) };
    const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
    if (existing) {
      idMap.set(id, existing.id);
      await prisma.course.update({ where: { id: existing.id }, data });
    } else {
      await prisma.course.create({ data: { id, ...data } });
    }
  }
  log(`   courses          ${ds.courses.length}`);

  // ---- Lessons (kunci alami: courseId + order) ----
  for (const l of ds.lessons) {
    const { id, ...rest } = l;
    const data = { ...rest, courseId: m(l.courseId) };
    const existing = await prisma.lesson.findFirst({ where: { courseId: data.courseId, order: l.order } });
    if (existing) {
      idMap.set(id, existing.id);
      await prisma.lesson.update({ where: { id: existing.id }, data });
    } else {
      await prisma.lesson.create({ data: { id, ...data } });
    }
  }
  log(`   lessons          ${ds.lessons.length}`);

  // ---- Quizzes (courseId) + Questions (diganti seluruhnya per kuis) ----
  for (const q of ds.quizzes) {
    const { id, ...rest } = q;
    const data = { ...rest, courseId: m(q.courseId) };
    const existing = await prisma.quiz.findUnique({ where: { courseId: data.courseId } });
    if (existing) {
      idMap.set(id, existing.id);
      await prisma.quiz.update({ where: { id: existing.id }, data: { title: data.title, passingGrade: data.passingGrade } });
    } else {
      await prisma.quiz.create({ data: { id, ...data } });
    }
  }
  await prisma.question.deleteMany({ where: { quizId: { in: ds.quizzes.map((q) => m(q.id)) } } });
  await prisma.question.createMany({ data: ds.questions.map((q) => ({ ...q, quizId: m(q.quizId) })) });
  log(`   quizzes          ${ds.quizzes.length}  (soal: ${ds.questions.length})`);

  // ---- Data perilaku: dibuat bila belum ada, TIDAK ditimpa (update: {}) ----
  for (const e of ds.enrollments) {
    const userId = m(e.userId);
    const courseId = m(e.courseId);
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } }, update: {},
      create: { ...e, userId, courseId },
    });
  }
  log(`   enrollments      ${ds.enrollments.length}`);

  for (const p of ds.lessonProgress) {
    const userId = m(p.userId);
    const lessonId = m(p.lessonId);
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } }, update: {},
      create: { ...p, userId, lessonId },
    });
  }
  log(`   lesson progress  ${ds.lessonProgress.length}`);

  for (const t of ds.transactions) {
    await prisma.transaction.upsert({
      where: { id: t.id }, update: {},
      create: { ...t, userId: m(t.userId), courseId: m(t.courseId) },
    });
  }
  log(`   transactions     ${ds.transactions.length}`);

  for (const a of ds.quizAttempts) {
    await prisma.quizAttempt.upsert({
      where: { id: a.id }, update: {},
      create: { ...a, userId: m(a.userId), quizId: m(a.quizId) },
    });
  }
  log(`   quiz attempts    ${ds.quizAttempts.length}`);

  for (const c of ds.certificates) {
    const userId = m(c.userId);
    const courseId = m(c.courseId);
    if (await prisma.certificate.findUnique({ where: { userId_courseId: { userId, courseId } } })) continue;
    // Hindari bentrok certNumber dengan sertifikat yang sudah ada (mis. milik member nyata).
    let certNumber = c.certNumber;
    while (await prisma.certificate.findUnique({ where: { certNumber } })) certNumber = nextCertNumber(certNumber);
    await prisma.certificate.create({ data: { ...c, certNumber, userId, courseId } });
  }
  log(`   certificates     ${ds.certificates.length}`);

  for (const r of ds.reviews) {
    const userId = m(r.userId);
    const courseId = m(r.courseId);
    await prisma.review.upsert({
      where: { userId_courseId: { userId, courseId } }, update: {},
      create: { ...r, userId, courseId },
    });
  }
  log(`   reviews          ${ds.reviews.length}`);

  // ---- Roadmaps (slug) — isi course roadmap diganti sesuai dataset ----
  for (const rm of ds.roadmaps) {
    const { id, ...rest } = rm;
    const existing = await prisma.roadmap.findUnique({ where: { slug: rm.slug } });
    let roadmapId = id;
    if (existing) {
      roadmapId = existing.id;
      idMap.set(id, existing.id);
      await prisma.roadmap.update({ where: { id: existing.id }, data: rest });
    } else {
      await prisma.roadmap.create({ data: rm });
    }
    await prisma.roadmapCourse.deleteMany({ where: { roadmapId } });
    await prisma.roadmapCourse.createMany({
      data: ds.roadmapCourses.filter((x) => x.roadmapId === id).map((x) => ({ ...x, roadmapId, courseId: m(x.courseId) })),
    });
  }
  log(`   roadmaps         ${ds.roadmaps.length}  (course dalam roadmap: ${ds.roadmapCourses.length})`);

  // ---- Hitung ulang rating (aturan §17.16: hanya review isHidden=false), termasuk review nyata ----
  for (const c of ds.courses) {
    const visible = await prisma.review.findMany({ where: { courseId: m(c.id), isHidden: false }, select: { rating: true } });
    const avg = visible.length ? visible.reduce((s, r) => s + r.rating, 0) / visible.length : 0;
    await prisma.course.update({ where: { id: m(c.id) }, data: { avgRating: Math.round(avg * 100) / 100, reviewCount: visible.length } });
  }

  return ds;
}

// ------------------------------------------------------------------------------------------------
// CLI
// ------------------------------------------------------------------------------------------------
async function confirmReset(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL belum di-set (cek file .env).');
  if (process.env.NODE_ENV === 'production') throw new Error('--reset ditolak karena NODE_ENV=production.');
  let target = url;
  let dbName = '';
  try {
    const u = new URL(url);
    dbName = u.pathname.replace(/^\//, '');
    target = `${u.hostname}:${u.port || '5432'}/${dbName}`;
  } catch { /* biarkan apa adanya */ }
  console.log(`\n⚠️  --reset akan MENGHAPUS SEMUA DATA di: ${target}\n`);
  if (process.argv.includes('--yes')) return;
  if (!process.stdin.isTTY) throw new Error('Terminal non-interaktif: tambahkan --yes untuk mengonfirmasi reset.');
  const rl = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  const answer: string = await new Promise((resolve) => rl.question(`Ketik nama database (${dbName}) untuk melanjutkan: `, resolve));
  rl.close();
  if (answer.trim() !== dbName) throw new Error('Konfirmasi tidak cocok — dibatalkan, tidak ada data yang dihapus.');
}

async function main() {
  require('dotenv/config');
  const reset = process.argv.includes('--reset');
  if (reset) await confirmReset();

  const { PrismaClient } = require('@prisma/client') as typeof import('@prisma/client');
  const bcrypt = require('bcrypt') as typeof import('bcrypt');
  const prisma = new PrismaClient();
  try {
    console.log(reset ? '🌱 Seed (mode RESET)...' : '🌱 Seed (mode aman: tambah/perbarui, tidak menghapus)...');
    const [adminPasswordHash, memberPasswordHash] = await Promise.all([bcrypt.hash(ADMIN_PASSWORD, 10), bcrypt.hash(MEMBER_PASSWORD, 10)]);
    const ds = await runSeed(prisma, { reset, adminPasswordHash, memberPasswordHash, log: console.log });

    const revenue = ds.transactions.filter((t) => t.status === 'success').reduce((s, t) => s + t.amount, 0);
    console.log('\n✅ Seed selesai.');
    console.log(`   Pendapatan (transaksi sukses): Rp${revenue.toLocaleString('id-ID')}`);
    console.log('\n   Akun untuk login:');
    console.log(`   • Admin         ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    console.log(`   • Member demo   ${DEMO_MEMBER_EMAIL} / ${MEMBER_PASSWORD}   (punya progres, sertifikat & 1 transaksi pending)`);
    console.log(`   • Member lain   <nama.depan.belakang>@example.com / ${MEMBER_PASSWORD}   (yang daftar via "Google" tidak punya password)`);

    if (ds.meta.missingVideos.length) {
      console.log(`\n⚠️  ${ds.meta.missingVideos.length}/${ds.lessons.length} lesson belum punya video YouTube asli (diisi penanda "ISI_ID_VIDEO").`);
      console.log('   Isi prisma/seed-data/lesson-videos.json lalu jalankan `npm run seed` lagi, atau ubah lewat panel admin. Contoh yang belum diisi:');
      for (const v of ds.meta.missingVideos.slice(0, 5)) console.log(`     - ${v}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error('\n❌ Seed gagal:', e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
