import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "@/components/routing/ProtectedRoute";
import { Starfield } from "@/components/layout/Starfield";

import LandingPage from "@/pages/public/LandingPage";
import CatalogPage from "@/pages/public/CatalogPage";
import CourseDetailPage from "@/pages/public/CourseDetailPage";
import LeaderboardPage from "@/pages/public/LeaderboardPage";
import RoadmapListPage from "@/pages/public/RoadmapListPage";
import RoadmapDetailPage from "@/pages/public/RoadmapDetailPage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";
import VerifyCertificatePage from "@/pages/public/VerifyCertificatePage";
import NotFoundPage from "@/pages/public/NotFoundPage";

import CheckoutPage from "@/pages/member/CheckoutPage";
import DashboardPage from "@/pages/member/DashboardPage";
import LearningPage from "@/pages/member/LearningPage";
import QuizPage from "@/pages/member/QuizPage";
import CertificatesPage from "@/pages/member/CertificatesPage";
import TransactionsPage from "@/pages/member/TransactionsPage";
import ProfilePage from "@/pages/member/ProfilePage";

import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminCoursesPage from "@/pages/admin/AdminCoursesPage";
import AdminCourseLessonsPage from "@/pages/admin/AdminCourseLessonsPage";
import AdminCourseQuizPage from "@/pages/admin/AdminCourseQuizPage";
import AdminCourseReviewsPage from "@/pages/admin/AdminCourseReviewsPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import AdminRoadmapsPage from "@/pages/admin/AdminRoadmapsPage";
import AdminMembersPage from "@/pages/admin/AdminMembersPage";
import AdminTransactionsPage from "@/pages/admin/AdminTransactionsPage";

export default function App() {
  return (
    <>
      {/* Lapisan bintang ambient global — fixed di viewport, jadi tetap di tempat saat
          scroll dan tidak perlu di-mount ulang per halaman. Kepadatan rendah (density
          kecil) karena ini lapisan "wash" tipis yang hanya kelihatan di sela-sela elemen
          berlatar solid; versi yang lebih jelas ada di dalam Hero landing page. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Starfield density={0.00006} maxStars={90} />
      </div>
      <div className="relative z-[1]">
    <Routes>
      {/* Publik */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/kelas" element={<CatalogPage />} />
      <Route path="/kelas/:slug" element={<CourseDetailPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/roadmap" element={<RoadmapListPage />} />
      <Route path="/roadmap/:slug" element={<RoadmapDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verifikasi-sertifikat" element={<VerifyCertificatePage />} />

      {/* Member — protected */}
      <Route path="/checkout/:courseId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/belajar/:courseId" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />
      <Route path="/dashboard/quiz/:courseId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
      <Route path="/dashboard/sertifikat" element={<ProtectedRoute><CertificatesPage /></ProtectedRoute>} />
      <Route path="/dashboard/transaksi" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Admin — protected, role admin */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/kelas" element={<AdminRoute><AdminCoursesPage /></AdminRoute>} />
      <Route path="/admin/kelas/:courseId/materi" element={<AdminRoute><AdminCourseLessonsPage /></AdminRoute>} />
      <Route path="/admin/kelas/:courseId/quiz" element={<AdminRoute><AdminCourseQuizPage /></AdminRoute>} />
      <Route path="/admin/kelas/:courseId/review" element={<AdminRoute><AdminCourseReviewsPage /></AdminRoute>} />
      <Route path="/admin/kategori" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
      <Route path="/admin/roadmap" element={<AdminRoute><AdminRoadmapsPage /></AdminRoute>} />
      <Route path="/admin/member" element={<AdminRoute><AdminMembersPage /></AdminRoute>} />
      <Route path="/admin/transaksi" element={<AdminRoute><AdminTransactionsPage /></AdminRoute>} />

      <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </div>
    </>
  );
}
