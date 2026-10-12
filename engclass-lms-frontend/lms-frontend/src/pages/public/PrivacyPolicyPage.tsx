import { Link } from "react-router-dom";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white py-12 dark:border-gray-800 dark:from-surface-darkcard/50 dark:to-surface-dark sm:py-16">
        <div className="container-page max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-300">
            <ShieldCheck size={13} /> UU No. 27 Tahun 2022 (UU PDP)
          </span>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Kebijakan Privasi & Pelindungan Data
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Terakhir diperbarui: 11 Oktober 2026 • Standar tata kelola dan pelindungan data pribadi pengguna platform ZELC LMS.
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
                <a href="#pdp-komitmen" className="block hover:text-primary-600 dark:hover:text-primary-400">1. Komitmen Kepatuhan UU PDP</a>
                <a href="#pdp-data" className="block hover:text-primary-600 dark:hover:text-primary-400">2. Data yang Dikumpulkan</a>
                <a href="#pdp-tujuan" className="block hover:text-primary-600 dark:hover:text-primary-400">3. Tujuan Pemrosesan Data</a>
                <a href="#pdp-keamanan" className="block hover:text-primary-600 dark:hover:text-primary-400">4. Keamanan & Retensi Data</a>
                <a href="#pdp-pihak-ketiga" className="block hover:text-primary-600 dark:hover:text-primary-400">5. Pihak Ketiga & Integrasi</a>
                <a href="#pdp-hak-pengguna" className="block hover:text-primary-600 dark:hover:text-primary-400">6. Hak Subjek Data Pengguna</a>
                <a href="#pdp-kontak" className="block hover:text-primary-600 dark:hover:text-primary-400">7. Kontak DPO ZELC</a>
              </nav>

              <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Tautan Terkait:</p>
                <div className="mt-1.5 space-y-1">
                  <Link to="/legal/terms" className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline dark:text-primary-400">
                    Syarat Layanan <ExternalLink size={10} />
                  </Link>
                  <Link to="/legal/refund" className="flex items-center gap-1 text-[11px] text-primary-600 hover:underline dark:text-primary-400">
                    Kebijakan Refund <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Policy Body */}
          <article className="space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <section id="pdp-komitmen" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                1. Komitmen Kepatuhan terhadap UU Pelindungan Data Pribadi
              </h2>
              <p className="mt-2.5">
                Zanzuen English Learning Center (&quot;ZELC&quot;) menghargai dan berkomitmen penuh untuk melindungi privasi serta keamanan data pribadi Anda. Kebijakan Privasi ini disusun sesuai dengan mandat <strong>Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)</strong> beserta peraturan pelaksananya.
              </p>
              <p className="mt-2">
                ZELC bertindak sebagai Pengendali Data Pribadi (Data Controller) yang bertanggung jawab atas pengelolaan informasi yang Anda berikan selama menggunakan platform kami.
              </p>
            </section>

            <section id="pdp-data" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                2. Data Pribadi yang Kami Kumpulkan
              </h2>
              <p className="mt-2.5">
                Kami hanya mengumpulkan data yang relevan, proporsional, dan diperlukan untuk menyediakan layanan pembelajaran terbaik:
              </p>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-surface-darkcard">
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white">a. Data Identitas & Kontak</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Nama lengkap (untuk penerbitan sertifikat resmi), alamat email (untuk autentikasi dan notifikasi), nomor telepon/WhatsApp (untuk konfirmasi pesanan dan customer service), serta foto profil akun.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-surface-darkcard">
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white">b. Data Pembayaran & Transaksi</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Nomor pesanan, riwayat pembelian kelas, nominal transaksi, status pembayaran, dan metode bayar yang dipilih. <em>Catatan: ZELC tidak pernah menyimpan nomor kartu kredit atau kode CVV pengguna secara langsung; transaksi kartu diproses secara terenkripsi melalui Midtrans Snap yang tersertifikasi PCI-DSS.</em>
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-surface-darkcard">
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white">c. Data Aktivitas Pembelajaran</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Progres video pelajaran yang diselesaikan, riwayat skor pengerjaan kuis, waktu belajar, ulasan kelas, dan nomor seri sertifikat yang diterbitkan.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-surface-darkcard">
                  <h3 className="font-heading font-semibold text-gray-900 dark:text-white">d. Data Teknis & Perangkat</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Alamat IP, tipe peramban web (browser), sistem operasi, preferensi bahasa/tema tampilan, dan cookie sesi keamanan untuk mempertahankan login.
                  </p>
                </div>
              </div>
            </section>

            <section id="pdp-tujuan" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                3. Dasar Hukum & Tujuan Pemrosesan Data
              </h2>
              <p className="mt-2.5">
                Berdasarkan Pasal 20 UU PDP, kami memproses data pribadi Anda atas dasar persetujuan eksplisit, pelaksanaan kewajiban perjanjian kursus, dan pemenuhan kewajiban hukum yang berlaku:
              </p>
              <ul className="mt-2.5 list-disc space-y-1 pl-5">
                <li>Menyediakan akses materi pembelajaran dan fitur interaktif LMS;</li>
                <li>Memvalidasi pembayaran transaksi dan mencegah penipuan;</li>
                <li>Menerbitkan dan memverifikasi sertifikat kelulusan kursus digital;</li>
                <li>Memberikan dukungan teknis dan layanan bantuan siswa (customer support);</li>
                <li>Mengirimkan informasi pembaruan materi dan buletin edukasi (hanya jika disetujui).</li>
              </ul>
            </section>

            <section id="pdp-keamanan" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                4. Keamanan Informasi & Jangka Waktu Penyimpanan
              </h2>
              <p className="mt-2.5">
                Kami menerapkan standar keamanan teknis dan organisasi berlapis untuk mencegah kebocoran, perubahan, atau akses tanpa hak:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Enkripsi data saat transmisi menggunakan protokol SSL/TLS modern;</li>
                <li>Kata sandi akun dienkripsi menggunakan algoritma cryptographic hash (bcrypt);</li>
                <li>Sistem autentikasi berbasis token terproteksi dan kontrol akses bertingkat (RBAC);</li>
                <li>Data pribadi disimpan selama akun Pengguna aktif atau sepanjang dibutuhkan untuk memenuhi kewajiban akuntansi dan hukum perpajakan.</li>
              </ul>
            </section>

            <section id="pdp-pihak-ketiga" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                5. Pengungkapan kepada Pihak Ketiga
              </h2>
              <p className="mt-2.5">
                <strong>ZELC tidak pernah memperjualbelikan atau menyewakan data pribadi Anda kepada pihak mana pun untuk keperluan periklanan pihak ketiga.</strong>
              </p>
              <p className="mt-2">
                Kami hanya meneruskan data ke mitra tepercaya yang secara ketat terikat perjanjian kerahasiaan:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>Midtrans (PT Midtrans):</strong> Sebagai gerbang pembayaran resmi untuk memproses transaksi finansial;</li>
                <li><strong>Google LLC:</strong> Untuk fitur opsional integrasi masuk (Sign in with Google);</li>
                <li><strong>Aparat Penegak Hukum:</strong> Hanya bila diwajibkan secara sah oleh peraturan perundang-undangan atau putusan pengadilan yang berkekuatan hukum tetap di Indonesia.</li>
              </ul>
            </section>

            <section id="pdp-hak-pengguna" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                6. Hak Subjek Data Pribadi Anda (Berdasarkan UU PDP)
              </h2>
              <p className="mt-2.5">
                Sebagai pemilik data pribadi, Anda memiliki hak-hak yang dijamin oleh peraturan perundang-undangan:
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="font-semibold text-gray-900 dark:text-white">Hak Akses & Informasi</p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Memperoleh kejelasan tujuan pemrosesan dan salinan data pribadi yang disimpan.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="font-semibold text-gray-900 dark:text-white">Hak Pembaruan Data</p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Memperbaiki kesalahan atau ketidakakuratan data profil langsung dari laman pengaturan akun.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="font-semibold text-gray-900 dark:text-white">Hak Penghapusan (Right to be Forgotten)</p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Mengajukan permohonan penutupan akun dan pemusnahan data pribadi dari sistem kami.</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                  <p className="font-semibold text-gray-900 dark:text-white">Hak Penarikan Persetujuan</p>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">Menarik persetujuan langganan buletin atau komunikasi pemasaran kapan saja.</p>
                </div>
              </div>
            </section>

            <section id="pdp-kontak" className="scroll-mt-28">
              <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                7. Petugas Pelindungan Data (DPO) & Pengaduan
              </h2>
              <p className="mt-2.5">
                Jika Anda ingin menggunakan hak subjek data, mengajukan pertanyaan, atau menyampaikan pengaduan terkait tata kelola data pribadi di ZELC, silakan hubungi Tim Pelindungan Data kami melalui:
              </p>
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs dark:border-gray-800 dark:bg-white/[0.02]">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Data Protection Officer (DPO) ZELC</p>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  Email:{" "}
                  <a href="mailto:privacy@zelc.id" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                    privacy@zelc.id
                  </a>
                </p>
                <p className="mt-0.5 text-gray-500 dark:text-gray-400">
                  Alamat Kantor: Gandaria 8 Office Tower Lt. 12, Jakarta Selatan 12240, Indonesia
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>
    </Layout>
  );
}
