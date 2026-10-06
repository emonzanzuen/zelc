import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { fetchCourseById, checkoutCourse } from "@/lib/api";
import type { Course } from "@/types";
import { formatRupiah } from "@/lib/utils";

type Stage = "loading" | "summary" | "processing" | "success" | "failed";

export default function CheckoutPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [trxNumber, setTrxNumber] = useState("");

  useEffect(() => {
    if (!courseId) {
      setStage("failed");
      return;
    }
    // Lewat fetchCourseById() (lib/api.ts), bukan import array mock langsung — supaya
    // checkout memakai data course yang sama (harga, judul) dengan backend sungguhan
    // begitu VITE_USE_MOCK=false, bukan selalu snapshot dummy yang bisa basi.
    fetchCourseById(courseId).then((found) => {
      setCourse(found);
      setStage(found ? "summary" : "failed");
    });
  }, [courseId]);

  async function handlePay() {
    if (!course) return;
    setStage("processing");
    const { transactionNumber } = await checkoutCourse(course.id);
    setTrxNumber(transactionNumber);
    // Simulasi popup Midtrans Snap (§13.1 PRD) yang menunggu webhook mengubah status.
    setTimeout(() => {
      setStage("success");
      showToast("Pembayaran berhasil! Selamat belajar.");
    }, 1800);
  }

  if (stage === "loading") {
    return (
      <Layout hideFooter>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-primary-500" size={28} />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout hideFooter>
        <div className="container-page py-20 text-center">
          <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Kelas tidak ditemukan</h1>
          <Link to="/kelas" className="mt-3 inline-block text-primary-600 hover:underline">Kembali ke katalog</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-6 shadow-sm sm:p-8">
          {stage === "success" ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <ShieldCheck size={26} className="text-success" />
              </span>
              <h1 className="mt-4 font-heading text-xl font-bold text-gray-900 dark:text-white">Pembayaran Berhasil!</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No. Transaksi: {trxNumber}</p>
              <Button fullWidth className="mt-6" onClick={() => navigate(`/dashboard/belajar/${course.id}`)}>
                Mulai Belajar Sekarang
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Ringkasan Pembayaran</h1>
              <div className="mt-5 flex gap-3 border-b border-gray-100 dark:border-gray-800/60 pb-5">
                <img src={course.thumbnailUrl} alt={course.title} className="h-16 w-24 rounded-lg object-cover" />
                <div>
                  <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{course.title}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{course.categoryName} · {course.level}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Harga Kelas</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{formatRupiah(course.price)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/60 pt-3 font-heading text-base font-bold text-gray-900 dark:text-white">
                <span>Total Bayar</span>
                <span>{formatRupiah(course.price)}</span>
              </div>

              <Button fullWidth size="lg" className="mt-6 gap-2" isLoading={stage === "processing"} onClick={handlePay}>
                <CreditCard size={18} />
                {stage === "processing" ? "Memproses Pembayaran..." : "Bayar dengan Midtrans"}
              </Button>
              <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                Pembayaran diproses aman melalui Midtrans Snap (Sandbox).
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
