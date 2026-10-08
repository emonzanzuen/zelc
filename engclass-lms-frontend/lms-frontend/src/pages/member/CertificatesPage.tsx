import { useEffect, useState } from "react";
import { Download, Award } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { downloadCertificate, fetchMyCertificates } from "@/lib/api";
import type { Certificate } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMyCertificates().then((data) => {
      setCertificates(data);
      setLoading(false);
    });
  }, []);

  async function handleDownload(cert: Certificate) {
    setDownloadingId(cert.id);
    try {
      const blob = await downloadCertificate(cert.id);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `sertifikat-${cert.certNumber}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Gagal mengunduh sertifikat.", "error");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <DashboardShell title="Sertifikat Saya">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5" />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <EmptyState icon={Award} message="Kamu belum memiliki sertifikat. Selesaikan kelas dan lulus quiz untuk mendapatkannya." />
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-surface-darkcard p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Award size={22} />
                </span>
                <div>
                  <p className="font-heading text-sm font-semibold text-gray-900 dark:text-white">{cert.courseTitle}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    No. {cert.certNumber} · Terbit {formatDate(cert.issuedAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => void handleDownload(cert)}
                disabled={downloadingId === cert.id}
                className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <Download size={15} />
                {downloadingId === cert.id ? "Mengunduh..." : "Unduh Sertifikat"}
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
