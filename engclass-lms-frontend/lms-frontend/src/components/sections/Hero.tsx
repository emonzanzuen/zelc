import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight, PlayCircle, Star, Users, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { prefersReducedMotion } from "@/hooks/useLenis";
import { Starfield } from "@/components/layout/Starfield";

export function Hero() {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !scopeRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo("[data-hero-line]", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 })
        .fromTo("[data-hero-sub]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .fromTo("[data-hero-cta]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo("[data-hero-stat]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.2")
        .fromTo("[data-hero-float]", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.15 }, "-=0.4");
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scopeRef}
      className="relative overflow-hidden bg-white pb-20 pt-14 dark:bg-surface-dark sm:pb-28 sm:pt-20"
    >
      {/* Background: bintang + grid pattern + soft gradient blobs — upgrade dari sebelumnya yang polos */}
      <Starfield density={0.00018} maxStars={140} className="opacity-70 dark:opacity-90" />
      <div
        aria-hidden
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] dark:opacity-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-[-8%] h-72 w-72 rounded-full bg-hero-gradient opacity-25 blur-3xl dark:bg-hero-gradient-dark dark:opacity-30 sm:h-[26rem] sm:w-[26rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-[-10%] h-64 w-64 rounded-full bg-accent-500 opacity-10 blur-3xl dark:opacity-15 sm:h-96 sm:w-96"
      />

      <div className="container-page relative">
        {/* Floating badge kiri & kanan. Dua pelajaran dari iterasi sebelumnya:
            1) absolute positioning mengacu ke padding-box ancestor, jadi left-0/right-0
               akan nempel pas di tepi container (melewati batas layout guide), bukan di
               batas konten — makanya pakai left-4/right-4 (menyamai padding container-page).
            2) di breakpoint lg (1024–1279px) container-page BELUM mencapai max-width-nya,
               jadi badge selebar ini bisa tumpang-tindih dengan teks hero yang di-center.
               Solusi paling aman: baru tampil mulai xl (1280px+), saat container sudah
               capped di 1280px dan ada gutter kosong asli di luar kolom teks (max-w-3xl)
               untuk badge "mengambang" tanpa risiko nabrak konten sama sekali. */}
        <div
          data-hero-float
          className="absolute left-4 top-4 z-10 hidden w-44 animate-float-slow rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-2xl ring-1 ring-black/[0.03] dark:border-gray-700 dark:bg-surface-darkcard dark:ring-white/[0.04] xl:block"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-success dark:bg-green-500/15">
              <Award size={21} />
            </span>
            <div>
              <p className="font-heading text-base font-extrabold leading-tight text-gray-900 dark:text-white">6.200+</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Sertifikat Terbit</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-2.5 text-[11px] font-semibold text-success dark:border-gray-800">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Terverifikasi otomatis
          </div>
        </div>

        <div
          data-hero-float
          className="absolute right-4 top-16 z-10 hidden w-48 animate-float rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-2xl ring-1 ring-black/[0.03] dark:border-gray-700 dark:bg-surface-darkcard dark:ring-white/[0.04] xl:block"
        >
          <div className="flex items-center -space-x-2.5">
            {["DP", "RK", "FN", "SW"].map((label) => (
              <span
                key={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-xs font-bold text-primary-700 dark:border-surface-darkcard dark:bg-primary-500/20 dark:text-primary-300"
              >
                {label}
              </span>
            ))}
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-600 text-[10px] font-bold text-white dark:border-surface-darkcard">
              +18rb
            </span>
          </div>
          <p className="mt-2.5 font-heading text-base font-extrabold leading-tight text-gray-900 dark:text-white">18.000+ Pelajar</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Aktif belajar bulan ini</p>
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span
            data-hero-line
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-300"
          >
            <Sparkles size={14} />
            Kelas Bahasa Inggris #1 untuk Persiapan Karier & Tes
          </span>

          <h1 className="font-heading text-4xl font-extrabold leading-[1.15] text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
            <span data-hero-line className="block">Kuasai Bahasa Inggris,</span>
            <span data-hero-line className="block">
              Mulai dari <span className="bg-hero-gradient bg-clip-text text-transparent">Grammar</span> sampai
            </span>
            <span data-hero-line className="block">Siap TOEFL &amp; IELTS</span>
          </h1>

          <p data-hero-sub className="mx-auto mt-6 max-w-xl text-base text-gray-500 dark:text-gray-400 sm:text-lg">
            Belajar terstruktur lewat video, quiz, dan sertifikat resmi — tanpa jadwal kaku
            dan tanpa harus berpindah-pindah platform.
          </p>

          <div data-hero-cta className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/kelas"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-7 py-3.5 text-base font-heading font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 sm:w-auto"
            >
              Lihat Semua Kelas
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/kelas?price=free"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-[1.5px] border-gray-200 px-7 py-3.5 text-base font-heading font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5 sm:w-auto"
            >
              <PlayCircle size={18} />
              Coba Kelas Gratis
            </Link>
          </div>

          <div data-hero-cta className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Tanpa kartu kredit</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Akses selamanya</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-success" /> Sertifikat terverifikasi</span>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-3 sm:mt-16 sm:gap-4">
          {[
            { icon: Users, value: "18.000+", label: "Pelajar Aktif" },
            { icon: Star, value: "4.7 / 5", label: "Rata-rata Rating", fill: true },
            { icon: Award, value: "6.200+", label: "Sertifikat Terbit" },
          ].map((stat) => (
            <div
              key={stat.label}
              data-hero-stat
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-surface-darkcard sm:p-6"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-hero-gradient opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300 sm:h-12 sm:w-12">
                <stat.icon size={20} className={stat.fill ? "fill-primary-600 dark:fill-primary-300" : ""} />
              </span>
              <p className="mt-3 font-heading text-xl font-extrabold text-gray-900 dark:text-white sm:text-2xl">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
