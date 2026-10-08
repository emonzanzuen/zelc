// API layer follows the PRD contract (base path /api/v1, format
// { success, data } / { success, message, errors }, header Authorization: Bearer <token>).
//
// Selama backend Express belum tersambung, setiap fungsi di sini jatuh ke data dummy
// (lihat mockData.ts) memakai delay buatan supaya UI loading state terasa nyata.
// Set VITE_USE_MOCK=false in .env when the backend is ready and configure VITE_API_BASE_URL.
// Request/response field names follow the PRD contract to avoid extra mapping.
// mapping ulang saat pindah dari mock ke backend asli.

import axios from "axios";
import type {
  Course,
  Category,
  Review,
  LeaderboardEntry,
  Certificate,
  Transaction,
  Quiz,
  User,
  Roadmap,
  RoadmapSummary,
  CourseSortOption,
  CourseLevel
} from "@/types";
import {
  courses as mockCourses,
  categories as mockCategories,
  reviews as mockReviews,
  leaderboard as mockLeaderboard,
  certificates as mockCertificates,
  transactions as mockTransactions,
  platformStats as mockPlatformStats,
  myEnrollments as mockMyEnrollments,
  roadmaps as mockRoadmaps,
  adminMembers as mockAdminMembers,
} from "./mockData";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export const apiClient = axios.create({
  // PERBAIKAN: Port default diubah ke 5000 sesuai setup backend kamu
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("lms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CourseFilters {
  category?: string;
  level?: string;
  isFree?: boolean;
  search?: string;
  sort?: CourseSortOption;
  page?: number;
  limit?: number;
}

export async function fetchCourses(filters: CourseFilters = {}) {
  if (USE_MOCK) {
    await delay();
    let list = [...mockCourses];
    if (filters.category) list = list.filter((c) => c.categoryId === filters.category);
    if (filters.level) list = list.filter((c) => c.level === filters.level);
    if (filters.isFree !== undefined) list = list.filter((c) => c.isFree === filters.isFree);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q));
    }
    switch (filters.sort) {
      case "terbaru":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "populer":
        list.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
      case "harga-rendah":
        list.sort((a, b) => a.price - b.price);
        break;
      case "harga-tinggi":
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const start = (page - 1) * limit;
    const paged = list.slice(start, start + limit);
    return {
      courses: paged,
      pagination: { page, limit, total: list.length, totalPages: Math.max(1, Math.ceil(list.length / limit)) },
    };
  }
  const { data } = await apiClient.get<{ success: true; data: { courses: Course[]; pagination: any } }>(
    "/courses",
    { params: filters }
  );
  return data.data;
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  if (USE_MOCK) {
    await delay();
    return mockCourses.find((c) => c.slug === slug) || null;
  }
  const { data } = await apiClient.get<{ success: true; data: Course }>(`/courses/${slug}`);
  return data.data;
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  if (USE_MOCK) {
    await delay();
    return mockCourses.find((c) => c.id === id) || null;
  }
  const { data } = await apiClient.get<{ success: true; data: Course }>(`/courses/by-id/${id}`);
  return data.data;
}

export async function fetchCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    await delay(150);
    return mockCategories;
  }
  const { data } = await apiClient.get<{ success: true; data: Category[] }>("/categories");
  return data.data;
}

export async function fetchCourseReviews(courseId: string) {
  if (USE_MOCK) {
    await delay();
    const list = mockReviews.filter((r) => r.courseId === courseId && !r.isHidden);
    const avgRating = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
    return { avgRating, reviewCount: list.length, reviews: list };
  }
  const { data } = await apiClient.get(`/courses/${courseId}/reviews`);
  return data.data;
}

export async function submitReview(courseId: string, rating: number, comment: string): Promise<Review> {
  if (USE_MOCK) {
    await delay();
    return {
      id: `r-${Date.now()}`,
      userId: "current-user",
      userName: "Kamu",
      courseId,
      rating,
      comment,
      isHidden: false,
      createdAt: new Date().toISOString(),
    };
  }
  const { data } = await apiClient.post(`/courses/${courseId}/reviews`, { rating, comment });
  return data.data;
}

export async function fetchLeaderboard(month?: string): Promise<LeaderboardEntry[]> {
  if (USE_MOCK) {
    await delay();
    return mockLeaderboard;
  }
  const { data } = await apiClient.get("/leaderboard", { params: { month } });
  return data.data.rankings;
}

export async function verifyCertificate(certNumber: string) {
  if (USE_MOCK) {
    await delay();
    const cert = mockCertificates.find((c) => c.certNumber === certNumber);
    if (!cert) return { valid: false as const };
    return { valid: true as const, name: cert.userName, courseTitle: cert.courseTitle, issuedAt: cert.issuedAt };
  }
  const { data } = await apiClient.get(`/certificates/verify/${certNumber}`);
  return data.data;
}

export async function fetchMyCertificates(): Promise<Certificate[]> {
  if (USE_MOCK) {
    await delay();
    return mockCertificates;
  }
  const { data } = await apiClient.get("/me/certificates");
  return data.data;
}

export interface MyEnrollment {
  courseId: string;
  progress: number;
  enrolledAt: string;
  course: Course;
}

export async function fetchMyEnrollments(): Promise<MyEnrollment[]> {
  if (USE_MOCK) {
    await delay();
    return mockMyEnrollments
      .map((e) => {
        const course = mockCourses.find((c) => c.id === e.courseId);
        return course ? { ...e, course } : null;
      })
      .filter((e): e is MyEnrollment => e !== null);
  }
  const { data } = await apiClient.get("/me/enrollments");
  return data.data.enrollments;
}

export async function fetchMyTransactions(): Promise<Transaction[]> {
  if (USE_MOCK) {
    await delay();
    return mockTransactions;
  }
  const { data } = await apiClient.get("/me/transactions");
  return data.data.transactions;
}

export async function fetchRoadmaps(): Promise<RoadmapSummary[]> {
  if (USE_MOCK) {
    await delay();
    return mockRoadmaps
      .filter((r) => r.published)
      .map(({ courses, ...summary }) => ({ ...summary, courseCount: courses.length }));
  }
  const { data } = await apiClient.get<{ success: true; data: RoadmapSummary[] }>("/roadmaps");
  return data.data;
}

export async function fetchRoadmapBySlug(slug: string): Promise<Roadmap | null> {
  if (USE_MOCK) {
    await delay();
    return mockRoadmaps.find((r) => r.slug === slug) || null;
  }
  const { data } = await apiClient.get<{ success: true; data: Roadmap }>(`/roadmaps/${slug}`);
  return data.data;
}

// Progres gabungan roadmap: rata-rata Enrollment.progress seluruh course anggota.
export async function fetchRoadmapProgress(roadmap: Roadmap): Promise<number> {
  if (USE_MOCK) {
    await delay(150);
    const total = roadmap.courses.reduce((sum, item) => {
      const enrollment = mockMyEnrollments.find((e) => e.courseId === item.course.id);
      return sum + (enrollment ? enrollment.progress : 0);
    }, 0);
    return Math.round(total / roadmap.courses.length);
  }
  const { data } = await apiClient.get(`/me/roadmap-progress/${roadmap.id}`);
  return data.data.progress;
}

export async function fetchAdminStats() {
  if (USE_MOCK) {
    await delay();
    return mockPlatformStats;
  }
  const { data } = await apiClient.get("/admin/stats");
  return data.data;
}

export async function checkoutCourse(courseId: string) {
  if (USE_MOCK) {
    await delay(600);
    const num = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(
      Math.floor(Math.random() * 999999)
    ).padStart(6, "0")}`;
    return { transactionNumber: num, snapToken: "mock-snap-token", redirectUrl: "" };
  }
  const { data } = await apiClient.post("/transactions/checkout", { courseId });
  return data.data;
}

export async function enrollFreeCourse(courseId: string) {
  if (USE_MOCK) {
    await delay(400);
    return { id: `enr-${Date.now()}`, courseId, progress: 0 };
  }
  const { data } = await apiClient.post("/enrollments", { courseId });
  return data.data;
}

export async function fetchQuizForCourse(courseId: string): Promise<Quiz | null> {
  if (USE_MOCK) {
    await delay();
    const course = mockCourses.find((c) => c.id === courseId);
    if (!course || !course.hasQuiz) return null;
    return {
      id: `quiz-${courseId}`,
      courseId,
      title: `Quiz Akhir: ${course.title}`,
      passingGrade: 70,
      questions: [
        {
          id: "q1",
          quizId: `quiz-${courseId}`,
          text: "Choose the correct form: She ___ to school every day.",
          options: ["go", "goes", "going", "gone"],
        },
        {
          id: "q2",
          quizId: `quiz-${courseId}`,
          text: "Which sentence uses Simple Past Tense correctly?",
          options: [
            "I go to the market yesterday.",
            "I went to the market yesterday.",
            "I am going to the market yesterday.",
            "I gone to the market yesterday.",
          ],
        },
        {
          id: "q3",
          quizId: `quiz-${courseId}`,
          text: "Pilih sinonim yang tepat untuk 'happy':",
          options: ["Sad", "Joyful", "Angry", "Tired"],
        },
      ],
    };
  }
  const { data } = await apiClient.get(`/quiz/${courseId}`);
  return data.data;
}

export async function submitQuiz(quizId: string, answers: { questionId: string; selectedOption: string }[]) {
  if (USE_MOCK) {
    await delay(500);
    const score = Math.random() > 0.35 ? 85 : 55;
    const passed = score >= 70;
    return {
      score,
      passed,
      certificate: passed ? { certNumber: `CERT-2026-${Math.floor(Math.random() * 90000 + 10000)}` } : null,
    };
  }
  const { data } = await apiClient.post(`/quiz/${quizId}/submit`, { answers });
  return data.data;
}

export async function markLessonComplete(lessonId: string) {
  if (USE_MOCK) {
    await delay(250);
    return { lessonId, courseProgress: Math.min(100, Math.floor(Math.random() * 40) + 60) };
  }
  const { data } = await apiClient.patch(`/lessons/${lessonId}/complete`);
  return data.data;
}

export async function updateMeProfile(payload: { name: string }): Promise<User> {
  if (USE_MOCK) {
    await delay(350);
    return { id: 'u-1', name: payload.name || 'Dimas Pratama', email: 'dimas@zelc.id', role: 'MEMBER' };
  }
  const { data } = await apiClient.put('/me/profile', payload);
  return data.data;
}

const MOCK_ADMIN_EMAIL = "admin@zelc.id";

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    await delay(500);
    if (!email || !password) throw new Error("Email atau password salah");
    const isAdmin = email.trim().toLowerCase() === MOCK_ADMIN_EMAIL;
    return {
      user: isAdmin
        ? { id: "u-admin", name: "Admin ZELC", email, role: "ADMIN" }
        : { id: "u-1", name: "Dimas Pratama", email, role: "MEMBER" },
      token: "mock-jwt-token",
    };
  }
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data.data;
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    await delay(500);
    return { user: { id: "u-new", name, email, role: "MEMBER" }, token: "mock-jwt-token" };
  }
  const { data } = await apiClient.post("/auth/register", { name, email, password });
  return data.data;
}

export async function loginWithGoogle(credential: string): Promise<{ user: User; token: string }> {
  if (USE_MOCK) {
    await delay(500);
    return {
      user: { id: "u-google", name: "Pengguna Google", email: "user@gmail.com", role: "MEMBER" },
      token: "mock-jwt-token",
    };
  }
  const { data } = await apiClient.post("/auth/google", { credential });
  return data.data;
}

// --- TAMBAHAN BARU: Admin Roadmap CRUD ---

export async function fetchAdminRoadmaps(): Promise<Roadmap[]> {
  if (USE_MOCK) {
    await delay();
    return mockRoadmaps;
  }
  const { data } = await apiClient.get<{ success: true; data: Roadmap[] }>("/admin/roadmaps");
  return data.data;
}

export async function createRoadmap(payload: {
  title: string;
  slug?: string;
  description: string;
  thumbnailUrl?: string | null;
  published: boolean;
  courseIds: string[];
}): Promise<Roadmap> {
  if (USE_MOCK) {
    await delay(400);
    return { 
      ...payload, 
      id: `rm-${Date.now()}`, 
      slug: payload.title.toLowerCase().replace(/\s+/g, "-"), 
      courses: [], 
      createdAt: new Date().toISOString() 
    } as Roadmap;
  }
  const { data } = await apiClient.post<{ success: true; data: Roadmap }>("/admin/roadmaps", payload);
  return data.data;
}

export async function updateRoadmap(id: string, payload: Partial<{
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string | null;
  published: boolean;
  courseIds: string[];
}>): Promise<Roadmap> {
  if (USE_MOCK) {
    await delay(400);
    return { id, ...payload } as Roadmap;
  }
  const { data } = await apiClient.put<{ success: true; data: Roadmap }>(`/admin/roadmaps/${id}`, payload);
  return data.data;
}

export async function deleteRoadmap(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await apiClient.delete(`/admin/roadmaps/${id}`);
}

export async function fetchAdminCourses(): Promise<Course[]> {
  if (USE_MOCK) {
    await delay();
    return mockCourses;
  }
  const { data } = await apiClient.get<{ success: true; data: Course[] }>("/admin/courses");
  return data.data;
}

export async function createCourse(payload: {
  title: string;
  slug?: string;
  description: string;
  thumbnailUrl?: string;
  categoryId: string;
  level: CourseLevel;
  price: number;
  isFree: boolean;
  published: boolean;
  hasQuiz?: boolean;
  enrollmentCount?: number;
  rating?: number;
  reviewCount?: number;
}): Promise<Course> {
  if (USE_MOCK) {
    await delay(400);
    return {
      ...payload,
      id: `c-${Date.now()}`,
      slug: payload.slug || payload.title.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      modules: [],
    } as unknown as Course;
  }
  const { data } = await apiClient.post<{ success: true; data: Course }>("/admin/courses", payload);
  return data.data;
}

export async function updateCourse(
  id: string,
  payload: Partial<{
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string;
    categoryId: string;
    level: CourseLevel;
    price: number;
    isFree: boolean;
    published: boolean;
    hasQuiz: boolean;
    enrollmentCount: number;
    rating: number;
    reviewCount: number;
  }>
): Promise<Course> {
  if (USE_MOCK) {
    await delay(400);
    return { id, ...payload } as Course;
  }
  const { data } = await apiClient.put<{ success: true; data: Course }>(`/admin/courses/${id}`, payload);
  return data.data;
}

export async function deleteCourse(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await apiClient.delete(`/admin/courses/${id}`);
}

export async function fetchAdminCategories(): Promise<Category[]> {
  if (USE_MOCK) {
    await delay();
    return mockCategories;
  }
  const { data } = await apiClient.get<{ success: true; data: Category[] }>("/admin/categories");
  return data.data;
}

export async function createCategory(payload: { name: string; slug?: string }): Promise<Category> {
  if (USE_MOCK) {
    await delay(300);
    return { id: `cat-${Date.now()}`, name: payload.name, slug: payload.slug || payload.name.toLowerCase().replace(/\s+/g, "-"), courseCount: 0 } as Category;
  }
  const { data } = await apiClient.post<{ success: true; data: Category }>("/admin/categories", payload);
  return data.data;
}

export async function updateCategory(id: string, payload: Partial<{ name: string; slug: string }>): Promise<Category> {
  if (USE_MOCK) {
    await delay(300);
    return { id, ...payload } as Category;
  }
  const { data } = await apiClient.put<{ success: true; data: Category }>(`/admin/categories/${id}`, payload);
  return data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(250);
    return;
  }
  await apiClient.delete(`/admin/categories/${id}`);
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  signupMethod: "Email" | "Google";
  coursesJoined: number;
}

export async function fetchAdminMembers(): Promise<AdminMember[]> {
  if (USE_MOCK) {
    await delay();
    return mockAdminMembers;
  }
  const { data } = await apiClient.get<{ success: true; data: Array<User & { createdAt: string; googleId: string | null; _count: { enrollments: number } }> }>("/admin/members");
  return data.data.map((member) => ({ id: member.id, name: member.name, email: member.email, registeredAt: member.createdAt, signupMethod: member.googleId ? "Google" : "Email", coursesJoined: member._count.enrollments }));
}

export async function updateMember(id: string, payload: Partial<{ name: string; role: string }>): Promise<User> {
  if (USE_MOCK) {
    await delay(300);
    return { id, ...payload } as User;
  }
  const { data } = await apiClient.put<{ success: true; data: User }>(`/admin/users/${id}`, payload);
  return data.data;
}

export async function deleteMember(id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(250);
    return;
  }
  await apiClient.delete(`/admin/users/${id}`);
}

export async function fetchAdminTransactions(): Promise<Transaction[]> {
  if (USE_MOCK) {
    await delay();
    return mockTransactions;
  }
  const { data } = await apiClient.get<{ success: true; data: Array<Omit<Transaction, "courseTitle"> & { user: { name: string }; course: { title: string } }> }>("/admin/transactions");
  return data.data.map(({ course, ...transaction }) => ({ ...transaction, courseTitle: course.title }));
}

export async function fetchAdminLessons(courseId: string) {
  if (USE_MOCK) {
    await delay();
    return mockCourses.find((course) => course.id === courseId)?.lessons ?? [];
  }
  const { data } = await apiClient.get<{ success: true; data: import("@/types").Lesson[] }>(`/admin/lessons/course/${courseId}`);
  return data.data;
}

export async function createLesson(payload: Omit<import("@/types").Lesson, "id">) {
  if (USE_MOCK) {
    await delay(300);
    return { ...payload, id: `lesson-${Date.now()}` };
  }
  const { data } = await apiClient.post<{ success: true; data: import("@/types").Lesson }>("/admin/lessons", payload);
  return data.data;
}

export async function updateLesson(id: string, payload: Partial<Omit<import("@/types").Lesson, "id" | "courseId">>) {
  if (USE_MOCK) {
    await delay(300);
    return { id, ...payload };
  }
  const { data } = await apiClient.put<{ success: true; data: import("@/types").Lesson }>(`/admin/lessons/${id}`, payload);
  return data.data;
}

export async function deleteLesson(id: string) {
  if (USE_MOCK) { await delay(200); return; }
  await apiClient.delete(`/admin/lessons/${id}`);
}

export async function fetchAdminQuiz(courseId: string): Promise<Quiz | null> {
  if (USE_MOCK) {
    await delay();
    const course = mockCourses.find((item) => item.id === courseId);
    return course?.hasQuiz ? { id: `quiz-${courseId}`, courseId, title: `Quiz Akhir: ${course.title}`, passingGrade: 70, questions: [] } : null;
  }
  const { data } = await apiClient.get<{ success: true; data: Quiz | null }>(`/admin/quiz/course/${courseId}`);
  return data.data;
}

export async function createAdminQuiz(payload: { courseId: string; title: string; passingGrade: number; questions: Array<{ text: string; options: string[]; correctOption: string }> }) {
  if (USE_MOCK) { await delay(300); return { ...payload, id: `quiz-${Date.now()}` }; }
  const { data } = await apiClient.post<{ success: true; data: Quiz }>("/admin/quiz", payload);
  return data.data;
}

export async function updateAdminQuiz(id: string, payload: { title?: string; passingGrade?: number }) {
  if (USE_MOCK) { await delay(250); return { id, ...payload }; }
  const { data } = await apiClient.put<{ success: true; data: Quiz }>(`/admin/quiz/${id}`, payload);
  return data.data;
}

export async function deleteAdminQuiz(id: string) {
  if (USE_MOCK) { await delay(200); return; }
  await apiClient.delete(`/admin/quiz/${id}`);
}

export async function createAdminQuestion(payload: { quizId: string; text: string; options: string[]; correctOption: string }) {
  if (USE_MOCK) { await delay(250); return { ...payload, id: `question-${Date.now()}` }; }
  const { data } = await apiClient.post("/admin/quiz/questions", payload);
  return data.data;
}

export async function updateAdminQuestion(id: string, payload: { text: string; options: string[]; correctOption: string }) {
  if (USE_MOCK) { await delay(250); return { ...payload, id }; }
  const { data } = await apiClient.put(`/admin/quiz/questions/${id}`, payload);
  return data.data;
}

export async function deleteAdminQuestion(id: string) {
  if (USE_MOCK) { await delay(200); return; }
  await apiClient.delete(`/admin/quiz/questions/${id}`);
}

export async function approveTransaction(id: string): Promise<Transaction> {
  if (USE_MOCK) {
    await delay(400);
    return { id, status: "success" } as Transaction;
  }
  const { data } = await apiClient.patch<{ success: true; data: Transaction }>(`/admin/transactions/${id}/approve`);
  return data.data;
}
