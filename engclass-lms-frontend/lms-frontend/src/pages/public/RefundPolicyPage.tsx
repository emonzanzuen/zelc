import { Link } from "react-router-dom";
import { RotateCcw, CheckCircle2, XCircle, Clock, AlertCircle, ExternalLink, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function RefundPolicyPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-12 dark:border-gray-800 dark:from-surface-darkcard/50 dark:to-surface-dark sm:py-16">
        <div className="container-page max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <RotateCcw size={13} /> Garansi & Kepuasan Belajar
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Kebijakan Pengembalian Dana (Refund Policy)
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Terakhir diperbarui: 11 Oktober 2026 • Ketentuan dan tata cara pengajuan garansi pengembalian dana kelas online di platform ZELC.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-page max-w-4xl py-12 sm:py-16">
        {/* Highlight Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-surface-darkcard">
            <p className="font-heading text-2xl font-black text-primary-600 dark:text-primary-400">7 Hari</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Batas Waktu Garansi</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-surface-darkcard">
            <p className="font-heading text-2xl font-black text-primary-600 dark:text-primary-400">&lt; 20%</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Maks. Progres Belajar</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-surface-darkcard">
            <p className="font-heading text-2xl font-black text-primary-600 dark:text-primary-400">0</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Sertifikat Belum Diklaim</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center dark:border-gray-800 dark:bg-surface-darkcard">
            <p className="font-heading text-2xl font-black text-primary-600 dark:text-primary-400">3-7 Hari</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Estimasi Pencairan</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          {/* Quick TOC Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-2 rounded-xl border border-gray-100 bg-gray-50/70 p-4 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="font-heading font-bold text-gray-900 dark:text-white">Daftar Isi</p>
              <nav className="space-y-1.5 text-gray-500 dark:text-gray-400">
                <a href="#refund-prinsip" className="block hover:text-primary-600 dark:hover:text-primary-400">1. Prinsip Garansi</a>
                <a href="#refund-syarat" className="block hover:text-primary-600 dark:hover:text-primary-400">2. Syarat & Kelayakan</a>
                <a href="#refund-pengecualian" className="block hover:text-primary-600 dark:hover:text-primary-400">3. Pengecualian Refund</a>
                <a href="#refund-prosedur" className="block hover:text-primary-600 dark:hover:text-primary-400">4. Prosedur Pengajuan</a>
                <a href="#refund-metode" className="block hover:text-primary-600 dark:hover:text-primary-400">5. Metode & Biaya</a>
                <a href="#refund-kontak" className="block hover:text-primary-600 dark:hover:text-primary-400">6. Kontak Bantuan</a>
              </nav>

              <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Tautan Terkait:</p>
                <div className="mt-1.5 space-y-1">
                  <Link to="/legal/terms" className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline dark:text-primary-400">
                    Syarat Layanan <ExternalLink size={10} />
                  </Link>
                  <Link to="/legal/privacy" className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline dark:text-primary-400">
                    Kebijakan Privasi <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Refund Content */}
          <article className="space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <section id="refund-prinsip" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                1. Prinsip Garansi Kepuasan Belajar
              </h2>
              <p className="mt-2.5">
                Di Zanzuen English Learning Center (ZELC), kepuasan dan kecocokan metode belajar Anda adalah prioritas kami. Kami memahami bahwa setiap pembelajar memiliki gaya belajar yang unik. Oleh karena itu, kami memberikan jaminan garansi pengembalian dana 100% apabila materi kursus yang Anda beli dirasa tidak sesuai dengan silabus atau ekspektasi belajar Anda, sesuai dengan syarat dan ketentuan yang diatur dalam dokumen ini.
              </p>
            </section>

            <section id="refund-syarat" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                2. Syarat & Kriteria Kelayakan Refund
              </h2>
              <p className="mt-2.5">
                Pengajuan pengembalian dana dapat disetujui apabila memenuhi seluruh kriteria kumulatif berikut:
              </p>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 p-3.5 text-xs text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  <div>
                    <span className="font-bold">Periode Garansi 7 Hari:</span> Pengajuan wajib dikirimkan dalam kurun waktu maksimal 7 (tujuh) hari kalender terhitung sejak tanggal transaksi berhasil (status settlement/paid).
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 p-3.5 text-xs text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  <div>
                    <span className="font-bold">Progres Belajar Di Bawah 20%:</span> Total materi video dan modul yang telah Anda tonton/akses belum melebihi 20% dari keseluruhan durasi kursus terkait.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 p-3.5 text-xs text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  <div>
                    <span className="font-bold">Belum Mengerjakan Kuis Kelulusan:</span> Siswa belum menyelesaikan kuis akhir kelulusan kursus dan belum pernah mengunduh/mengklaim sertifikat resmi kelas terkait.
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50/60 p-3.5 text-xs text-green-900 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success" />
                  <div>
                    <span className="font-bold">Pembelian Melalui Kanal Resmi:</span> Transaksi dilakukan secara langsung di situs web ZELC dengan ID transaksi Midtrans yang terverifikasi.
                  </div>
                </div>
              </div>
            </section>

            <section id="refund-pengecualian" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                3. Kondisi yang TIDAK Memenuhi Syarat Refund
              </h2>
              <p className="mt-2.5">
                Pengembalian dana <strong>tidak dapat diproses</strong> apabila ditemukan kondisi berikut:
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-3 text-xs text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                  <div>Pengajuan dilakukan setelah melewati batas 7 hari kalender sejak pembelian.</div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-3 text-xs text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                  <div>Siswa telah mempelajari lebih dari 20% materi atau telah mengunduh materi dokumen/sertifikat resmi.</div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-3 text-xs text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                  <div>Kelas promosi kilat (flash sale) dengan diskon di atas 70% atau paket bundling yang secara spesifik diberi tanda <em>&quot;Non-refundable&quot;</em> pada halaman checkout.</div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/60 p-3 text-xs text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  <XCircle size={16} className="mt-0.5 shrink-0 text-danger" />
                  <div>Akun Pengguna terindikasi melakukan pelanggaran Syarat Layanan, seperti pembajakan video, account sharing, atau aktivitas fraud.</div>
                </div>
              </div>
            </section>

            <section id="refund-prosedur" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                4. Prosedur & Tata Cara Pengajuan
              </h2>
              <p className="mt-2.5">
                Ikuti langkah mudah berikut untuk mengajukan pengembalian dana:
              </p>
              <ol className="mt-3 list-decimal space-y-2.5 pl-5">
                <li>
                  <strong>Siapkan Data Transaksi:</strong> Catat Nomor Invoice (mis. `TRX-2026-xxxxx`), Nama Lengkap Akun, dan Alamat Email yang terdaftar di ZELC.
                </li>
                <li>
                  <strong>Kirim Permohonan:</strong> Kirim email ke <a href="mailto:refund@zelc.id" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">refund@zelc.id</a> dengan subjek <code>[Pengajuan Refund] - Nomor Invoice - Nama Anda</code>, atau hubungi Admin WhatsApp ZELC.
                </li>
                <li>
                  <strong>Sertakan Alasan:</strong> Tuliskan alasan singkat kendala yang Anda alami agar menjadi bahan evaluasi perbaikan mutu materi kami.
                </li>
                <li>
                  <strong>Verifikasi Tim:</strong> Tim operasional ZELC akan memverifikasi progres belajar akun Anda dalam kurun waktu 1x24 jam kerja.
                </li>
                <li>
                  <strong>Pemberitahuan Hasil:</strong> Anda akan menerima konfirmasi persetujuan pengembalian dana melalui email atau WhatsApp resmi.
                </li>
              </ol>
            </section>

            <section id="refund-metode" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                5. Metode Pengembalian Dana & Biaya Administrasi
              </h2>
              <p className="mt-2.5">
                Pengembalian dana akan dikembalikan melalui mekanisme berikut:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li><strong>Transfer Bank (VA) / E-Wallet / QRIS:</strong> Dana akan ditransfer kembali ke nomor rekening atau akun e-wallet asal dalam waktu 3–7 hari kerja setelah disetujui.</li>
                <li><strong>Kartu Kredit:</strong> Proses void/chargeback akan dikirimkan ke bank penerbit kartu Anda dan akan terlihat pada tagihan tagihan berikutnya (bergantung kebijakan bank penerbit).</li>
                <li><em>Biaya administrasi pihak ketiga:</em> Biaya transaksi gateway pembayaran (jika ada potongan non-refundable dari payment processor Midtrans) akan diinformasikan secara transparan pada email konfirmasi.</li>
              </ul>
            </section>

            <section id="refund-kontak" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                6. Bantuan Pengajuan Cepat
              </h2>
              <div className="mt-3 flex flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-white/[0.02] sm:flex-row sm:items-center">
                <div>
                  <p className="font-heading font-semibold text-gray-900 dark:text-white">
                    Butuh bantuan atau ingin cek status refund?
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tim customer support kami siap melayani Anda di jam kerja Senin–Jumat (09:00–18:00 WIB).
                  </p>
                </div>
                <a
                  href="https://wa.me/6285789471225?text=Halo%20Admin%20ZELC,%20saya%20ingin%20bertanya%20mengenai%20kebijakan%20pengembalian%20dana%20(refund)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                >
                  <MessageCircle size={15} /> Chat Admin WhatsApp
                </a>
              </div>
            </section>
          </article>
        </div>
      </div>
    </Layout>
  );
}
