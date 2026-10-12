import { Layout } from "@/components/layout/Layout";

export default function AboutPage() {
  return (
    <Layout>
      <div className="container-page">
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                Tentang ZELC
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                ZELC (Zanzuen English Learning Center) adalah platform pembelajaran Bahasa Inggris berbasis online yang dirancang untuk membantu pengguna belajar secara terstruktur, fleksibel, dan menyenangkan.
              </p>
            </div>

            <div className="grid gap-8 mb-12">
              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Visi</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Menjadi pusat pembelajaran Bahasa Inggris digital yang profesional, modern, dan dapat diakses oleh siapa saja untuk meningkatkan kemampuan berbahasa Inggris secara berkelanjutan.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard">
                <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-4">Misi</h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li>• Menyediakan pembelajaran Bahasa Inggris yang terstruktur dan berkualitas tinggi.</li>
                  <li>• Membantu pengguna membangun kepercayaan diri dalam berbicara, membaca, menulis, dan mendengarkan Bahasa Inggris.</li>
                  <li>• Menciptakan pengalaman belajar yang interaktif, fleksibel, dan sesuai dengan kebutuhan belajar masing-masing individu.</li>
                  <li>• Mendukung persiapan ujian internasional seperti IELTS dan TOEFL ITP dengan materi yang terarah.</li>
                  <li>• Memberikan akses pembelajaran yang terjangkau tanpa mengorbankan kualitas.</li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Nilai Brand</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Profesional", desc: "Menyajikan materi berkualitas dan terstruktur dengan baik." },
                  { title: "Edukatif", desc: "Berfokus pada pembelajaran yang bermakna dan aplikatif." },
                  { title: "Modern", desc: "Menggunakan teknologi terkini untuk pengalaman belajar yang optimal." },
                  { title: "Fleksibel", desc: "Bisa diakses kapan saja dan di mana saja." },
                  { title: "Inklusif", desc: "Cocok untuk pemula hingga tingkat lanjutan." },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-surface-darkcard">
                    <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard mb-12">
              <h2 className="font-heading text-2xl font-bold text-gray-900 dark:text-white mb-6">Fitur Unggulan LMS</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Pembelajaran Terstruktur",
                  "Video Pembelajaran",
                  "Learning Progress",
                  "Quiz & Penilaian Otomatis",
                  "Sertifikat Digital",
                  "Roadmap Belajar",
                  "Katalog Kelas",
                  "Pembayaran Terintegrasi (Midtrans)",
                  "Dashboard Personal",
                  "Verifikasi Sertifikat Publik",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="text-primary-500">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <blockquote className="text-xl font-heading font-semibold text-gray-900 dark:text-white italic mb-2">
                "Learn English, Grow Beyond."
              </blockquote>
              <p className="text-gray-600 dark:text-gray-400">
                Bersama ZELC, belajar Bahasa Inggris untuk berkembang lebih jauh.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
