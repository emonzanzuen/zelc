// Tipe-tipe ini mengikuti persis nama kolom di ERD (§15 PRD) dan kontrak API (§29 PRD)
// supaya tinggal disambungkan ke backend Express + Prisma tanpa perlu mengubah field.

export type Role = "MEMBER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export type CourseLevel = "Pemula" | "Menengah" | "Mahir";

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  price: number;
  isFree: boolean;
  level: CourseLevel;
  published: boolean;
  categoryId: string;
  categoryName: string;
  avgRating: number;
  reviewCount: number;
  enrollmentCount: number;
  lessons: Lesson[];
  hasQuiz: boolean;
  isEnrolled?: boolean;
  createdAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  youtubeUrl: string;
  durationMinutes: number;
  order: number;
  isPreview: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  enrolledAt: string;
}

export type TransactionStatus = "pending" | "success" | "failed" | "expired";

export interface Transaction {
  id: string;
  transactionNumber: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  status: TransactionStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  options: string[];
  correctOption?: string; // tidak pernah dikirim ke client saat mengerjakan quiz
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passingGrade: number;
  questions: Question[];
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
}

export interface Certificate {
  id: string;
  certNumber: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  fileUrl?: string;
  issuedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  rating: number;
  comment: string;
  isHidden: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  totalLessonsCompleted: number;
  totalMinutesLearned: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  quote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Roadmap: jalur belajar yang menggabungkan beberapa Course berurutan menjadi satu alur
// bertahap dengan progres gabungan (fitur baru — lihat §4, §8 FR-39..FR-41, §15 PRD v3.1).
export interface RoadmapCourseItem {
  order: number;
  course: Course;
}

export interface Roadmap {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  published: boolean;
  courses: RoadmapCourseItem[];
  createdAt: string;
}

// Shape RINGKAS untuk listing (GET /roadmaps, lihat §29.10 PRD) — sengaja TANPA array
// `courses` penuh, hanya `courseCount`, supaya payload list tetap ringan. Halaman detail
// (GET /roadmaps/:slug) baru mengembalikan `Roadmap` lengkap di atas. Dipisah jadi tipe
// sendiri (bukan `Omit<Roadmap, ...>` dipakai langsung) supaya kalau salah satu field
// dibaca di komponen yang salah (mis. `.courses` di halaman list), TypeScript yang
// menangkap duluan saat compile — bukan error runtime "Cannot read properties of undefined".
export interface RoadmapSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  published: boolean;
  courseCount: number;
  createdAt: string;
}

// Satu sumber kebenaran untuk opsi sort katalog kelas — dipakai bareng oleh
// CourseFilters (src/lib/api.ts) dan FilterState (CourseFilterBar.tsx) supaya
// keduanya tidak bisa saling tidak sinkron seperti yang sempat terjadi.
export type CourseSortOption = "terbaru" | "populer" | "harga-rendah" | "harga-tinggi" | "";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
