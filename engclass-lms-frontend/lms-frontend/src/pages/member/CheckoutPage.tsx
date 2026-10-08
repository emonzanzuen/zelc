import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { fetchCourseById, checkoutCourse, fetchMyTransactions, USE_MOCK } from "@/lib/api";
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
  const [paymentError, setPaymentError] = useState("");
  const [polling, setPolling] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [simulatorNotice, setSimulatorNotice] = useState(false);

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
    setPaymentError("");
    try {
      const { transactionNumber, snapToken } = await checkoutCourse(course.id);
      setTrxNumber(transactionNumber);
      if (USE_MOCK) {
        setStage("success");
        showToast("Checkout simulasi berhasil.", "info");
        return;
      }
      if (typeof snapToken !== "string" || !snapToken) throw new Error("Token pembayaran tidak diterima dari server.");
      // Tampilkan panduan sejak token tersedia, bukan hanya menunggu callback onClose
      // yang bisa tidak terpanggil jika popup diblokir atau ditutup oleh browser.
      setSimulatorNotice(true);
      setPolling(true);
      if (!window.snap) throw new Error("Midtrans Snap belum termuat. Muat ulang halaman lalu coba lagi.");

      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          setTrxNumber(result.order_id ?? transactionNumber);
          setStage("success");
          setPolling(true);
          showToast("Pembayaran berhasil. Enrollment sedang dikonfirmasi.");
        },
        onPending: () => {
          setStage("summary");
          setPolling(true);
          showToast("Pembayaran menunggu konfirmasi.", "info");
        },
        onError: (result) => {
          setStage("summary");
          setPaymentError(result.status_message || "Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          setStage((current) => current === "success" ? current : "summary");
          setSimulatorNotice(true);
          setPolling(true);
          showToast("Popup pembayaran ditutup sebelum selesai.", "info");
        },
      });
    } catch (error) {
      setStage("summary");
      setPaymentError(error instanceof Error ? error.message : "Gagal memulai pembayaran.");
    }
  }

  const checkPaymentStatus = useCallback(async (manual = false) => {
    if (!trxNumber) return;
    setCheckingStatus(true);
    try {
      const transactions = await fetchMyTransactions();
      const transaction = transactions.find((item) => item.transactionNumber === trxNumber);
      if (transaction?.status === "success") {
        setPolling(false);
        showToast("Pembayaran terkonfirmasi. Mengarahkan ke transaksi...");
        navigate("/dashboard/transaksi", { replace: true });
      } else if (transaction && ["failed", "expired"].includes(transaction.status)) {
        setPolling(false);
        setStage("summary");
        setPaymentError(`Pembayaran ${transaction.status === "expired" ? "kedaluwarsa" : "gagal"}. Silakan coba lagi.`);
      } else if (manual) {
        showToast("Status pembayaran masih menunggu konfirmasi.", "info");
      }
    } catch (error) {
      if (manual) setPaymentError(error instanceof Error ? error.message : "Gagal memeriksa status pembayaran.");
    } finally {
      setCheckingStatus(false);
    }
  }, [trxNumber, navigate, showToast]);

  useEffect(() => {
    if (!polling || !trxNumber || USE_MOCK) return;
    void checkPaymentStatus();
    const intervalId = window.setInterval(() => void checkPaymentStatus(), 3000);
    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") void checkPaymentStatus();
    };
    window.addEventListener("focus", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
    };
  }, [polling, trxNumber, checkPaymentStatus]);

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
          {simulatorNotice && (
            <p role="status" className="mb-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
              Pembayaran diproses. Silakan buka{" "}
              <a href="https://simulator.sandbox.midtrans.com" target="_blank" rel="noreferrer" className="font-semibold underline">
                Link Simulator
              </a>{" "}
              untuk menyelesaikan transaksi.
            </p>
          )}
          {stage === "success" ? (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <ShieldCheck size={26} className="text-success" />
              </span>
              <h1 className="mt-4 font-heading text-xl font-bold text-gray-900 dark:text-white">Pembayaran Berhasil!</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No. Transaksi: {trxNumber}</p>
              <Button fullWidth className="mt-6" onClick={() => navigate("/dashboard")}>
                Lihat Kelas Saya
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
              {paymentError && <p role="alert" className="mt-3 text-center text-sm text-danger">{paymentError}</p>}
              {trxNumber && !USE_MOCK && (
                <div className="mt-3 text-center">
                  {polling && <p role="status" className="mb-2 text-xs text-gray-500 dark:text-gray-400">Memeriksa status pembayaran...</p>}
                  <Button variant="outline" isLoading={checkingStatus} onClick={() => void checkPaymentStatus(true)}>
                    Cek Status Manual
                  </Button>
                </div>
              )}
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
