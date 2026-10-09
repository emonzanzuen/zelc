// Verifikasi dataset seed TANPA database:  npm run seed:verify
// 1) Setiap baris dicocokkan dengan prisma/schema.prisma (kolom, tipe, wajib-isi, enum, @unique, FK)
// 2) Aturan bisnis backend dicek ulang (progress, transaksi, kuis, sertifikat, rating, leaderboard)
// Exit code 1 bila ada pelanggaran.

import fs from 'fs';
import path from 'path';
import { buildDataset, uuid, type Dataset } from './build-dataset';
import { parseSchema } from './schema-parser';

// ---------------------------------------------------------------- harness
let failures = 0;
const ok = (msg: string) => console.log(`  ✓ ${msg}`);
const bad = (msg: string) => { failures++; console.log(`  ✗ ${msg}`); };
const check = (cond: boolean, msg: string) => (cond ? ok(msg) : bad(msg));
const section = (t: string) => console.log(`\n${t}`);

const TABLES: [keyof Dataset, string][] = [
  ['users', 'User'], ['categories', 'Category'], ['courses', 'Course'], ['lessons', 'Lesson'], ['quizzes', 'Quiz'],
  ['questions', 'Question'], ['enrollments', 'Enrollment'], ['lessonProgress', 'LessonProgress'], ['transactions', 'Transaction'],
  ['quizAttempts', 'QuizAttempt'], ['certificates', 'Certificate'], ['reviews', 'Review'], ['roadmaps', 'Roadmap'], ['roadmapCourses', 'RoadmapCourse'],
];

function main() {
  const schemaPath = path.join(__dirname, '..', 'schema.prisma');
  const { enums, models } = parseSchema(fs.readFileSync(schemaPath, 'utf8'));
  const videos = JSON.parse(fs.readFileSync(path.join(__dirname, 'lesson-videos.json'), 'utf8'));
  const now = process.env.SEED_NOW ? new Date(process.env.SEED_NOW) : new Date();
  const ds = buildDataset({ now, videos, adminPasswordHash: 'x', memberPasswordHash: 'y' });
  const nowMs = now.getTime();
  const rows = (k: keyof Dataset) => ds[k] as unknown as Record<string, any>[];

  // ============ 1. Kecocokan dengan schema.prisma ============
  section('1. Kecocokan dengan schema.prisma');
  const scalarTypes = new Set(['String', 'Int', 'Float', 'Boolean', 'DateTime', 'Json']);
  const idsByModel = new Map<string, Set<string>>();
  for (const [key, modelName] of TABLES) {
    const model = models.get(modelName);
    if (!model) { bad(`Model ${modelName} tidak ditemukan di schema`); continue; }
    idsByModel.set(modelName, new Set(rows(key).map((r) => r.id)));
    const scalars = [...model.fields.values()].filter((f) => !f.list && (scalarTypes.has(f.type) || enums.has(f.type)));
    const scalarNames = new Set(scalars.map((f) => f.name));
    const errors: string[] = [];
    for (const row of rows(key)) {
      for (const k of Object.keys(row)) if (!scalarNames.has(k)) errors.push(`${modelName}.${k} bukan kolom di schema`);
      for (const f of scalars) {
        const v = row[f.name];
        if (v === undefined || v === null) {
          if (!f.optional && !f.hasDefault) errors.push(`${modelName}.${f.name} wajib diisi`);
          continue;
        }
        const t = f.type;
        const good =
          t === 'String' ? typeof v === 'string' && v.length > 0
          : t === 'Int' ? Number.isInteger(v)
          : t === 'Float' ? typeof v === 'number' && Number.isFinite(v)
          : t === 'Boolean' ? typeof v === 'boolean'
          : t === 'DateTime' ? v instanceof Date && !isNaN(v.getTime())
          : t === 'Json' ? true
          : enums.get(t)!.includes(v);
        if (!good) errors.push(`${modelName}.${f.name} bertipe salah (${t}): ${String(v)}`);
      }
    }
    check(errors.length === 0, `${modelName}: ${rows(key).length} baris sesuai kolom/tipe/enum${errors.length ? ' — ' + [...new Set(errors)].slice(0, 3).join('; ') : ''}`);
  }

  for (const [key, modelName] of TABLES) {
    const model = models.get(modelName)!;
    const groups: string[][] = [...model.uniques, ...[...model.fields.values()].filter((f) => f.unique || f.isId).map((f) => [f.name])];
    for (const cols of groups) {
      const seen = new Set<string>();
      let dup = 0;
      for (const r of rows(key)) {
        if (cols.some((c) => r[c] == null)) continue; // NULL tidak melanggar unique
        const sig = cols.map((c) => String(r[c])).join('|');
        if (seen.has(sig)) dup++;
        seen.add(sig);
      }
      check(dup === 0, `unique ${modelName}(${cols.join(', ')})`);
    }
    for (const f of model.fields.values()) {
      if (!f.relation) continue;
      const target = idsByModel.get(f.type);
      const fk = f.relation.fields[0];
      const missing = rows(key).filter((r) => !target?.has(r[fk])).length;
      check(missing === 0, `FK ${modelName}.${fk} → ${f.type}.id`);
    }
  }

  // ============ 2. Aturan bisnis ============
  section('2. Aturan bisnis backend');
  const courseById = new Map(ds.courses.map((c) => [c.id, c]));
  const lessonsByCourse = new Map<string, typeof ds.lessons>();
  for (const l of ds.lessons) lessonsByCourse.set(l.courseId, [...(lessonsByCourse.get(l.courseId) ?? []), l]);
  const lessonById = new Map(ds.lessons.map((l) => [l.id, l]));
  const enrollKey = (u: string, c: string) => `${u}:${c}`;
  const enrollment = new Map(ds.enrollments.map((e) => [enrollKey(e.userId, e.courseId), e]));
  const userById = new Map(ds.users.map((u) => [u.id, u]));

  // lesson & kuis
  check([...lessonsByCourse.values()].every((ls) => ls.map((l) => l.order).sort((a, b) => a - b).every((o, i) => o === i + 1)), 'urutan lesson tiap course 1..n tanpa lubang');
  check(ds.courses.every((c) => (lessonsByCourse.get(c.id) ?? []).some((l) => l.isPreview)), 'setiap course punya ≥1 lesson preview');
  check(ds.courses.every((c) => c.isFree === (c.price === 0)), 'isFree konsisten dengan price');
  check(ds.questions.every((q) => q.options.length === 4 && new Set(q.options).size === 4 && q.options.includes(q.correctOption)), 'setiap soal: tepat 4 opsi unik & jawaban benar ada di opsi (aturan quiz.validation)');
  const perQuiz = new Map<string, number>();
  for (const q of ds.questions) perQuiz.set(q.quizId, (perQuiz.get(q.quizId) ?? 0) + 1);
  check(ds.quizzes.every((q) => (perQuiz.get(q.id) ?? 0) === 5), 'setiap kuis punya 5 soal');
  const pos = [0, 0, 0, 0];
  for (const q of ds.questions) pos[q.options.indexOf(q.correctOption)]++;
  check(Math.max(...pos) - Math.min(...pos) <= 2, `posisi jawaban benar merata (A/B/C/D = ${pos.join('/')})`);
  check(ds.lessons.every((l) => /^https?:\/\//.test(l.youtubeUrl)), 'youtubeUrl valid sebagai URL (aturan lessons.validation z.string().url())');

  // enrollment & progres
  const progressByEnroll = new Map<string, number>();
  let orphanProgress = 0;
  for (const p of ds.lessonProgress) {
    const l = lessonById.get(p.lessonId)!;
    const e = enrollment.get(enrollKey(p.userId, l.courseId));
    if (!e) { orphanProgress++; continue; }
    progressByEnroll.set(e.id, (progressByEnroll.get(e.id) ?? 0) + 1);
  }
  check(orphanProgress === 0, 'LessonProgress hanya untuk member yang ter-enroll');
  check(ds.enrollments.every((e) => e.progress === Math.round(((progressByEnroll.get(e.id) ?? 0) / lessonsByCourse.get(e.courseId)!.length) * 100)), 'Enrollment.progress = round(lesson selesai / total × 100)');
  check(ds.enrollments.every((e) => e.enrolledAt.getTime() >= userById.get(e.userId)!.createdAt.getTime() && e.enrolledAt.getTime() >= courseById.get(e.courseId)!.createdAt.getTime()), 'enrollment tidak mendahului akun/course');
  check(ds.lessonProgress.every((p) => { const e = enrollment.get(enrollKey(p.userId, lessonById.get(p.lessonId)!.courseId))!; return p.completedAt.getTime() >= e.enrolledAt.getTime(); }), 'lesson selesai setelah enrollment');

  // transaksi
  const success = ds.transactions.filter((t) => t.status === 'success');
  check(/^TRX-\d{8}-\d{6}$/.test(ds.transactions[0].transactionNumber) && ds.transactions.every((t) => /^TRX-\d{8}-\d{6}$/.test(t.transactionNumber)), 'format nomor transaksi TRX-YYYYMMDD-XXXXXX');
  check(success.every((t) => t.amount === courseById.get(t.courseId)!.price && t.paidAt !== null && courseById.get(t.courseId)!.price > 0), 'transaksi sukses: amount = harga course, paidAt terisi');
  check(ds.transactions.filter((t) => t.status !== 'success').every((t) => t.paidAt === null), 'transaksi non-sukses: paidAt kosong');
  check(ds.enrollments.filter((e) => !courseById.get(e.courseId)!.isFree).every((e) => success.some((t) => t.userId === e.userId && t.courseId === e.courseId)), 'setiap enrollment berbayar punya transaksi sukses');
  check(success.every((t) => enrollment.has(enrollKey(t.userId, t.courseId))), 'setiap transaksi sukses punya enrollment');
  check(ds.enrollments.filter((e) => courseById.get(e.courseId)!.isFree).every((e) => !ds.transactions.some((t) => t.userId === e.userId && t.courseId === e.courseId)), 'kelas gratis tanpa transaksi (aturan §17.3)');
  check(ds.transactions.every((t) => t.createdAt.getTime() >= userById.get(t.userId)!.createdAt.getTime() && t.createdAt.getTime() <= nowMs), 'tanggal transaksi wajar (setelah akun dibuat, ≤ sekarang)');
  check(ds.transactions.filter((t) => t.status === 'pending').every((t) => nowMs - t.createdAt.getTime() <= 24 * 3600_000), 'transaksi pending ≤ 24 jam (belum kedaluwarsa Midtrans)');
  check(new Set(ds.transactions.map((t) => t.status)).size === 4, 'keempat status transaksi (pending/success/failed/expired) terwakili');

  // kuis & sertifikat
  check(ds.quizAttempts.every((a) => enrollment.get(enrollKey(a.userId, ds.quizzes.find((q) => q.id === a.quizId)!.courseId))?.progress === 100), 'kuis hanya dikerjakan saat progress 100% (FR-19)');
  check(ds.quizAttempts.every((a) => a.passed === (a.score >= ds.quizzes.find((q) => q.id === a.quizId)!.passingGrade) && a.score % 20 === 0), 'passed konsisten dengan passingGrade; skor kelipatan 20 (5 soal)');
  check(ds.certificates.every((c) => ds.quizAttempts.some((a) => a.userId === c.userId && a.passed && ds.quizzes.find((q) => q.id === a.quizId)!.courseId === c.courseId)), 'sertifikat hanya untuk yang lulus kuis');
  check(ds.certificates.every((c) => /^CERT-\d{4}-\d{5}$/.test(c.certNumber)), 'format nomor sertifikat CERT-YYYY-XXXXX');
  check(ds.certificates.every((c) => c.issuedAt.getTime() >= Math.min(...ds.quizAttempts.filter((a) => a.userId === c.userId && a.passed).map((a) => a.attemptedAt.getTime()))), 'sertifikat terbit pada/setelah kelulusan');

  // review & rating
  check(ds.reviews.every((r) => enrollment.has(enrollKey(r.userId, r.courseId)) && r.rating >= 1 && r.rating <= 5), 'review hanya dari member ter-enroll, rating 1–5 (aturan §17.15)');
  check(ds.reviews.every((r) => r.createdAt.getTime() >= enrollment.get(enrollKey(r.userId, r.courseId))!.enrolledAt.getTime() && r.createdAt.getTime() <= nowMs), 'tanggal review wajar');
  const ratingOk = ds.courses.every((c) => {
    const vis = ds.reviews.filter((r) => r.courseId === c.id && !r.isHidden);
    const avg = vis.length ? vis.reduce((s, r) => s + r.rating, 0) / vis.length : 0;
    return c.reviewCount === vis.length && Math.abs(c.avgRating - avg) < 0.006;
  });
  check(ratingOk, 'Course.avgRating/reviewCount = rata-rata review tidak tersembunyi (aturan §17.16)');
  check(ds.reviews.some((r) => r.isHidden), `ada review yang disembunyikan admin (${ds.reviews.filter((r) => r.isHidden).length})`);

  // roadmap
  check(ds.roadmaps.every((rm) => { const cs = ds.roadmapCourses.filter((x) => x.roadmapId === rm.id); return cs.length >= 2 && cs.every((c) => c.order >= 1); }), 'setiap roadmap berisi ≥2 course berurutan');

  // ============ 3. Simulasi respons endpoint ============
  section('3. Simulasi respons endpoint (logika sama dengan service backend)');
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const agg = new Map<string, { name: string; lessons: number; minutes: number }>();
  for (const p of ds.lessonProgress.filter((p) => p.completedAt.getTime() >= monthStart)) {
    const e = agg.get(p.userId) ?? { name: userById.get(p.userId)!.name, lessons: 0, minutes: 0 };
    e.lessons++; e.minutes += lessonById.get(p.lessonId)!.durationMinutes; agg.set(p.userId, e);
  }
  const board = [...agg.values()].sort((a, b) => b.minutes - a.minutes || b.lessons - a.lessons);
  // Leaderboard reset tiap bulan (§17.17): tepat setelah pergantian bulan wajar nyaris kosong.
  const daysIntoMonth = (nowMs - monthStart) / 86_400_000;
  const need = daysIntoMonth >= 3 ? 10 : 1;
  check(board.length >= need, `GET /leaderboard (bulan ini): ${board.length} member (minimal ${need} pada hari ke-${daysIntoMonth.toFixed(1)} bulan ini)`);
  console.log('     ' + board.slice(0, 5).map((b, i) => `#${i + 1} ${b.name} (${b.lessons} lesson, ${b.minutes} mnt)`).join(' | '));

  const revenue = success.reduce((s, t) => s + t.amount, 0);
  const members = ds.users.filter((u) => u.role === 'MEMBER').length;
  console.log(`     GET /admin/stats → revenue Rp${revenue.toLocaleString('id-ID')}, ${success.length} transaksi sukses, ${members} member, ${ds.courses.length} course`);
  const monthly = new Map<string, number>();
  for (let i = 11; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); monthly.set(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}`, 0); }
  for (const t of success) { const k = `${t.paidAt!.getFullYear()}-${pad2(t.paidAt!.getMonth() + 1)}`; if (monthly.has(k)) monthly.set(k, monthly.get(k)! + t.amount); }
  console.log('     revenue/bulan: ' + [...monthly.entries()].filter(([, v]) => v > 0).map(([k, v]) => `${k}: ${(v / 1e6).toFixed(2)}jt`).join(' · '));
  {
    // Kelas berbayar pertama baru rilis pertengahan Juni, jadi grafik wajar dimulai dari sana.
    // Yang diperiksa: berpendapatan ≥4 bulan dan TIDAK ada bulan kosong di antara bulan pertama & terakhir.
    const series = [...monthly.values()];
    const first = series.findIndex((v) => v > 0);
    const last = series.length - 1 - [...series].reverse().findIndex((v) => v > 0);
    const gaps = series.slice(first, last + 1).filter((v) => v === 0).length;
    check(series.filter((v) => v > 0).length >= 4 && gaps === 0, `grafik revenue ≥4 bulan berturut-turut tanpa bulan kosong (${series.filter((v) => v > 0).length} bulan)`);
  }

  console.log('\n     GET /courses (kartu kursus):');
  for (const c of [...ds.courses].sort((a, b) => ds.enrollments.filter((e) => e.courseId === b.id).length - ds.enrollments.filter((e) => e.courseId === a.id).length)) {
    const n = ds.enrollments.filter((e) => e.courseId === c.id).length;
    console.log(`       ${String(n).padStart(2)} siswa · ★ ${c.avgRating.toFixed(2)} (${c.reviewCount}) · ${c.price === 0 ? 'Gratis' : 'Rp' + c.price.toLocaleString('id-ID')} · ${c.title}`);
  }
  check(ds.courses.every((c) => ds.enrollments.some((e) => e.courseId === c.id)), 'setiap course punya ≥1 siswa');

  // ============ 4. Determinisme ============
  section('4. Determinisme');
  const again = buildDataset({ now, videos, adminPasswordHash: 'x', memberPasswordHash: 'y' });
  check(JSON.stringify(again) === JSON.stringify(ds), 'dua kali build menghasilkan dataset identik (seed aman dijalankan ulang)');
  check(uuid('x') === uuid('x') && /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid('x')), 'UUID turunan valid & stabil');

  console.log(`\nVideo lesson belum diisi: ${ds.meta.missingVideos.length}/${ds.lessons.length}`);
  console.log(failures === 0 ? '\n✅ Semua pemeriksaan lolos.' : `\n❌ ${failures} pemeriksaan gagal.`);
  process.exit(failures === 0 ? 0 : 1);
}

const pad2 = (n: number) => String(n).padStart(2, '0');
main();
