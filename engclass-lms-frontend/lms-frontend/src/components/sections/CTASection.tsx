import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-white py-16 dark:bg-surface-dark sm:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-hero-gradient px-6 py-14 text-center dark:bg-hero-gradient-dark sm:px-12 sm:py-16">
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div aria-hidden className="pointer-events-none absolute -top-10 right-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <h2 className="font-heading text-2xl font-extrabold text-white sm:text-3xl">
            Siap Mulai Belajar Bahasa Inggris Hari Ini?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/90 sm:text-base">
            Daftar gratis dan coba kelas pertama tanpa biaya — tidak perlu kartu kredit.
          </p>
          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-heading text-base font-semibold text-primary-700 shadow-sm hover:bg-gray-50"
          >
            Daftar Gratis Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
