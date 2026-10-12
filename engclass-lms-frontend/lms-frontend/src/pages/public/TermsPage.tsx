import { Link } from "react-router-dom";
import { FileText, ShieldAlert, ArrowRight, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function TermsPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-12 dark:border-gray-800 dark:from-surface-darkcard/50 dark:to-surface-dark sm:py-16">
        <div className="container-page max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3.5 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <FileText size={13} /> Dokumen Legal
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Terakhir diperbarui: 11 Oktober 2026 • Berlaku bagi seluruh pengunjung dan member terdaftar di platform Zanzuen English Learning Center (ZELC).
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-page max-w-4xl py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          {/* Quick TOC Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-2 rounded-xl border border-gray-100 bg-gray-50/70 p-4 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
              <p className="font-heading font-bold text-gray-900 dark:text-white">Daftar Isi</p>
              <nav className="space-y-1.5 text-gray-500 dark:text-gray-400">
                <a href="#pasal-1" className="block hover:text-primary-600 dark:hover:text-primary-400">1. Ketentuan Umum</a>
                <a href="#pasal-2" className="block hover:text-primary-600 dark:hover:text-primary-400">2. Akun & Kredensial</a>
                <a href="#pasal-3" className="block hover:text-primary-600 dark:hover:text-primary-400">3. Hak Cipta & Materi</a>
                <a href="#pasal-4" className="block hover:text-primary-600 dark:hover:text-primary-400">4. Pembayaran & Akses</a>
                <a href="#pasal-5" className="block hover:text-primary-600 dark:hover:text-primary-400">5. Sertifikat & Kuis</a>
                <a href="#pasal-6" className="block hover:text-primary-600 dark:hover:text-primary-400">6. Kode Etik Siswa</a>
                <a href="#pasal-7" className="block hover:text-primary-600 dark:hover:text-primary-400">7. Batasan Tanggung Jawab</a>
                <a href="#pasal-8" className="block hover:text-primary-600 dark:hover:text-primary-400">8. Hukum & Kontak</a>
              </nav>

              <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Tautan Terkait:</p>
                <div className="mt-1.5 space-y-1">
                  <Link to="/legal/privacy" className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline dark:text-primary-400">
                    Kebijakan Privasi <ExternalLink size={10} />
                  </Link>
                  <Link to="/legal/refund" className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline dark:text-primary-400">
                    Kebijakan Refund <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Legal Document Body */}
          <article className="space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <section id="pasal-1" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                1. Ketentuan Umum & Penerimaan Syarat
              </h2>
              <p className="mt-2.5">
                Selamat datang di Zanzuen English Learning Center (&quot;ZELC&quot;, &quot;kami&quot;, atau &quot;Platform&quot;). Dengan mengakses situs web kami, membuat akun pengguna, atau membeli serta mengikuti kelas apa pun di ZELC, Anda (&quot;Pengguna&quot; atau &quot;Member&quot;) menyatakan telah membaca, memahami, dan menyetujui untuk terikat secara hukum oleh Syarat dan Ketentuan Layanan ini.
              </p>
              <p className="mt-2">
                Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda disarankan untuk tidak melanjutkan penggunaan layanan ZELC.
              </p>
            </section>

            <section id="pasal-2" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                2. Pendaftaran Akun & Keamanan Kredensial
              </h2>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5">
                <li>
                  Untuk mengakses materi kelas, Pengguna wajib membuat akun dengan menyertakan data yang benar, akurat, dan dapat diverifikasi (termasuk nama lengkap sesuai identitas resmi untuk kebutuhan sertifikat).
                </li>
                <li>
                  Satu akun hanya diperuntukkan bagi 1 (satu) individu pembelajar. Dilarang keras berbagi akun (account sharing), memperjualbelikan, atau meminjamkan akun ZELC kepada pihak ketiga.
                </li>
                <li>
                  Pengguna bertanggung jawab penuh atas keamanan kata sandi dan seluruh aktivitas yang terjadi di bawah akun Pengguna. Segera hubungi kami jika mencurigai adanya akses tanpa izin.
                </li>
              </ul>
            </section>

            <section id="pasal-3" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                3. Hak Kekayaan Intelektual & Materi Kursus
              </h2>
              <p className="mt-2.5">
                Seluruh materi yang terdapat di ZELC—meliputi video pembelajaran, silabus, bank soal kuis, dokumen PDF, grafis, logo, dan kode sumber sistem LMS—adalah hak milik intelektual eksklusif Zanzuen English Learning Center atau pemegang lisensi terkait dan dilindungi oleh Undang-Undang Hak Cipta No. 28 Tahun 2014 Republik Indonesia.
              </p>
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-800 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <span className="font-bold">Larangan Keras Pembajakan:</span> Pengguna dilarang merekam layar (screen recording), mengunduh, menduplikasi, menyebarluaskan, atau mengomersialkan materi video dan kuis tanpa izin tertulis resmi. Pelanggaran akan diproses melalui jalur hukum pidana dan perdata yang berlaku.
              </div>
            </section>

            <section id="pasal-4" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                4. Biaya, Pembayaran & Hak Akses Kelas
              </h2>
              <ul className="mt-2.5 list-disc space-y-1.5 pl-5">
                <li>
                  Biaya kelas yang tertera dalam Rupiah (IDR) adalah harga final yang berlaku pada saat pemesanan.
                </li>
                <li>
                  Seluruh transaksi pembayaran digital diproses secara aman melalui gerbang pembayaran berizin resmi (Midtrans Snap) mencakup Transfer Virtual Account Bank, E-Wallet (GoPay, ShopeePay), QRIS, Kartu Kredit/Debit, dan gerai ritel resmi.
                </li>
                <li>
                  Setelah pembayaran berhasil dikonfirmasi oleh sistem, akses kelas akan langsung aktif secara otomatis pada dasbor member.
                </li>
                <li>
                  Kecuali dinyatakan secara khusus dalam deskripsi kelas, kepemilikan kelas bersifat akses seumur hidup (lifetime access) selama platform ZELC beroperasi.
                </li>
              </ul>
            </section>

            <section id="pasal-5" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                5. Kuis Kelulusan & Verifikasi Sertifikat
              </h2>
              <p className="mt-2.5">
                Sertifikat kelulusan digital resmi ZELC diterbitkan secara otomatis setelah Pengguna menyelesaikan seluruh video pelajaran dan mencapai batas nilai kelulusan kuis (passing grade) yang ditentukan pada masing-masing kursus.
              </p>
              <p className="mt-2">
                Setiap sertifikat dilengkapi dengan Nomor Kredensial Unik dan dapat diverifikasi keasliannya oleh institusi publik atau pemberi kerja melalui laman{" "}
                <Link to="/verifikasi-sertifikat" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                  Verifikasi Sertifikat ZELC
                </Link>.
              </p>
            </section>

            <section id="pasal-6" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                6. Kode Etik Siswa & Komunitas Belajar
              </h2>
              <p className="mt-2.5">
                Dalam berinteraksi pada kolom ulasan (review), grup diskusi siswa, maupun sesi live mentoring, Pengguna wajib menjaga kesopanan dan etika:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Tidak memuat konten ujaran kebencian, diskriminasi SARA, atau pelecehan;</li>
                <li>Tidak menyebarkan spam, promosi produk eksternal, atau tautan mencurigakan;</li>
                <li>ZELC berhak menghapus ulasan yang melanggar dan menangguhkan akun tanpa kompensasi bila ditemukan pelanggaran berat.</li>
              </ul>
            </section>

            <section id="pasal-7" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                7. Batasan Tanggung Jawab (Disclaimer)
              </h2>
              <p className="mt-2.5">
                ZELC berkomitmen menyediakan kurikulum dan materi persiapan bahasa Inggris dengan standar mutu tinggi. Namun demikian, hasil perolehan skor pada ujian resmi eksternal (seperti tes TOEFL resmi ETS atau tes IELTS resmi IDP/British Council) sangat bergantung pada kedisiplinan dan latihan mandiri masing-masing siswa. ZELC tidak menjamin pencapaian skor tertentu di luar ranah program garansi tertulis yang disepakati secara khusus.
              </p>
            </section>

            <section id="pasal-8" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                8. Hukum yang Mengatur & Kontak Resmi
              </h2>
              <p className="mt-2.5">
                Syarat dan Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Segala perselisihan yang timbul akan diutamakan penyelesaiannya melalui musyawarah untuk mufakat terlebih dahulu.
              </p>
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Ada pertanyaan seputar Syarat Layanan?</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Hubungi tim hukum ZELC melalui email{" "}
                  <a href="mailto:legal@zelc.id" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                    legal@zelc.id
                  </a>{" "}
                  atau kunjungi laman{" "}
                  <Link to="/contact" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                    Hubungi Kami
                  </Link>.
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </Layout>
  );
}
