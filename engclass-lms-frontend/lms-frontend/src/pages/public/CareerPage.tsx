import { useState, type FormEvent } from "react";
import {
  Briefcase,
  Users,
  Sparkles,
  HeartHandshake,
  Laptop,
  GraduationCap,
  Award,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Mail,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const OPEN_POSITIONS: JobOpening[] = [
  {
    id: "instructor-ielts-toefl",
    title: "Senior English Instructor (TOEFL & IELTS)",
    department: "Akademik & Pengajaran",
    location: "Remote (Indonesia)",
    type: "Full-Time",
    description:
      "Bertanggung jawab menyusun materi interaktif, memandu live mentoring, serta mengevaluasi perkembangan siswa kelas intensif persiapan TOEFL dan IELTS.",
    requirements: [
      "Skor IELTS minimal 8.0 atau TOEFL iBT minimal 105",
      "Pengalaman mengajar minimal 2 tahun (online maupun offline)",
      "Kemampuan komunikasi dan penyampaian materi yang empatik dan menarik",
      "Memiliki sertifikasi TESOL/CELTA merupakan nilai tambah",
    ],
  },
  {
    id: "curriculum-specialist",
    title: "Curriculum Specialist & Content Creator",
    department: "Produk & Kurikulum",
    location: "Hybrid (Jakarta Selatan)",
    type: "Full-Time",
    description:
      "Merancang silabus belajar berbasis CEFR, membuat naskah video pembelajaran, dan menyusun kuis interaktif yang selaras dengan kebutuhan dunia kerja dan studi lanjut.",
    requirements: [
      "Latar belakang pendidikan Bahasa Inggris / Linguistik Terapan",
      "Berpengalaman menyusun modul belajar digital atau kurikulum EdTech",
      "Kreatif dalam mengemas konsep grammar rumit menjadi ringkas dan aplikatif",
      "Mahir menggunakan tools kolaborasi modern",
    ],
  },
  {
    id: "fullstack-developer",
    title: "Full-Stack Web Developer",
    department: "Teknologi & Engineering",
    location: "Remote (Indonesia)",
    type: "Full-Time",
    description:
      "Mengembangkan fitur platform LMS ZELC mulai dari modul kuis interaktif, integrasi payment gateway Midtrans, hingga sistem analitik progres siswa.",
    requirements: [
      "Pengalaman kuat dengan React, TypeScript, Tailwind CSS, dan Node.js / Express",
      "Familiar dengan Prisma ORM, PostgreSQL / MySQL, dan REST API design",
      "Perhatian tinggi terhadap detail UI/UX, performa web, dan aksesibilitas",
      "Terbiasa bekerja secara mandiri dan kolaboratif dalam tim agile",
    ],
  },
  {
    id: "student-success-officer",
    title: "Student Success & Community Officer",
    department: "Operasional & Komunitas",
    location: "Remote (Indonesia)",
    type: "Full-Time",
    description:
      "Mendampingi perjalanan belajar siswa ZELC, memfasilitasi grup diskusi bahasa Inggris, menangani kendala teknis, serta mengumpulkan umpan balik pengguna.",
    requirements: [
      "Kemampuan komunikasi verbal dan tertulis yang ramah, solutif, dan profesional",
      "Kemampuan bahasa Inggris aktif yang baik (intermediate ke atas)",
      "Berorientasi pada kepuasan pengguna dan kenyamanan belajar siswa",
      "Fasih menggunakan platform komunitas (Discord, Telegram, WhatsApp)",
    ],
  },
];

const CULTURE_VALUES = [
  {
    icon: HeartHandshake,
    title: "Student-First & Empati",
    description:
      "Setiap keputusan kurikulum dan produk didasarkan pada keberhasilan dan kemudahan siswa dalam mencapai target kemampuan bahasa Inggris.",
  },
  {
    icon: Sparkles,
    title: "Inovasi Metodologi",
    description:
      "Kami meninggalkan metode hafalan kaku dan menggantinya dengan pendekatan kontekstual yang aplikatif untuk kehidupan nyata dan karier global.",
  },
  {
    icon: Laptop,
    title: "Remote-First & Fleksibel",
    description:
      "Kami percaya hasil kerja nyata lebih berharga daripada jam kehadiran. Bekerja dengan nyaman dari mana saja dengan ritme yang seimbang.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning",
    description:
      "Sebagai institusi pendidikan, kami mendukung penuh pengembangan diri setiap anggota tim melalui subsidi kursus dan sertifikasi internasional.",
  },
];

export default function CareerPage() {
  const [selectedRole, setSelectedRole] = useState(OPEN_POSITIONS[0].title);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulasi submit lamaran
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  function handleSelectJob(title: string) {
    setSelectedRole(title);
    const formElement = document.getElementById("application-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-primary-50/50 via-white to-white py-16 dark:border-gray-800 dark:from-surface-darkcard/50 dark:via-surface-dark dark:to-surface-dark sm:py-24">
        <div className="container-page text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <Briefcase size={14} /> Karier di ZELC
          </span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Tumbuh Bersama Membangun Masa Depan Edukasi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
            Di Zanzuen English Learning Center (ZELC), kami bersemangat membuka pintu kesempatan global bagi ribuan pembelajar di seluruh Indonesia lewat penguasaan bahasa Inggris yang efektif.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#positions"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 font-heading text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Lihat Lowongan Terbuka <ArrowRight size={16} />
            </a>
            <a
              href="#culture"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 font-heading text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-surface-darkcard dark:text-gray-200 dark:hover:bg-white/5"
            >
              Budaya & Nilai Kerja
            </a>
          </div>
        </div>
      </section>

      {/* Budaya & Nilai Kerja */}
      <section id="culture" className="py-16 dark:bg-surface-dark sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Budaya Kami
            </span>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              Nilai yang Menjadi Fondasi Kerja Kami
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Kami menghargai kreativitas, integritas, dan komitmen untuk selalu memberikan dampak nyata bagi siswa.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CULTURE_VALUES.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-bold text-gray-900 dark:text-white">
                    {val.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perks & Benefit */}
      <section className="border-y border-gray-100 bg-gray-50/70 py-16 dark:border-gray-800 dark:bg-surface-darkcard/40 sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-surface-darkcard sm:p-10">
            <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-gray-900 dark:text-white">
              <Award className="text-primary-600 dark:text-primary-400" /> Benefit yang Kamu Dapatkan
            </h3>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                <span>Akses gratis ke seluruh katalog kursus & materi eksklusif ZELC</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                <span>Subsidi tes resmi & sertifikasi internasional (IELTS/TOEFL/TESOL)</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                <span>Pengaturan kerja remote yang fleksibel & asynchronous-friendly</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success" />
                <span>Tunjangan kesehatan menyeluruh dan bonus performa tahunan</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Lowongan Terbuka */}
      <section id="positions" className="py-16 dark:bg-surface-dark sm:py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Peluang Bergabung
            </span>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
              Posisi yang Sedang Terbuka
            </h2>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Temukan posisi yang sesuai dengan keahlian dan minat kariermu di ZELC.
            </p>
          </div>

          <div className="mt-12 space-y-5">
            {OPEN_POSITIONS.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-primary-300 hover:shadow-md dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/40 sm:p-8"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                        {job.title}
                      </h3>
                      <Badge tone="primary">{job.department}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-primary-500" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-primary-500" /> {job.type}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectJob(job.title)}
                    className="shrink-0"
                  >
                    Lamar Posisi Ini
                  </Button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {job.description}
                </p>

                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800/80">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Kualifikasi Utama:
                  </h4>
                  <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Lamaran */}
      <section id="application-form" className="border-t border-gray-100 bg-gray-50 py-16 dark:border-gray-800 dark:bg-surface-darkcard/50 sm:py-20">
        <div className="container-page max-w-2xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard sm:p-8">
            <div className="text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                <Users size={22} />
              </span>
              <h3 className="mt-3 font-heading text-2xl font-bold text-gray-900 dark:text-white">
                Kirimkan Lamaran Kamu
              </h3>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Isi formulir di bawah ini atau kirimkan CV langsung ke{" "}
                <a href="mailto:karir@zelc.id" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
                  karir@zelc.id
                </a>
              </p>
            </div>

            {submitted ? (
              <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-500/20 dark:bg-green-500/10">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                  <CheckCircle2 size={24} />
                </div>
                <h4 className="mt-3 font-heading text-base font-bold text-green-800 dark:text-green-300">
                  Lamaran Berhasil Terkirim!
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-green-700 dark:text-green-400">
                  Terima kasih, <strong>{fullName}</strong>. Berkas lamaran kamu untuk posisi{" "}
                  <strong>{selectedRole}</strong> telah diterima oleh tim People ZELC. Kami akan meninjau kualifikasi dan menghubungimu dalam 3-5 hari kerja.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName("");
                    setEmail("");
                    setPhone("");
                    setPortfolioUrl("");
                    setMessage("");
                  }}
                >
                  Kirim Lamaran Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Posisi yang Dilamar *
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    required
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                  >
                    {OPEN_POSITIONS.map((job) => (
                      <option key={job.id} value={job.title}>
                        {job.title} ({job.department})
                      </option>
                    ))}
                    <option value="General Application">General Application (Posisi Lainnya)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="mis. Sarah Anindita"
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Email Aktif *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Nomor WhatsApp / HP *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="081234567890"
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      URL CV / LinkedIn / Portofolio *
                    </label>
                    <input
                      type="url"
                      required
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Ceritakan Singkat Pengalaman & Motivasi Kamu
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tuliskan pengalaman relevan, pencapaian, atau hal yang membuatmu tertarik bergabung dengan ZELC..."
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                  />
                </div>

                <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
                  <Send size={15} /> Kirim Berkas Lamaran
                </Button>

                <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
                  Dengan mengirim formulir ini, kamu menyetujui pemrosesan data pelamar oleh tim ZELC sesuai Kebijakan Privasi.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
