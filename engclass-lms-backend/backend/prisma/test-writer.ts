// Menguji prisma/seed.ts terhadap database tiruan (lihat fake-prisma.ts):  npm run seed:test
// Skenario: DB kosong, seed ulang, seed di hari berbeda, DB lama (seed versi sebelumnya + member nyata), reset.

import fs from 'fs';
import path from 'path';
import { createFakePrisma } from './fake-prisma';
import { runSeed } from '../seed';
import { buildDataset } from './build-dataset';

const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.prisma'), 'utf8');
const videos = JSON.parse(fs.readFileSync(path.join(__dirname, 'lesson-videos.json'), 'utf8'));
const HASH = { adminPasswordHash: 'ADMIN_HASH', memberPasswordHash: 'MEMBER_HASH' };

let failures = 0;
const check = (c: boolean, m: string) => { console.log(`  ${c ? '✓' : '✗'} ${m}`); if (!c) failures++; };
const run = async (title: string, fn: () => Promise<void>) => {
  console.log(`\n${title}`);
  try { await fn(); } catch (e) { failures++; console.log(`  ✗ EXCEPTION: ${e instanceof Error ? e.message : e}`); }
};
const NOW = new Date('2026-10-08T10:00:00');
const sizes = (db: ReturnType<typeof createFakePrisma>) => Object.fromEntries([...db.tables].map(([k, v]) => [k, v.length]).sort());
const diff = (a: Record<string, number>, b: Record<string, number>) => Object.keys(b).filter((k) => a[k] !== b[k]).map((k) => `${k}: ${a[k]}≠${b[k]}`).join(', ');

async function main() {
  const expected = buildDataset({ now: NOW, videos, ...HASH });
  const exp = {
    User: expected.users.length, Category: expected.categories.length, Course: expected.courses.length, Lesson: expected.lessons.length,
    Quiz: expected.quizzes.length, Question: expected.questions.length, Enrollment: expected.enrollments.length,
    LessonProgress: expected.lessonProgress.length, Transaction: expected.transactions.length, QuizAttempt: expected.quizAttempts.length,
    Certificate: expected.certificates.length, Review: expected.reviews.length, Roadmap: expected.roadmaps.length, RoadmapCourse: expected.roadmapCourses.length,
  };

  await run('A. Database kosong → seed (mode aman)', async () => {
    const db = createFakePrisma(schema);
    await runSeed(db.client, { reset: false, now: NOW, ...HASH });
    check(diff(sizes(db), exp) === '', `jumlah baris tiap tabel = dataset ${diff(sizes(db), exp)}`);
    const rated = db.tables.get('Course')!.every((c) => c.reviewCount === expected.courses.find((x) => x.slug === c.slug)!.reviewCount);
    check(rated, 'rating course terhitung ulang & sama dengan dataset');
  });

  await run('B. Seed dijalankan ulang (waktu sama) → idempoten', async () => {
    const db = createFakePrisma(schema);
    await runSeed(db.client, { reset: false, now: NOW, ...HASH });
    const before = JSON.stringify(sizes(db));
    await runSeed(db.client, { reset: false, now: NOW, ...HASH });
    check(JSON.stringify(sizes(db)) === before, 'jumlah baris tidak berubah');
  });

  await run('C. Seed dijalankan lagi 20 hari kemudian → tidak menggandakan data', async () => {
    const db = createFakePrisma(schema);
    await runSeed(db.client, { reset: false, now: NOW, ...HASH });
    const revenue = () => db.tables.get('Transaction')!.filter((t) => t.status === 'success').reduce((s, t) => s + t.amount, 0);
    const r1 = revenue();
    const trx1 = db.tables.get('Transaction')!.length;
    await runSeed(db.client, { reset: false, now: new Date(NOW.getTime() + 20 * 86_400_000), ...HASH });
    const pairs = db.tables.get('Transaction')!.filter((t) => t.status === 'success').map((t) => `${t.userId}:${t.courseId}`);
    check(new Set(pairs).size === pairs.length, 'tidak ada transaksi sukses ganda untuk user+course yang sama');
    check(revenue() <= r1 * 1.15, `pendapatan tidak berlipat (Rp${r1.toLocaleString('id-ID')} → Rp${revenue().toLocaleString('id-ID')})`);
    check(db.tables.get('Transaction')!.length <= trx1 + 8, `jumlah transaksi nyaris sama (${trx1} → ${db.tables.get('Transaction')!.length})`);
  });

  // ---- DB lama: persis bentuk seed versi sebelumnya + satu member nyata ----
  const legacy = () => {
    const db = createFakePrisma(schema);
    const id = (n: string) => `legacy-${n}`;
    const raw = db.insertRaw;
    raw('User', { id: id('admin'), name: 'Admin LMS', email: 'admin@lmsenglish.test', password: 'LEGACY_HASH', role: 'ADMIN' });
    for (const [s, n] of [['grammar', 'Grammar'], ['speaking', 'Speaking'], ['toefl', 'Persiapan TOEFL'], ['ielts', 'Persiapan IELTS']]) raw('Category', { id: id(s), name: n, slug: s });
    const courses: [string, string, string, number][] = [
      ['grammar-dasar-untuk-pemula', 'Grammar Dasar untuk Pemula', 'grammar', 0], ['persiapan-toefl-itp', 'Persiapan TOEFL ITP', 'toefl', 150000],
      ['speaking-percaya-diri', 'Speaking dengan Percaya Diri', 'speaking', 99000], ['vocabulary-booster-1000-kata', 'Vocabulary Booster', 'grammar', 79000],
      ['persiapan-ielts-academic', 'Persiapan IELTS Academic', 'ielts', 175000],
    ];
    for (const [slug, title, cat, price] of courses) {
      raw('Course', { id: id(slug), title, slug, description: 'lama', price, isFree: price === 0, level: 'Pemula', published: true, categoryId: id(cat), authorId: id('admin') });
      const n = slug === 'grammar-dasar-untuk-pemula' ? 3 : 1;
      for (let o = 1; o <= n; o++) raw('Lesson', { id: id(`${slug}-l${o}`), courseId: id(slug), title: `Lama ${o}`, youtubeUrl: 'https://www.youtube.com/watch?v=example1', durationMinutes: 10, order: o, isPreview: o === 1 });
    }
    raw('Quiz', { id: id('quiz-g'), courseId: id('grammar-dasar-untuk-pemula'), title: 'Quiz Grammar Dasar', passingGrade: 70 });
    for (let i = 1; i <= 2; i++) raw('Question', { id: id(`q${i}`), quizId: id('quiz-g'), text: `Soal lama ${i}`, options: ['a', 'b', 'c', 'd'], correctOption: 'a' });
    for (const [slug, title, cs] of [['jalur-siap-toefl', 'Jalur Siap TOEFL', ['grammar-dasar-untuk-pemula', 'persiapan-toefl-itp']], ['jalur-siap-ielts-academic', 'Jalur IELTS', ['vocabulary-booster-1000-kata', 'persiapan-ielts-academic']], ['jalur-karier-business-english', 'Jalur Karier', ['grammar-dasar-untuk-pemula', 'speaking-percaya-diri']]] as [string, string, string[]][]) {
      raw('Roadmap', { id: id(slug), title, slug, description: 'lama', published: true });
      cs.forEach((c, i) => raw('RoadmapCourse', { id: id(`rc-${slug}-${i}`), roadmapId: id(slug), courseId: id(c), order: i + 1 }));
    }
    // member NYATA: enrollment + progres + review + kuis + sertifikat dengan nomor yang bentrok dengan seed
    raw('User', { id: id('real'), name: 'Member Nyata', email: 'nyata@gmail.com', password: 'REAL_HASH', role: 'MEMBER' });
    raw('Enrollment', { id: id('enr'), userId: id('real'), courseId: id('grammar-dasar-untuk-pemula'), progress: 100 });
    for (let o = 1; o <= 3; o++) raw('LessonProgress', { id: id(`lp${o}`), userId: id('real'), lessonId: id(`grammar-dasar-untuk-pemula-l${o}`) });
    raw('Review', { id: id('rev'), userId: id('real'), courseId: id('grammar-dasar-untuk-pemula'), rating: 1, comment: 'review nyata' });
    raw('QuizAttempt', { id: id('att'), userId: id('real'), quizId: id('quiz-g'), score: 100, passed: true });
    raw('Certificate', { id: id('cert'), certNumber: 'CERT-2026-00001', userId: id('real'), courseId: id('grammar-dasar-untuk-pemula') });
    return db;
  };

  await run('D. DB lama (seed versi sebelumnya + member nyata) → seed mode aman', async () => {
    const db = legacy();
    await runSeed(db.client, { reset: false, now: NOW, ...HASH });
    const T = (n: string) => db.tables.get(n)!;
    check(T('Course').length === 12, `course = 12, tanpa duplikat (${T('Course').length})`);
    check(T('Course').find((c) => c.slug === 'grammar-dasar-untuk-pemula')!.id === 'legacy-grammar-dasar-untuk-pemula', 'id course lama dipertahankan (relasi tak putus)');
    check(T('Course').find((c) => c.slug === 'speaking-percaya-diri')!.title === 'Speaking Percaya Diri untuk Kerja', 'konten course lama diperbarui');
    check(T('Lesson').length === expected.lessons.length, `lesson = ${expected.lessons.length} (lama diperbarui, sisanya ditambah)`);
    check(T('Lesson').find((l) => l.id === 'legacy-grammar-dasar-untuk-pemula-l1')!.youtubeUrl.includes('pDJ7lqxBBXo'), 'lesson lama ikut dapat video baru');
    check(T('Quiz').find((q) => q.courseId === 'legacy-grammar-dasar-untuk-pemula')!.id === 'legacy-quiz-g', 'kuis lama dipertahankan');
    check(T('Question').filter((q) => q.quizId === 'legacy-quiz-g').length === 5, 'soal kuis lama diganti 5 soal baru');
    check(T('User').find((u) => u.email === 'admin@lmsenglish.test')!.password === 'LEGACY_HASH', 'password admin lama tidak diubah');
    check(T('Roadmap').length === 3 && T('RoadmapCourse').length === expected.roadmapCourses.length, 'roadmap = 3, isinya diganti sesuai dataset');
    check(T('Enrollment').some((e) => e.id === 'legacy-enr') && T('LessonProgress').filter((p) => p.userId === 'legacy-real').length === 3, 'enrollment & progres member nyata utuh');
    check(T('Certificate').find((c) => c.id === 'legacy-cert')!.certNumber === 'CERT-2026-00001', 'sertifikat member nyata utuh');
    const nums = T('Certificate').map((c) => c.certNumber);
    check(new Set(nums).size === nums.length, `nomor sertifikat unik (seed menghindari bentrok dengan CERT-2026-00001)`);
    const g = T('Course').find((c) => c.slug === 'grammar-dasar-untuk-pemula')!;
    const vis = T('Review').filter((r) => r.courseId === g.id && !r.isHidden);
    check(g.reviewCount === vis.length && vis.some((r) => r.comment === 'review nyata'), 'rating course ikut memasukkan review member nyata');
  });

  await run('E. Mode reset pada DB berisi data lama', async () => {
    const db = legacy();
    await runSeed(db.client, { reset: true, now: NOW, ...HASH });
    check(diff(sizes(db), exp) === '', `jumlah baris = dataset persis, urutan hapus tidak melanggar FK ${diff(sizes(db), exp)}`);
    check(!db.tables.get('User')!.some((u) => u.email === 'nyata@gmail.com'), 'data lama terhapus');
    check(db.tables.get('User')!.find((u) => u.email === 'admin@lmsenglish.test')!.password === 'ADMIN_HASH', 'admin dibuat ulang dengan password seed');
  });

  console.log(failures === 0 ? '\n✅ Semua skenario penulis seed lolos.' : `\n❌ ${failures} pemeriksaan gagal.`);
  process.exit(failures === 0 ? 0 : 1);
}
main();
