import { useState, type FormEvent } from "react";
import { ShieldCheck, ShieldX, Search, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { verifyCertificate } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type Result =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "valid"; name: string; courseTitle: string; issuedAt: string }
  | { status: "invalid" };

export default function VerifyCertificatePage() {
  const [certNumber, setCertNumber] = useState("");
  const [result, setResult] = useState<Result>({ status: "idle" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!certNumber.trim()) return;
    setResult({ status: "loading" });
    const data = await verifyCertificate(certNumber.trim().toUpperCase());
    if (data.valid) {
      setResult({ status: "valid", name: data.name, courseTitle: data.courseTitle, issuedAt: data.issuedAt });
    } else {
      setResult({ status: "invalid" });
    }
  }

  return (
    <Layout>
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500/10">
          <Award size={26} className="text-primary-600" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">Verifikasi Sertifikat</h1>
        <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">
          Masukkan nomor sertifikat untuk memastikan keasliannya, mis. CERT-2026-00042.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-md gap-2">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="CERT-2026-00042"
              className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm uppercase focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-darkcard dark:text-gray-200"
            />
          </div>
          <Button type="submit" isLoading={result.status === "loading"}>Cek</Button>
        </form>

        {result.status === "valid" && (
          <div className="mt-8 w-full max-w-md rounded-xl border border-green-200 bg-green-50 p-6 text-left dark:border-green-500/20 dark:bg-green-500/10">
            <div className="flex items-center gap-2 text-success">
              <ShieldCheck size={20} />
              <p className="font-heading font-semibold">Sertifikat ini valid</p>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Nama</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{result.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Kelas</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{result.courseTitle}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 dark:text-gray-400">Tanggal Terbit</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{formatDate(result.issuedAt)}</dd>
              </div>
            </dl>
          </div>
        )}

        {result.status === "invalid" && (
          <div className="mt-8 flex w-full max-w-md items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-5 text-left text-danger dark:border-red-500/20 dark:bg-red-500/10">
            <ShieldX size={20} className="shrink-0" />
            <p className="text-sm font-medium">Nomor sertifikat tidak ditemukan.</p>
          </div>
        )}

        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">Contoh nomor untuk dicoba: CERT-2026-00042</p>
      </div>
    </Layout>
  );
}
