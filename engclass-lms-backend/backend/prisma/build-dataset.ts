// Pembangun dataset seed — FUNGSI MURNI (tanpa Prisma / database).
//
// Seluruh baris dibangkitkan secara deterministik (PRNG ber-seed tetap + UUID turunan dari kunci),
// sehingga hasilnya konsisten di tiap eksekusi dan bisa diuji penuh lewat `npm run seed:verify`
// tanpa perlu database. Semua tanggal relatif terhadap `now`, jadi leaderboard bulan berjalan
// dan grafik revenue selalu terisi kapan pun seed dijalankan.
//
// Konsistensi yang dijaga (mengikuti logika service backend):
//  - Enrollment.progress = round(lesson selesai / total lesson * 100)   (lessons.service.ts)
//  - Course berbayar hanya punya enrollment jika ada Transaction 'success' senilai harga course
//  - Kuis hanya dikerjakan bila progress 100%; sertifikat hanya terbit jika lulus (quiz.service.ts)
//  - Course.avgRating/reviewCount = rata-rata review yang isHidden=false (reviews.service.ts)
//  - Leaderboard dihitung dari LessonProgress bulan berjalan (leaderboard.service.ts)

import crypto from 'crypto';
import { CATEGORIES, COURSES, ROADMAPS, type CourseSeed } from './catalog';

export const ADMIN_EMAIL = 'admin@lmsenglish.test';
export const ADMIN_PASSWORD = 'admin12345';
export const DEMO_MEMBER_EMAIL = 'dimas.pratama@example.com';
export const MEMBER_PASSWORD = 'Member12345';
export const VIDEO_PLACEHOLDER_ID = 'ISI_ID_VIDEO';

// ---------------------------------------------------------------------------------------------
// Tipe baris (hanya kolom skalar — sama persis dengan field di schema.prisma)
// ---------------------------------------------------------------------------------------------
export interface UserRow { id: string; name: string; email: string; password: string | null; googleId: string | null; role: 'ADMIN' | 'MEMBER'; avatarUrl: string | null; createdAt: Date }
export interface CategoryRow { id: string; name: string; slug: string }
export interface CourseRow { id: string; title: string; slug: string; description: string; thumbnailUrl: string; price: number; isFree: boolean; level: string; published: boolean; categoryId: string; authorId: string; avgRating: number; reviewCount: number; createdAt: Date }
export interface LessonRow { id: string; courseId: string; title: string; youtubeUrl: string; durationMinutes: number; order: number; isPreview: boolean }
export interface QuizRow { id: string; courseId: string; title: string; passingGrade: number }
export interface QuestionRow { id: string; quizId: string; text: string; options: string[]; correctOption: string }
export interface EnrollmentRow { id: string; userId: string; courseId: string; progress: number; enrolledAt: Date }
export interface LessonProgressRow { id: string; userId: string; lessonId: string; completedAt: Date }
export interface TransactionRow { id: string; transactionNumber: string; userId: string; courseId: string; amount: number; status: 'pending' | 'success' | 'failed' | 'expired'; midtransOrderId: string; paidAt: Date | null; createdAt: Date }
export interface QuizAttemptRow { id: string; userId: string; quizId: string; score: number; passed: boolean; attemptedAt: Date }
export interface CertificateRow { id: string; certNumber: string; userId: string; courseId: string; fileUrl: string | null; issuedAt: Date }
export interface ReviewRow { id: string; userId: string; courseId: string; rating: number; comment: string | null; isHidden: boolean; createdAt: Date }
export interface RoadmapRow { id: string; title: string; slug: string; description: string; thumbnailUrl: string; published: boolean; createdAt: Date }
export interface RoadmapCourseRow { id: string; roadmapId: string; courseId: string; order: number }

export interface Dataset {
  users: UserRow[];
  categories: CategoryRow[];
  courses: CourseRow[];
  lessons: LessonRow[];
  quizzes: QuizRow[];
  questions: QuestionRow[];
  enrollments: EnrollmentRow[];
  lessonProgress: LessonProgressRow[];
  transactions: TransactionRow[];
  quizAttempts: QuizAttemptRow[];
  certificates: CertificateRow[];
  reviews: ReviewRow[];
  roadmaps: RoadmapRow[];
  roadmapCourses: RoadmapCourseRow[];
  meta: { missingVideos: string[]; leaderboardThisMonth: number };
}

export interface BuildOptions {
  now: Date;
  /** Isi lesson-videos.json: '<slug>#<order>' -> ID/URL YouTube. */
  videos: Record<string, string>;
  adminPasswordHash: string;
  memberPasswordHash: string;
}

// ---------------------------------------------------------------------------------------------
// Utilitas deterministik
// ---------------------------------------------------------------------------------------------
const MIN = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;

/** UUID v5-style turunan dari kunci — id stabil antar-eksekusi. */
export function uuid(key: string): string {
  const b = Buffer.from(crypto.createHash('sha1').update(`engclass-seed:${key}`).digest().subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  return crypto.createHash('md5').update(s).digest().readUInt32LE(0);
}

const pad = (n: number, w = 2) => String(n).padStart(w, '0');

export function toWatchUrl(idOrUrl: string): string {
  const v = idOrUrl.trim();
  return /^https?:\/\//i.test(v) ? v : `https://www.youtube.com/watch?v=${v}`;
}

function slugifyName(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '.');
}

// ---------------------------------------------------------------------------------------------
// Data member (nama Indonesia). 10 pertama mengikuti persona yang dipakai di UI.
// ---------------------------------------------------------------------------------------------
interface MemberSpec { name: string; daysAgo?: number; google?: boolean }

const MEMBER_SPECS: MemberSpec[] = [
  { name: 'Dimas Pratama', daysAgo: 118, google: false }, // akun demo utama (skenario ditulis manual)
  { name: 'Rani Kusuma', daysAgo: 110, google: true },
  { name: 'Fajar Nugroho', daysAgo: 99, google: false },
  { name: 'Sinta Wulandari', daysAgo: 85, google: true },
  { name: 'Bagas Aditya', daysAgo: 68, google: false },
  { name: 'Citra Dewi', daysAgo: 60, google: true },
  { name: 'Eko Saputra', daysAgo: 45, google: false },
  { name: 'Nadia Rahma', daysAgo: 36, google: true },
  { name: 'Yoga Permana', daysAgo: 30, google: false },
  { name: 'Melati Handayani', daysAgo: 25, google: true },
  ...[
    'Putri Anggraini', 'Rizky Maulana', 'Ayu Lestari', 'Hendra Gunawan', 'Dewi Safitri',
    'Arif Hidayat', 'Intan Permata', 'Galih Setiawan', 'Maya Kartika', 'Irfan Hakim',
    'Lestari Ningsih', 'Teguh Prasetyo', 'Wulan Sari', 'Andika Putra', 'Salsabila Zahra',
    'Reza Firmansyah', 'Anisa Rahmawati', 'Bayu Kurniawan', 'Tiara Octaviani', 'Dani Ramadhan',
    'Fitri Handayani', 'Kevin Wijaya', 'Mega Puspita', 'Naufal Hakim', 'Olivia Tan',
    'Rudi Hartono', 'Syifa Nurhaliza', 'Vina Oktaviani', 'Wahyu Nugraha', 'Yuni Astuti',
  ].map((name) => ({ name })),
];

// Review: kalimat generik (dipakai bila rating bukan 5 atau sebagai variasi)
const REVIEW_BY_RATING: Record<number, string[]> = {
  5: ['Sangat membantu, penjelasannya mudah dipahami!', 'Worth it banget. Materinya jelas dan terstruktur.'],
  4: ['Materinya lengkap, cuma agak padat untuk pemula.', 'Bagus dan jelas. Semoga ke depannya ditambah materi dan latihan lagi.'],
  3: ['Materinya oke, tapi menurut saya masih bisa ditambah lebih banyak latihan soal.', 'Cukup membantu, hanya saja tempo penjelasannya agak cepat untuk saya.'],
  2: ['Kurang sesuai ekspektasi, saya berharap ada lebih banyak contoh kalimat.'],
  1: ['Videonya sering buffering di koneksi saya, jadi sulit lanjut belajar.'],
};
const SPAM_COMMENT = 'Mau kelas murah? Cek promo di bio instagram kami ya kak!! 🔥🔥';

// ---------------------------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------------------------
export function buildDataset(opts: BuildOptions): Dataset {
  const { now, videos } = opts;
  const rand = mulberry32(20261008);
  const nowMs = now.getTime();
  const monthStartMs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const daysAgo = (n: number) => new Date(nowMs - n * DAY);
  /** Titik waktu pada bulan berjalan (f = 0..1 dari awal bulan sampai sekarang). */
  const thisMonth = (f: number) => new Date(monthStartMs + f * (nowMs - monthStartMs));
  const clampTime = (ms: number, min: number, max: number) => new Date(Math.min(Math.max(ms, min), max));

  const weighted = <T,>(items: T[], weights: number[], k: number): T[] => {
    const pool = items.map((it, i) => ({ it, w: weights[i] }));
    const out: T[] = [];
    while (out.length < k && pool.length) {
      const total = pool.reduce((s, p) => s + p.w, 0);
      let r = rand() * total;
      let idx = 0;
      for (; idx < pool.length; idx++) {
        r -= pool[idx].w;
        if (r <= 0) break;
      }
      if (idx >= pool.length) idx = pool.length - 1;
      out.push(pool[idx].it);
      pool.splice(idx, 1);
    }
    return out;
  };
  const pickWeighted = <T,>(items: T[], weights: number[]): T => weighted(items, weights, 1)[0];

  const ds: Dataset = {
    users: [], categories: [], courses: [], lessons: [], quizzes: [], questions: [],
    enrollments: [], lessonProgress: [], transactions: [], quizAttempts: [], certificates: [],
    reviews: [], roadmaps: [], roadmapCourses: [],
    meta: { missingVideos: [], leaderboardThisMonth: 0 },
  };

  // ---- Admin ----
  const admin: UserRow = {
    id: uuid('user:admin'), name: 'Admin LMS', email: ADMIN_EMAIL, password: opts.adminPasswordHash,
    googleId: null, role: 'ADMIN', avatarUrl: null, createdAt: daysAgo(185),
  };
  ds.users.push(admin);

  // ---- Kategori ----
  const categoryBySlug = new Map<string, CategoryRow>();
  for (const c of CATEGORIES) {
    const row = { id: uuid(`category:${c.slug}`), name: c.name, slug: c.slug };
    ds.categories.push(row);
    categoryBySlug.set(c.slug, row);
  }

  // ---- Course, lesson, kuis ----
  interface CourseCtx { seed: CourseSeed; row: CourseRow; lessons: LessonRow[]; quiz: QuizRow }
  const courseCtx = new Map<string, CourseCtx>();
  let questionCounter = 0;
  for (const seed of COURSES) {
    const category = categoryBySlug.get(seed.categorySlug);
    if (!category) throw new Error(`Kategori ${seed.categorySlug} tidak ada (course ${seed.slug})`);
    const row: CourseRow = {
      id: uuid(`course:${seed.slug}`), title: seed.title, slug: seed.slug, description: seed.description,
      thumbnailUrl: `https://picsum.photos/seed/${seed.slug}/640/360`,
      price: seed.price, isFree: seed.price === 0, level: seed.level, published: true,
      categoryId: category.id, authorId: admin.id, avgRating: 0, reviewCount: 0, createdAt: daysAgo(seed.daysAgo),
    };
    ds.courses.push(row);

    const lessons = seed.lessons.map<LessonRow>((l, i) => {
      const order = i + 1;
      const raw = (videos[`${seed.slug}#${order}`] ?? '').trim();
      if (!raw) ds.meta.missingVideos.push(`${seed.slug}#${order} — ${l.title}`);
      return {
        id: uuid(`lesson:${seed.slug}:${order}`), courseId: row.id, title: l.title,
        youtubeUrl: toWatchUrl(raw || VIDEO_PLACEHOLDER_ID),
        durationMinutes: l.durationMinutes, order, isPreview: l.isPreview,
      };
    });
    ds.lessons.push(...lessons);

    const quiz: QuizRow = { id: uuid(`quiz:${seed.slug}`), courseId: row.id, title: seed.quiz.title, passingGrade: seed.quiz.passingGrade };
    ds.quizzes.push(quiz);
    seed.quiz.questions.forEach((q, i) => {
      // Posisi jawaban benar: seimbang (tiap blok 4 soal memuat A/B/C/D masing-masing sekali,
      // urutannya diacak per blok); opsi salah diacak deterministik per soal.
      const block = Math.floor(questionCounter / 4);
      const perm = [0, 1, 2, 3];
      const pr = mulberry32(block * 7919 + 13);
      for (let j = 3; j > 0; j--) { const k = Math.floor(pr() * (j + 1)); [perm[j], perm[k]] = [perm[k], perm[j]]; }
      const correctPos = perm[questionCounter % 4];
      questionCounter++;
      const wrong = [...q.wrong];
      const wr = mulberry32(hashString(q.text));
      for (let j = wrong.length - 1; j > 0; j--) { const k = Math.floor(wr() * (j + 1)); [wrong[j], wrong[k]] = [wrong[k], wrong[j]]; }
      const options = [...wrong];
      options.splice(correctPos, 0, q.correct);
      ds.questions.push({ id: uuid(`question:${seed.slug}:${i + 1}`), quizId: quiz.id, text: q.text, options, correctOption: q.correct });
    });

    courseCtx.set(seed.slug, { seed, row, lessons, quiz });
  }
  const ctxOf = (slug: string) => {
    const c = courseCtx.get(slug);
    if (!c) throw new Error(`Course ${slug} tidak ada`);
    return c;
  };

  // ---- Member ----
  const members: UserRow[] = MEMBER_SPECS.map((spec, i) => {
    const google = spec.google ?? rand() < 0.35;
    const days = spec.daysAgo ?? 3 + Math.floor(168 * Math.pow(rand(), 1.6)); // condong ke pendaftar baru (tren naik)
    return {
      id: uuid(`user:${slugifyName(spec.name)}`), name: spec.name, email: `${slugifyName(spec.name)}@example.com`,
      password: google ? null : opts.memberPasswordHash,
      googleId: google ? `seed-google-${slugifyName(spec.name)}` : null,
      role: 'MEMBER', avatarUrl: `https://i.pravatar.cc/150?img=${(i * 7) % 70 + 1}`,
      createdAt: new Date(nowMs - days * DAY - Math.floor(rand() * 20) * HOUR),
    };
  });
  ds.users.push(...members);

  // ---- Penampung & helper pembuat baris relasional ----
  const usedTrx = new Set<string>();
  const trxNumber = (d: Date) => {
    for (;;) {
      const n = `TRX-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(Math.floor(rand() * 1e6), 6)}`;
      if (!usedTrx.has(n)) { usedTrx.add(n); return n; }
    }
  };
  const addTransaction = (user: UserRow, course: CourseRow, status: TransactionRow['status'], createdAt: Date, paidAt: Date | null) => {
    const number = trxNumber(createdAt);
    // id stabil (user+course+urutan), bukan turunan tanggal -> seed ulang tidak menggandakan transaksi
    const nth = ds.transactions.filter((t) => t.userId === user.id && t.courseId === course.id).length + 1;
    ds.transactions.push({
      id: uuid(`trx:${user.id}:${course.id}:${nth}`), transactionNumber: number, userId: user.id, courseId: course.id,
      amount: course.price, status, midtransOrderId: number, paidAt, createdAt,
    });
  };

  interface EnrollInfo { user: UserRow; ctx: CourseCtx; enrolledAt: Date; k: number; lastActivity: Date }
  const enrollInfos: EnrollInfo[] = [];

  /** Satu-satunya jalur membuat enrollment (+ transaksi sukses bila berbayar + LessonProgress). */
  const enroll = (user: UserRow, ctx: CourseCtx, enrolledAt: Date, completedAt: Date[]) => {
    const L = ctx.lessons.length;
    const k = Math.min(completedAt.length, L);
    if (!ctx.row.isFree) {
      addTransaction(user, ctx.row, 'success', new Date(enrolledAt.getTime() - (3 + Math.floor(rand() * 10)) * MIN), enrolledAt);
    }
    ds.enrollments.push({
      id: uuid(`enrollment:${user.id}:${ctx.row.id}`), userId: user.id, courseId: ctx.row.id,
      progress: L === 0 ? 0 : Math.round((k / L) * 100), enrolledAt,
    });
    for (let j = 0; j < k; j++) {
      ds.lessonProgress.push({ id: uuid(`progress:${user.id}:${ctx.lessons[j].id}`), userId: user.id, lessonId: ctx.lessons[j].id, completedAt: completedAt[j] });
    }
    enrollInfos.push({ user, ctx, enrolledAt, k, lastActivity: k > 0 ? completedAt[k - 1] : enrolledAt });
  };

  const addAttempt = (user: UserRow, ctx: CourseCtx, score: number, at: Date) => {
    const nth = ds.quizAttempts.filter((a) => a.userId === user.id && a.quizId === ctx.quiz.id).length + 1;
    ds.quizAttempts.push({
      id: uuid(`attempt:${user.id}:${ctx.quiz.id}:${nth}`), userId: user.id, quizId: ctx.quiz.id,
      score, passed: score >= ctx.quiz.passingGrade, attemptedAt: at,
    });
  };
  const certificatePending: { user: UserRow; ctx: CourseCtx; issuedAt: Date }[] = [];
  const queueCertificate = (user: UserRow, ctx: CourseCtx, issuedAt: Date) => certificatePending.push({ user, ctx, issuedAt });

  // ============================================================================================
  // 1) Akun demo utama: Dimas Pratama — skenario ditulis manual (mengikuti persona di UI)
  // ============================================================================================
  const dimas = members[0];
  {
    // Grammar Dasar (gratis): tuntas, gagal kuis sekali lalu lulus -> sertifikat
    const g = ctxOf('grammar-dasar-untuk-pemula');
    const gEnrolled = daysAgo(66);
    const gTimes = [65, 63, 60, 58].map((d) => daysAgo(d));
    enroll(dimas, g, gEnrolled, gTimes);
    addAttempt(dimas, g, 60, daysAgo(56));
    addAttempt(dimas, g, 80, daysAgo(55));
    queueCertificate(dimas, g, daysAgo(55));

    // TOEFL ITP (berbayar): 2 dari 4 lesson, aktif bulan ini
    const t = ctxOf('persiapan-toefl-itp');
    const tEnrolled = daysAgo(18);
    enroll(dimas, t, tEnrolled, [clampTime(thisMonth(0.3).getTime(), tEnrolled.getTime() + 10 * MIN, nowMs - 5 * MIN), clampTime(thisMonth(0.85).getTime(), tEnrolled.getTime() + 20 * MIN, nowMs - 5 * MIN)]);

    // Speaking (berbayar): 2 dari 3 lesson
    const s = ctxOf('speaking-percaya-diri');
    const sEnrolled = daysAgo(28);
    enroll(dimas, s, sEnrolled, [daysAgo(24), clampTime(thisMonth(0.55).getTime(), sEnrolled.getTime() + 20 * MIN, nowMs - 5 * MIN)]);

    // Conversation Traveling (gratis): baru daftar, belum mulai
    enroll(dimas, ctxOf('english-conversation-traveling'), daysAgo(16), []);

    // IELTS: checkout dibuat beberapa jam lalu, belum dibayar (status pending)
    addTransaction(dimas, ctxOf('persiapan-ielts-academic').row, 'pending', new Date(nowMs - 3 * HOUR), null);
  }

  // ============================================================================================
  // 2) Member lain: enrollment, progres, kuis, sertifikat — dibangkitkan dengan aturan yang sama
  // ============================================================================================
  const allCtx = COURSES.map((c) => ctxOf(c.slug));
  const weights = COURSES.map((c) => c.popularity);

  for (const user of members.slice(1)) {
    const count = pickWeighted([1, 2, 3, 4, 5], [25, 30, 25, 12, 8]);
    for (const ctx of weighted(allCtx, weights, count)) {
      const earliest = Math.max(user.createdAt.getTime(), ctx.row.createdAt.getTime() + DAY);
      const room = nowMs - 2 * HOUR - earliest;
      if (room <= HOUR) continue;
      // +1 jam: transaksi dibuat beberapa menit sebelum enrollment dan tak boleh mendahului akun/course
      const enrolledAt = new Date(earliest + HOUR + rand() * Math.min(25 * DAY, room - HOUR));

      const L = ctx.lessons.length;
      const r = rand();
      let k: number;
      let finished = false;
      if (r < 0.3) { k = L; finished = true; }
      else if (r < 0.58) k = L > 2 ? 1 + Math.floor(rand() * (L - 1)) : 1;
      else if (r < 0.8) k = 1;
      else k = 0;

      // Waktu penyelesaian lesson: yang belum tuntas "masih aktif" (aktivitas terakhir dekat sekarang)
      const start = enrolledAt.getTime() + 10 * MIN;
      const hardEnd = nowMs - 5 * MIN;
      const times: Date[] = [];
      if (k > 0 && start < hardEnd) {
        const lastRaw = finished ? enrolledAt.getTime() + (2 + rand() * 26) * DAY : nowMs - (0.1 + rand() * 13) * DAY;
        const last = Math.min(Math.max(lastRaw, start), hardEnd);
        const span = last - start;
        for (let j = 0; j < k; j++) {
          const base = k === 1 ? last : start + span * (j / (k - 1));
          const jitter = k > 1 ? (rand() - 0.5) * 0.3 * (span / (k - 1)) : 0;
          times.push(clampTime(base + jitter, start, last));
        }
        times.sort((a, b) => a.getTime() - b.getTime());
      }
      enroll(user, ctx, enrolledAt, times);

      // Kuis (hanya jika 100%) -> sertifikat bila lulus
      if (finished && times.length === L && rand() < 0.72) {
        let t = times[L - 1].getTime() + (0.05 + rand() * 3) * DAY;
        const outcome = pickWeighted(['pass1', 'fail-pass', 'fail-fail-pass', 'fail'], [65, 20, 7, 8]);
        const plan = outcome === 'pass1' ? [true] : outcome === 'fail-pass' ? [false, true] : outcome === 'fail-fail-pass' ? [false, false, true] : [false];
        for (const pass of plan) {
          if (t > nowMs - MIN) break;
          const score = pass ? pickWeighted([80, 100], [60, 40]) : pickWeighted([20, 40, 60], [20, 40, 40]);
          addAttempt(user, ctx, score, new Date(t));
          if (pass) { queueCertificate(user, ctx, new Date(t)); break; }
          t += (0.1 + rand() * 2) * DAY;
        }
      }
    }
  }

  // ============================================================================================
  // 3) Transaksi non-sukses (menunjukkan seluruh status di halaman admin)
  // ============================================================================================
  {
    const enrolledPairs = new Set(ds.enrollments.map((e) => `${e.userId}:${e.courseId}`));
    const pendingPairs = new Set(ds.transactions.filter((t) => t.status === 'pending').map((t) => `${t.userId}:${t.courseId}`));
    const paid = allCtx.filter((c) => !c.row.isFree);
    const plan: { status: TransactionRow['status']; count: number }[] = [
      { status: 'pending', count: 3 }, { status: 'expired', count: 5 }, { status: 'failed', count: 3 },
    ];
    for (const { status, count } of plan) {
      let made = 0;
      let guard = 0;
      while (made < count && guard++ < 400) {
        const user = members[1 + Math.floor(rand() * (members.length - 1))];
        const ctx = paid[Math.floor(rand() * paid.length)];
        const key = `${user.id}:${ctx.row.id}`;
        if (enrolledPairs.has(key) || pendingPairs.has(key)) continue;
        const minMs = Math.max(user.createdAt.getTime(), ctx.row.createdAt.getTime()) + DAY;
        // pending hanya yang baru (kedaluwarsa Midtrans 24 jam); expired/failed lebih lama
        const ageMs = status === 'pending' ? (1 + rand() * 19) * HOUR : (2 + rand() * 50) * DAY;
        const createdAt = new Date(Math.min(Math.max(nowMs - ageMs, minMs), nowMs - HOUR));
        if (status === 'pending' && nowMs - createdAt.getTime() > 20 * HOUR) continue;
        pendingPairs.add(key);
        addTransaction(user, ctx.row, status, createdAt, null);
        made++;
      }
    }
  }

  // ============================================================================================
  // 4) Sertifikat — nomor berurut per tahun (CERT-YYYY-XXXXX) sesuai urutan terbit
  // ============================================================================================
  {
    const seqByYear = new Map<number, number>();
    certificatePending.sort((a, b) => a.issuedAt.getTime() - b.issuedAt.getTime());
    for (const c of certificatePending) {
      const y = c.issuedAt.getFullYear();
      const seq = (seqByYear.get(y) ?? 0) + 1;
      seqByYear.set(y, seq);
      ds.certificates.push({
        id: uuid(`certificate:${c.user.id}:${c.ctx.row.id}`), certNumber: `CERT-${y}-${pad(seq, 5)}`,
        userId: c.user.id, courseId: c.ctx.row.id, fileUrl: null, issuedAt: c.issuedAt,
      });
    }
  }

  // ============================================================================================
  // 5) Review (hanya dari member yang ter-enroll) + hitung ulang rating course
  // ============================================================================================
  {
    const ratingChoices = [5, 4, 3, 2, 1];
    const ratingWeights = [55, 30, 10, 3, 2];
    // Dimas: review manual untuk TOEFL (sesuai persona UI)
    const dimasToefl = enrollInfos.find((e) => e.user.id === dimas.id && e.ctx.seed.slug === 'persiapan-toefl-itp');
    if (dimasToefl) {
      ds.reviews.push({
        id: uuid(`review:${dimas.id}:${dimasToefl.ctx.row.id}`), userId: dimas.id, courseId: dimasToefl.ctx.row.id, rating: 5,
        comment: 'Pembahasan strategi Reading-nya sangat membantu, skor latihan saya naik 60 poin.', isHidden: false,
        createdAt: clampTime(thisMonth(0.9).getTime(), dimasToefl.enrolledAt.getTime() + HOUR, nowMs - MIN),
      });
    }
    for (const e of enrollInfos) {
      if (e.user.id === dimas.id) continue;
      const progress = ds.enrollments.find((x) => x.userId === e.user.id && x.courseId === e.ctx.row.id)!.progress;
      const p = progress === 100 ? 0.7 : progress >= 50 ? 0.35 : progress > 0 ? 0.08 : 0;
      if (rand() >= p) continue;
      const at = e.lastActivity.getTime() + (0.05 + rand() * 4) * DAY;
      if (at > nowMs - MIN) continue;
      const rating = pickWeighted(ratingChoices, ratingWeights);
      let comment: string | null = null;
      if (rand() < 0.85) {
        const pool = rating === 5 && rand() < 0.7 ? e.ctx.seed.praise : REVIEW_BY_RATING[rating];
        comment = pool[Math.floor(rand() * pool.length)];
      }
      ds.reviews.push({ id: uuid(`review:${e.user.id}:${e.ctx.row.id}`), userId: e.user.id, courseId: e.ctx.row.id, rating, comment, isHidden: false, createdAt: new Date(at) });
    }
    // Dua review spam yang sudah dimoderasi admin (isHidden) — agar fitur moderasi punya data nyata
    const spamTargets = ds.reviews.filter((r) => r.userId !== dimas.id).slice(5, 40).filter((_, i) => i === 2 || i === 14);
    for (const r of spamTargets) { r.rating = 5; r.comment = SPAM_COMMENT; r.isHidden = true; }

    for (const row of ds.courses) {
      const visible = ds.reviews.filter((r) => r.courseId === row.id && !r.isHidden);
      row.reviewCount = visible.length;
      row.avgRating = visible.length ? Math.round((visible.reduce((s, r) => s + r.rating, 0) / visible.length) * 100) / 100 : 0;
    }
  }

  // ============================================================================================
  // 6) Roadmap
  // ============================================================================================
  for (const rm of ROADMAPS) {
    const row: RoadmapRow = {
      id: uuid(`roadmap:${rm.slug}`), title: rm.title, slug: rm.slug, description: rm.description,
      thumbnailUrl: `https://picsum.photos/seed/roadmap-${rm.slug}/800/450`, published: true, createdAt: daysAgo(rm.daysAgo),
    };
    ds.roadmaps.push(row);
    rm.courseSlugs.forEach((slug, i) =>
      ds.roadmapCourses.push({ id: uuid(`roadmap-course:${rm.slug}:${i + 1}`), roadmapId: row.id, courseId: ctxOf(slug).row.id, order: i + 1 }),
    );
  }

  // ---- Meta ----
  ds.meta.leaderboardThisMonth = new Set(ds.lessonProgress.filter((p) => p.completedAt.getTime() >= monthStartMs).map((p) => p.userId)).size;
  return ds;
}
