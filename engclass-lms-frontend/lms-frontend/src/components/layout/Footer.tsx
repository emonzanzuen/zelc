import { Link } from "react-router-dom";
import { LogoLockup } from "./Logo";
import {
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  ShieldCheck,
  CreditCard,
  Landmark,
  Wallet,
  QrCode,
  Store,
  MapPin,
  Phone,
  CheckCircle2,
} from "lucide-react";

// Footer dirombak lebih "berisi" ala santrikoding.com (kolom tautan terstruktur + brand
// card besar + status badge) dan cakap.com (blok Metode Pembayaran bergambar). Kanal
// pembayaran mengikuti channel resmi yang didukung Midtrans Snap (dikonfirmasi lewat riset
// — lihat §21.1 PRD v3.1): kartu, VA bank, GoPay/ShopeePay, QRIS, dan gerai ritel.
const LINK_GROUPS = [
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", to: "/" },
      { label: "Karier", to: "/" },
      { label: "Blog", to: "/" },
      { label: "Hubungi Kami", to: "/" },
    ],
  },
  {
    title: "Belajar",
    links: [
      { label: "Katalog Kelas", to: "/kelas" },
      { label: "Roadmap Belajar", to: "/roadmap" },
      { label: "Leaderboard", to: "/leaderboard" },
      { label: "Verifikasi Sertifikat", to: "/verifikasi-sertifikat" },
    ],
  },
  {
    title: "Kategori Populer",
    links: [
      { label: "Persiapan TOEFL", to: "/kelas?category=cat-6" },
      { label: "Persiapan IELTS", to: "/kelas?category=cat-7" },
      { label: "Speaking", to: "/kelas?category=cat-3" },
      { label: "Business English", to: "/kelas?category=cat-8" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Syarat Layanan", to: "/" },
      { label: "Kebijakan Privasi", to: "/" },
      { label: "Kebijakan Refund", to: "/" },
    ],
  },
];

const BANKS = ["BCA", "Mandiri", "BNI", "BRI", "Permata"];
const RETAIL = ["Indomaret", "Alfamart"];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-surface-dark">
      {/* Brand band atas — logo besar + deskripsi + kontak, mirip susunan santrikoding.com */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="container-page grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <LogoLockup size={42} textClassName="text-xl" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Zanzuen English Learning Center — kursus Bahasa Inggris online dari Grammar sampai
              persiapan TOEFL/IELTS, lengkap dengan roadmap belajar terarah dan sertifikat resmi.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-2"><Mail size={14} className="shrink-0 text-primary-500" /> halo@zelc.id</li>
              <li className="flex items-center gap-2"><Phone size={14} className="shrink-0 text-primary-500" /> (021) 555-0199</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-primary-500" /> Jakarta Selatan, Indonesia</li>
            </ul>

            <div className="mt-5 flex items-center gap-3 text-gray-400">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:hover:border-primary-500/40 dark:hover:text-primary-400"><Instagram size={16} /></a>
              <a href="#" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:hover:border-primary-500/40 dark:hover:text-primary-400"><Youtube size={16} /></a>
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 transition-colors hover:border-primary-200 hover:text-primary-600 dark:border-gray-700 dark:hover:border-primary-500/40 dark:hover:text-primary-400"><Linkedin size={16} /></a>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-heading font-bold text-gray-900 dark:text-white">{group.title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="transition-colors hover:text-primary-600 dark:hover:text-primary-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Metode Pembayaran — kanal resmi Midtrans Snap */}
      <div className="container-page py-10">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-center sm:text-left">
            <h4 className="flex items-center justify-center gap-2 text-sm font-heading font-bold text-gray-900 dark:text-white sm:justify-start">
              Metode Pembayaran
            </h4>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Seluruh transaksi diproses aman melalui Midtrans Snap.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-semibold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
            <ShieldCheck size={13} /> Transaksi Terenkripsi & Aman
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PaymentGroup icon={Landmark} title="Transfer Bank (VA)" items={BANKS} />
          <PaymentGroup icon={Wallet} title="E-Wallet" items={["GoPay", "ShopeePay"]} />
          <PaymentGroup icon={QrCode} title="QRIS" items={["Semua e-wallet pendukung QRIS"]} />
          <PaymentGroup icon={Store} title="Gerai Ritel" items={RETAIL} />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-400">
          <CreditCard size={14} className="shrink-0 text-primary-500" />
          Kartu Kredit/Debit: Visa, Mastercard, JCB — mendukung cicilan untuk nominal tertentu.
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-gray-400 dark:text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} ZELC. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-success" />
            Semua sistem beroperasi normal
          </div>
        </div>
      </div>
    </footer>
  );
}

function PaymentGroup({ icon: Icon, title, items }: { icon: React.ElementType; title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
        <Icon size={13} /> {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-semibold text-gray-600 dark:border-gray-700 dark:bg-surface-darkcard dark:text-gray-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
