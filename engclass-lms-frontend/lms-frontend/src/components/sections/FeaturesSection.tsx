import { Video, Award, Wallet, Infinity as InfinityIcon, Users, Star, BookMarked, Smile } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Meniru gaya "Pencapaian Kami" di cakap.com: pita angka besar yang jadi bukti sosial,
// lalu di bawahnya baris alasan/benefit yang lebih ringkas — gabungan ini membuat section
// "Kenapa Belajar di ZELC?" terasa lebih berisi & tidak polos dibanding versi sebelumnya
// yang hanya 4 kartu ikon datar.
const ACHIEVEMENTS = [
  { icon: Users, value: "18.000+", label: "Pelajar Aktif" },
  { icon: Award, value: "6.200+", label: "Sertifikat Diterbitkan" },
  { icon: Star, value: "4.7 / 5", label: "Rating Pengguna" },
  { icon: BookMarked, value: "320+", label: "Transaksi Kelas Sukses" },
];

const BENEFITS = [
  { icon: Video, title: "Video Praktis & Ringkas", desc: "Materi disampaikan lewat video singkat yang langsung ke inti." },
  { icon: Award, title: "Sertifikat Resmi", desc: "Setiap kelulusan dapat sertifikat dengan nomor unik terverifikasi." },
  { icon: Wallet, title: "Harga Terjangkau", desc: "Jauh lebih murah dari kursus offline, kualitas tetap setara." },
  { icon: InfinityIcon, title: "Akses Selamanya", desc: "Ulangi materi kapan saja setelah enroll, tanpa batas waktu." },
];

export function FeaturesSection() {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <section className="py-16 dark:bg-surface-dark sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Pencapaian Kami" title="Kenapa Belajar di ZELC?" />

        {/* Pita pencapaian — elemen utama gaya cakap.com */}
        <div className="relative mt-10 overflow-hidden rounded-2xl bg-hero-gradient p-6 dark:bg-hero-gradient-dark sm:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.label} className="text-center text-white">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <a.icon size={20} className={a.icon === Star ? "fill-white" : ""} />
                </span>
                <p className="mt-2.5 font-heading text-xl font-extrabold sm:text-2xl">{a.value}</p>
                <p className="text-xs text-white/80 sm:text-sm">{a.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Baris benefit pendukung */}
        <div ref={ref} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((f) => (
            <div
              key={f.title}
              data-reveal
              className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-surface-darkcard"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                <f.icon size={22} />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400 dark:text-gray-500">
          <Smile size={14} /> 98% pelajar puas dengan pengalaman belajar di ZELC
        </p>
      </div>
    </section>
  );
}
