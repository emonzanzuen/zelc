import { BookOpen, Mic, Headphones, PenLine, GraduationCap, Award, Briefcase, MessageCircle, Type, Baby } from "lucide-react";

// Marquee kartu (bukan teks polos) — meniru gaya "Kategori Teknologi yang Tersedia"
// di santrikoding.com: baris kartu kecil (ikon + nama + tagline) yang berjalan otomatis,
// dua baris berlawanan arah supaya terasa lebih hidup. Animasi berhenti otomatis kalau
// prefers-reduced-motion aktif (lihat className motion-reduce:animate-none).
const ROW_1 = [
  { icon: BookOpen, name: "Grammar", tag: "Fondasi Tata Bahasa" },
  { icon: Mic, name: "Speaking", tag: "Percaya Diri Bicara" },
  { icon: Headphones, name: "Listening", tag: "Native Speed" },
  { icon: PenLine, name: "Writing", tag: "Academic Essay" },
  { icon: GraduationCap, name: "TOEFL", tag: "Simulasi Ujian" },
];

const ROW_2 = [
  { icon: Award, name: "IELTS", tag: "Band Score 6.5+" },
  { icon: Briefcase, name: "Business English", tag: "Siap Kerja" },
  { icon: Type, name: "Vocabulary", tag: "1000+ Kata" },
  { icon: MessageCircle, name: "Conversation", tag: "Untuk Traveling" },
  { icon: Baby, name: "Beginners", tag: "Mulai dari Nol" },
];

function Chip({ icon: Icon, name, tag }: { icon: React.ElementType; name: string; tag: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
        <Icon size={17} />
      </span>
      <div className="text-left">
        <p className="font-heading text-sm font-bold leading-tight text-gray-900 dark:text-white">{name}</p>
        <p className="text-xs leading-tight text-gray-400 dark:text-gray-500">{tag}</p>
      </div>
    </div>
  );
}

export function MarqueeBanner() {
  const row1 = [...ROW_1, ...ROW_1];
  const row2 = [...ROW_2, ...ROW_2];

  return (
    <div className="overflow-hidden border-y border-gray-100 bg-gray-50 py-8 dark:border-gray-800 dark:bg-white/[0.02] sm:py-10">
      <p className="mb-5 text-center font-heading text-sm font-semibold text-gray-400 dark:text-gray-500 sm:text-base">
        Kelas Online ZELC &middot; Materi Paling Update
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex w-max animate-marquee gap-3 motion-reduce:animate-none">
          {row1.map((item, i) => (
            <Chip key={`r1-${i}`} {...item} />
          ))}
        </div>
        <div className="flex w-max animate-marquee-reverse gap-3 motion-reduce:animate-none">
          {row2.map((item, i) => (
            <Chip key={`r2-${i}`} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
