// Data dummy — dipakai selama backend (Express + Prisma, lihat §21 PRD) belum tersambung.
// Struktur field & penamaan sengaja disamakan dengan §15 (ERD) & §29 (API spec) PRD,
// jadi saat backend sudah siap, src/lib/api.ts tinggal diarahkan ke endpoint asli
// tanpa perlu mengubah tipe data atau nama field di seluruh komponen.

import type {
  Category,
  Course,
  Testimonial,
  FaqItem,
  LeaderboardEntry,
  Review,
  Transaction,
  Certificate,
  Roadmap,
} from "@/types";

export const categories: Category[] = [
  { id: "cat-1", name: "Grammar", slug: "grammar" },
  { id: "cat-2", name: "Vocabulary", slug: "vocabulary" },
  { id: "cat-3", name: "Speaking", slug: "speaking" },
  { id: "cat-4", name: "Listening", slug: "listening" },
  { id: "cat-5", name: "Writing", slug: "writing" },
  { id: "cat-6", name: "Persiapan TOEFL", slug: "toefl" },
  { id: "cat-7", name: "Persiapan IELTS", slug: "ielts" },
  { id: "cat-8", name: "Business English", slug: "business-english" },
  { id: "cat-9", name: "English for Beginners", slug: "beginners" },
  { id: "cat-10", name: "English Conversation", slug: "conversation" },
];

const thumb = (seed: string) =>
  `https://picsum.photos/seed/${seed}/640/360`;

export const courses: Course[] = [
  {
    id: "c-1",
    title: "Grammar Dasar untuk Pemula",
    slug: "grammar-dasar-pemula",
    description:
      "Membangun fondasi Grammar dari nol: tenses dasar, struktur kalimat, dan kesalahan umum pemula. Cocok untuk kamu yang baru mulai belajar Bahasa Inggris secara serius.",
    thumbnailUrl: thumb("grammar-dasar"),
    price: 0,
    isFree: true,
    level: "Pemula",
    published: true,
    categoryId: "cat-1",
    categoryName: "Grammar",
    avgRating: 4.8,
    reviewCount: 132,
    enrollmentCount: 2140,
    hasQuiz: true,
    createdAt: "2026-08-01",
    lessons: [
      { id: "l-1-1", courseId: "c-1", title: "Pengenalan Part of Speech", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 12, order: 1, isPreview: true },
      { id: "l-1-2", courseId: "c-1", title: "Simple Present Tense", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 15, order: 2, isPreview: true },
      { id: "l-1-3", courseId: "c-1", title: "Simple Past Tense", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 14, order: 3, isPreview: false },
      { id: "l-1-4", courseId: "c-1", title: "Kesalahan Grammar yang Sering Terjadi", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 18, order: 4, isPreview: false },
    ],
  },
  {
    id: "c-2",
    title: "Persiapan TOEFL ITP",
    slug: "persiapan-toefl-itp",
    description:
      "Strategi lengkap menghadapi TOEFL ITP: Listening Comprehension, Structure & Written Expression, dan Reading Comprehension, lengkap dengan latihan soal ala ujian asli.",
    thumbnailUrl: thumb("toefl-itp"),
    price: 150000,
    isFree: false,
    level: "Menengah",
    published: true,
    categoryId: "cat-6",
    categoryName: "Persiapan TOEFL",
    avgRating: 4.7,
    reviewCount: 89,
    enrollmentCount: 940,
    hasQuiz: true,
    createdAt: "2026-07-20",
    lessons: [
      { id: "l-2-1", courseId: "c-2", title: "Pengenalan Structure & Written Expression", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 15, order: 1, isPreview: true },
      { id: "l-2-2", courseId: "c-2", title: "Listening Comprehension: Short Conversations", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 20, order: 2, isPreview: false },
      { id: "l-2-3", courseId: "c-2", title: "Reading Comprehension: Skimming & Scanning", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 22, order: 3, isPreview: false },
      { id: "l-2-4", courseId: "c-2", title: "Simulasi Soal & Pembahasan", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 30, order: 4, isPreview: false },
    ],
  },
  {
    id: "c-3",
    title: "Speaking Percaya Diri untuk Kerja",
    slug: "speaking-percaya-diri-kerja",
    description:
      "Latihan Speaking praktis untuk kebutuhan wawancara kerja dan komunikasi profesional sehari-hari, dengan contoh dialog nyata di tempat kerja.",
    thumbnailUrl: thumb("speaking-kerja"),
    price: 129000,
    isFree: false,
    level: "Menengah",
    published: true,
    categoryId: "cat-3",
    categoryName: "Speaking",
    avgRating: 4.9,
    reviewCount: 201,
    enrollmentCount: 1560,
    hasQuiz: true,
    createdAt: "2026-06-15",
    lessons: [
      { id: "l-3-1", courseId: "c-3", title: "Self Introduction yang Meyakinkan", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 10, order: 1, isPreview: true },
      { id: "l-3-2", courseId: "c-3", title: "Menjawab Pertanyaan Interview Umum", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 18, order: 2, isPreview: false },
      { id: "l-3-3", courseId: "c-3", title: "Small Talk di Kantor", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 12, order: 3, isPreview: false },
    ],
  },
  {
    id: "c-4",
    title: "Business English Essentials",
    slug: "business-english-essentials",
    description:
      "Kuasai email profesional, presentasi, dan negosiasi dalam Bahasa Inggris untuk lingkungan kerja korporat.",
    thumbnailUrl: thumb("business-english"),
    price: 199000,
    isFree: false,
    level: "Mahir",
    published: true,
    categoryId: "cat-8",
    categoryName: "Business English",
    avgRating: 4.6,
    reviewCount: 54,
    enrollmentCount: 410,
    hasQuiz: true,
    createdAt: "2026-08-10",
    lessons: [
      { id: "l-4-1", courseId: "c-4", title: "Menulis Email Bisnis yang Efektif", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 16, order: 1, isPreview: true },
      { id: "l-4-2", courseId: "c-4", title: "Bahasa untuk Presentasi", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 20, order: 2, isPreview: false },
      { id: "l-4-3", courseId: "c-4", title: "Frasa Negosiasi Profesional", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 17, order: 3, isPreview: false },
    ],
  },
  {
    id: "c-5",
    title: "Vocabulary Booster: 1000 Kata Penting",
    slug: "vocabulary-booster-1000-kata",
    description:
      "Perluas kosakata secara sistematis dengan tema sehari-hari, akademik, dan pekerjaan — lengkap dengan cara pengucapan.",
    thumbnailUrl: thumb("vocabulary-booster"),
    price: 0,
    isFree: true,
    level: "Pemula",
    published: true,
    categoryId: "cat-2",
    categoryName: "Vocabulary",
    avgRating: 4.5,
    reviewCount: 176,
    enrollmentCount: 3020,
    hasQuiz: true,
    createdAt: "2026-05-02",
    lessons: [
      { id: "l-5-1", courseId: "c-5", title: "Kosakata Kehidupan Sehari-hari", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 14, order: 1, isPreview: true },
      { id: "l-5-2", courseId: "c-5", title: "Kosakata Akademik", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 16, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-6",
    title: "Listening Skill: Native Speed",
    slug: "listening-skill-native-speed",
    description:
      "Latih telinga memahami Bahasa Inggris dengan kecepatan native speaker lewat podcast, berita, dan percakapan sehari-hari.",
    thumbnailUrl: thumb("listening-native"),
    price: 99000,
    isFree: false,
    level: "Menengah",
    published: true,
    categoryId: "cat-4",
    categoryName: "Listening",
    avgRating: 4.4,
    reviewCount: 63,
    enrollmentCount: 780,
    hasQuiz: true,
    createdAt: "2026-07-05",
    lessons: [
      { id: "l-6-1", courseId: "c-6", title: "Memahami Percakapan Kasual", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 15, order: 1, isPreview: true },
      { id: "l-6-2", courseId: "c-6", title: "Mendengarkan Berita Berbahasa Inggris", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 20, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-7",
    title: "Writing Academic Essay",
    slug: "writing-academic-essay",
    description:
      "Pelajari struktur esai akademik Bahasa Inggris: thesis statement, paragraf argumentasi, hingga kesimpulan yang kuat.",
    thumbnailUrl: thumb("writing-essay"),
    price: 139000,
    isFree: false,
    level: "Mahir",
    published: true,
    categoryId: "cat-5",
    categoryName: "Writing",
    avgRating: 4.6,
    reviewCount: 41,
    enrollmentCount: 350,
    hasQuiz: true,
    createdAt: "2026-08-18",
    lessons: [
      { id: "l-7-1", courseId: "c-7", title: "Struktur Esai 5 Paragraf", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 18, order: 1, isPreview: true },
      { id: "l-7-2", courseId: "c-7", title: "Menulis Thesis Statement", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 14, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-8",
    title: "Persiapan IELTS Academic",
    slug: "persiapan-ielts-academic",
    description:
      "Strategi lengkap 4 modul IELTS Academic: Listening, Reading, Writing, dan Speaking, dengan target band score 6.5+.",
    thumbnailUrl: thumb("ielts-academic"),
    price: 179000,
    isFree: false,
    level: "Mahir",
    published: true,
    categoryId: "cat-7",
    categoryName: "Persiapan IELTS",
    avgRating: 4.8,
    reviewCount: 97,
    enrollmentCount: 620,
    hasQuiz: true,
    createdAt: "2026-06-28",
    lessons: [
      { id: "l-8-1", courseId: "c-8", title: "Overview Format Ujian IELTS", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 12, order: 1, isPreview: true },
      { id: "l-8-2", courseId: "c-8", title: "Strategi Reading Passage", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 22, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-9",
    title: "English Conversation untuk Traveling",
    slug: "english-conversation-traveling",
    description:
      "Frasa dan dialog praktis untuk bandara, hotel, restoran, dan situasi darurat saat bepergian ke luar negeri.",
    thumbnailUrl: thumb("conversation-travel"),
    price: 0,
    isFree: true,
    level: "Pemula",
    published: true,
    categoryId: "cat-10",
    categoryName: "English Conversation",
    avgRating: 4.7,
    reviewCount: 158,
    enrollmentCount: 2450,
    hasQuiz: true,
    createdAt: "2026-05-22",
    lessons: [
      { id: "l-9-1", courseId: "c-9", title: "Percakapan di Bandara", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 10, order: 1, isPreview: true },
      { id: "l-9-2", courseId: "c-9", title: "Check-in di Hotel", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 11, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-10",
    title: "English for Beginners: Start From Zero",
    slug: "english-for-beginners-start-from-zero",
    description:
      "Titik awal yang tepat bila kamu benar-benar baru mulai: alfabet, angka, salam, dan kalimat pertama dalam Bahasa Inggris.",
    thumbnailUrl: thumb("beginners-zero"),
    price: 0,
    isFree: true,
    level: "Pemula",
    published: true,
    categoryId: "cat-9",
    categoryName: "English for Beginners",
    avgRating: 4.9,
    reviewCount: 310,
    enrollmentCount: 4210,
    hasQuiz: true,
    createdAt: "2026-04-11",
    lessons: [
      { id: "l-10-1", courseId: "c-10", title: "Alfabet & Pengucapan Dasar", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 9, order: 1, isPreview: true },
      { id: "l-10-2", courseId: "c-10", title: "Salam & Perkenalan Diri", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 11, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-11",
    title: "Grammar Lanjutan: Conditional & Passive Voice",
    slug: "grammar-lanjutan-conditional-passive",
    description:
      "Untuk kamu yang sudah paham dasar dan ingin naik level: conditional sentences, passive voice, dan reported speech.",
    thumbnailUrl: thumb("grammar-lanjutan"),
    price: 119000,
    isFree: false,
    level: "Mahir",
    published: true,
    categoryId: "cat-1",
    categoryName: "Grammar",
    avgRating: 4.5,
    reviewCount: 47,
    enrollmentCount: 390,
    hasQuiz: true,
    createdAt: "2026-08-25",
    lessons: [
      { id: "l-11-1", courseId: "c-11", title: "Conditional Sentences Type 1-3", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 20, order: 1, isPreview: true },
      { id: "l-11-2", courseId: "c-11", title: "Passive Voice dalam Konteks Formal", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 17, order: 2, isPreview: false },
    ],
  },
  {
    id: "c-12",
    title: "Business English: Meeting & Presentation",
    slug: "business-english-meeting-presentation",
    description:
      "Fokus khusus memimpin rapat dan menyampaikan presentasi dalam Bahasa Inggris dengan percaya diri.",
    thumbnailUrl: thumb("business-meeting"),
    price: 159000,
    isFree: false,
    level: "Menengah",
    published: true,
    categoryId: "cat-8",
    categoryName: "Business English",
    avgRating: 4.6,
    reviewCount: 38,
    enrollmentCount: 290,
    hasQuiz: true,
    createdAt: "2026-09-01",
    lessons: [
      { id: "l-12-1", courseId: "c-12", title: "Membuka & Memimpin Rapat", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 14, order: 1, isPreview: true },
      { id: "l-12-2", courseId: "c-12", title: "Menyampaikan Data dalam Presentasi", youtubeUrl: "dQw4w9WgXcQ", durationMinutes: 19, order: 2, isPreview: false },
    ],
  },
];

// Roadmap — jalur belajar lintas-kelas (fitur baru, lihat §15 PRD v3.1 untuk ERD
// Roadmap & RoadmapCourse). Setiap roadmap menggabungkan beberapa course yang sudah ada,
// berurutan, dengan progres gabungan dihitung dari Enrollment.progress tiap course anggota.
function findCourse(id: string) {
  const c = courses.find((x) => x.id === id);
  if (!c) throw new Error(`Course ${id} tidak ditemukan untuk roadmap`);
  return c;
}

export const roadmaps: Roadmap[] = [
  {
    id: "rm-1",
    title: "Jalur Siap TOEFL",
    slug: "jalur-siap-toefl",
    description:
      "Mulai dari fondasi Grammar, perkuat dengan Grammar lanjutan, lalu tuntas dengan strategi dan simulasi TOEFL ITP. Cocok untuk kamu yang punya target skor TOEFL dalam waktu dekat.",
    thumbnailUrl: "https://picsum.photos/seed/roadmap-toefl/800/450",
    published: true,
    createdAt: "2026-08-01",
    courses: [
      { order: 1, course: findCourse("c-1") },
      { order: 2, course: findCourse("c-11") },
      { order: 3, course: findCourse("c-2") },
    ],
  },
  {
    id: "rm-2",
    title: "Jalur Siap IELTS Academic",
    slug: "jalur-siap-ielts",
    description:
      "Bangun kosakata akademik, kuatkan kemampuan menulis esai, lalu kuasai strategi 4 modul IELTS Academic untuk target band score 6.5+.",
    thumbnailUrl: "https://picsum.photos/seed/roadmap-ielts/800/450",
    published: true,
    createdAt: "2026-08-10",
    courses: [
      { order: 1, course: findCourse("c-5") },
      { order: 2, course: findCourse("c-7") },
      { order: 3, course: findCourse("c-8") },
    ],
  },
  {
    id: "rm-3",
    title: "Jalur Karier: Business English",
    slug: "jalur-karier-business-english",
    description:
      "Dari fondasi Grammar, latihan Speaking untuk wawancara kerja, sampai Business English penuh untuk email, presentasi, dan rapat profesional.",
    thumbnailUrl: "https://picsum.photos/seed/roadmap-business/800/450",
    published: true,
    createdAt: "2026-09-01",
    courses: [
      { order: 1, course: findCourse("c-1") },
      { order: 2, course: findCourse("c-3") },
      { order: 3, course: findCourse("c-4") },
      { order: 4, course: findCourse("c-12") },
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Dimas Pratama",
    role: "Fresh Graduate, persiapan beasiswa",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    quote:
      "Materinya runtut banget, dari Grammar dasar sampai simulasi TOEFL. Skor latihan saya naik signifikan dalam 2 bulan.",
  },
  {
    id: "t-2",
    name: "Rani Kusuma",
    role: "Staff Marketing",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    quote:
      "Kelas Business English-nya langsung kepakai untuk kerja. Email dan presentasi ke klien asing jadi lebih percaya diri.",
  },
  {
    id: "t-3",
    name: "Fajar Nugroho",
    role: "Mahasiswa Semester Akhir",
    avatarUrl: "https://i.pravatar.cc/150?img=51",
    quote:
      "Suka fitur leaderboard-nya, jadi termotivasi belajar tiap hari biar nggak turun peringkat. Sertifikatnya juga rapi.",
  },
  {
    id: "t-4",
    name: "Sinta Wulandari",
    role: "Guru SMA",
    avatarUrl: "https://i.pravatar.cc/150?img=45",
    quote:
      "Harga jauh lebih terjangkau dibanding kursus offline, dan bisa diakses kapan saja sesuai waktu luang saya.",
  },
];

export const faqs: FaqItem[] = [
  {
    question: "Apakah semua kelas berbayar?",
    answer:
      "Tidak. Sebagian kelas tersedia gratis penuh, sebagian lagi berbayar dengan materi lebih lengkap. Setiap kelas berbayar juga punya beberapa lesson preview gratis yang bisa kamu coba dulu.",
  },
  {
    question: "Bagaimana cara mendapatkan sertifikat?",
    answer:
      "Selesaikan seluruh lesson dalam kelas hingga progress 100%, lalu kerjakan quiz akhir. Jika skormu mencapai passing grade, sertifikat akan diterbitkan otomatis dan bisa diunduh dari dashboard.",
  },
  {
    question: "Metode pembayaran apa saja yang didukung?",
    answer:
      "Pembayaran diproses melalui Midtrans Snap yang mendukung transfer bank, kartu kredit/debit, dan e-wallet populer di Indonesia.",
  },
  {
    question: "Apakah sertifikat bisa diverifikasi orang lain?",
    answer:
      "Bisa. Setiap sertifikat punya nomor unik yang dapat dicek siapa saja lewat halaman Verifikasi Sertifikat, tanpa perlu login.",
  },
  {
    question: "Bisakah saya belajar tanpa batas waktu?",
    answer:
      "Ya, setelah enroll (baik gratis maupun berbayar) kamu memiliki akses selamanya ke materi kelas tersebut.",
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "u-1", name: "Dimas P.", avatarUrl: "https://i.pravatar.cc/150?img=12", totalLessonsCompleted: 42, totalMinutesLearned: 630 },
  { rank: 2, userId: "u-2", name: "Rani K.", avatarUrl: "https://i.pravatar.cc/150?img=32", totalLessonsCompleted: 39, totalMinutesLearned: 590 },
  { rank: 3, userId: "u-3", name: "Fajar N.", avatarUrl: "https://i.pravatar.cc/150?img=51", totalLessonsCompleted: 35, totalMinutesLearned: 540 },
  { rank: 4, userId: "u-4", name: "Sinta W.", avatarUrl: "https://i.pravatar.cc/150?img=45", totalLessonsCompleted: 33, totalMinutesLearned: 505 },
  { rank: 5, userId: "u-5", name: "Bagas A.", avatarUrl: "https://i.pravatar.cc/150?img=15", totalLessonsCompleted: 30, totalMinutesLearned: 470 },
  { rank: 6, userId: "u-6", name: "Citra D.", avatarUrl: "https://i.pravatar.cc/150?img=25", totalLessonsCompleted: 28, totalMinutesLearned: 430 },
  { rank: 7, userId: "u-7", name: "Eko S.", avatarUrl: "https://i.pravatar.cc/150?img=60", totalLessonsCompleted: 25, totalMinutesLearned: 390 },
  { rank: 8, userId: "u-8", name: "Nadia R.", avatarUrl: "https://i.pravatar.cc/150?img=47", totalLessonsCompleted: 22, totalMinutesLearned: 355 },
  { rank: 9, userId: "u-9", name: "Yoga P.", avatarUrl: "https://i.pravatar.cc/150?img=33", totalLessonsCompleted: 20, totalMinutesLearned: 310 },
  { rank: 10, userId: "u-10", name: "Melati H.", avatarUrl: "https://i.pravatar.cc/150?img=48", totalLessonsCompleted: 18, totalMinutesLearned: 275 },
];

export const reviews: Review[] = [
  { id: "r-1", userId: "u-1", userName: "Dimas P.", courseId: "c-2", rating: 5, comment: "Pembahasan strategi Reading-nya sangat membantu, skor latihan saya naik 60 poin.", isHidden: false, createdAt: "2026-09-10" },
  { id: "r-2", userId: "u-4", userName: "Sinta W.", courseId: "c-2", rating: 4, comment: "Materinya lengkap, cuma agak padat untuk pemula.", isHidden: false, createdAt: "2026-09-05" },
  { id: "r-3", userId: "u-3", userName: "Fajar N.", courseId: "c-2", rating: 5, comment: "Simulasi soalnya mirip ujian asli, recommended!", isHidden: false, createdAt: "2026-08-29" },
  { id: "r-4", userId: "u-2", userName: "Rani K.", courseId: "c-3", rating: 5, comment: "Setelah kelas ini saya lebih pede interview kerja pakai Bahasa Inggris.", isHidden: false, createdAt: "2026-08-20" },
];

export const transactions: Transaction[] = [
  { id: "tr-1", transactionNumber: "TRX-20260920-000123", userId: "u-1", courseId: "c-2", courseTitle: "Persiapan TOEFL ITP", amount: 150000, status: "success", paidAt: "2026-09-20T10:00:00Z", createdAt: "2026-09-20T09:55:00Z" },
  { id: "tr-2", transactionNumber: "TRX-20260910-000089", userId: "u-1", courseId: "c-3", courseTitle: "Speaking Percaya Diri untuk Kerja", amount: 129000, status: "success", paidAt: "2026-09-10T14:20:00Z", createdAt: "2026-09-10T14:15:00Z" },
  { id: "tr-3", transactionNumber: "TRX-20260901-000045", userId: "u-1", courseId: "c-8", courseTitle: "Persiapan IELTS Academic", amount: 179000, status: "pending", paidAt: null, createdAt: "2026-09-01T08:30:00Z" },
];

export const certificates: Certificate[] = [
  { id: "cert-1", certNumber: "CERT-2026-00042", userId: "u-1", userName: "Dimas Pratama", courseId: "c-1", courseTitle: "Grammar Dasar untuk Pemula", issuedAt: "2026-08-15" },
];

export interface AdminMemberRow {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  signupMethod: "Email" | "Google";
  coursesJoined: number;
}

export const adminMembers: AdminMemberRow[] = [
  { id: "u-1", name: "Dimas Pratama", email: "dimas@mail.com", registeredAt: "2026-06-12", signupMethod: "Email", coursesJoined: 4 },
  { id: "u-2", name: "Rani Kusuma", email: "rani@mail.com", registeredAt: "2026-06-20", signupMethod: "Google", coursesJoined: 2 },
  { id: "u-3", name: "Fajar Nugroho", email: "fajar@mail.com", registeredAt: "2026-07-01", signupMethod: "Email", coursesJoined: 6 },
  { id: "u-4", name: "Sinta Wulandari", email: "sinta@mail.com", registeredAt: "2026-07-15", signupMethod: "Google", coursesJoined: 3 },
  { id: "u-5", name: "Bagas Aditya", email: "bagas@mail.com", registeredAt: "2026-08-02", signupMethod: "Email", coursesJoined: 1 },
  { id: "u-6", name: "Citra Dewi", email: "citra@mail.com", registeredAt: "2026-08-10", signupMethod: "Google", coursesJoined: 2 },
  { id: "u-7", name: "Eko Saputra", email: "eko@mail.com", registeredAt: "2026-08-25", signupMethod: "Email", coursesJoined: 1 },
  { id: "u-8", name: "Nadia Rahma", email: "nadia@mail.com", registeredAt: "2026-09-03", signupMethod: "Google", coursesJoined: 3 },
];

export const myEnrollments: { courseId: string; progress: number; enrolledAt: string }[] = [
  { courseId: "c-1", progress: 100, enrolledAt: "2026-08-01" },
  { courseId: "c-2", progress: 45, enrolledAt: "2026-09-20" },
  { courseId: "c-3", progress: 70, enrolledAt: "2026-09-10" },
  { courseId: "c-9", progress: 0, enrolledAt: "2026-09-22" },
];

export const platformStats = {
  totalRevenue: 45000000,
  totalTransactions: 320,
  totalMembers: 1520,
  totalPublishedCourses: courses.length,
  topCourses: [...courses]
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5)
    .map((c) => ({ title: c.title, enrollmentCount: c.enrollmentCount })),
  monthlyRevenue: [
    { month: "Apr", revenue: 4200000 },
    { month: "Mei", revenue: 5100000 },
    { month: "Jun", revenue: 6300000 },
    { month: "Jul", revenue: 7450000 },
    { month: "Agu", revenue: 8900000 },
    { month: "Sep", revenue: 9300000 },
  ],
};
