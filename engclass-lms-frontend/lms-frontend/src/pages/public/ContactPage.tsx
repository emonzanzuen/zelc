import { useState, type FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  HelpCircle,
  Building,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("Konsultasi Program Kursus");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  }

  return (
    <Layout>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-primary-50/50 via-white to-white py-14 dark:border-gray-800 dark:from-surface-darkcard/50 dark:via-surface-dark dark:to-surface-dark sm:py-20">
        <div className="container-page text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <Mail size={14} /> Hubungi Kami
          </span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Ada Pertanyaan? Kami Siap Membantu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Punya kendala teknis LMS, ingin konsultasi persiapan tes TOEFL/IELTS, atau tertarik kerjasama korporat? Hubungi tim support ZELC kapan saja.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 dark:bg-surface-dark sm:py-16">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
            {/* Info & Jam Operasional */}
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  Saluran Komunikasi Resmi
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Pilih kanal komunikasi yang paling nyaman bagi Anda untuk terhubung dengan konsultan ZELC.
                </p>
              </div>

              {/* WhatsApp Card Highlight */}
              <div className="rounded-2xl border border-green-200 bg-green-50/70 p-6 dark:border-green-500/20 dark:bg-green-500/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white shadow-sm">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-green-950 dark:text-green-200">
                      Chat WhatsApp (Respon Cepat)
                    </h3>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Konsultasi langsung dengan admin pendaftaran ZELC
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-sm font-bold text-green-900 dark:text-green-200">
                    +62 857-8947-1225
                  </span>
                  <a
                    href="https://wa.me/6285789471225?text=Halo%20Admin%20ZELC,%20saya%20ingin%20bertanya%20tentang%20kursus."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
                  >
                    Buka WhatsApp <MessageCircle size={14} />
                  </a>
                </div>
              </div>

              {/* Contact Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Mail size={18} />
                  </div>
                  <h4 className="mt-3 font-heading text-sm font-bold text-gray-900 dark:text-white">
                    Email Resmi
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Pertanyaan Umum: <a href="mailto:halo@zelc.id" className="font-medium text-primary-600 hover:underline">halo@zelc.id</a>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bantuan Akun: <a href="mailto:support@zelc.id" className="font-medium text-primary-600 hover:underline">support@zelc.id</a>
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-surface-darkcard">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
                    <Phone size={18} />
                  </div>
                  <h4 className="mt-3 font-heading text-sm font-bold text-gray-900 dark:text-white">
                    Telepon Kantor
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    (021) 555-0199
                  </p>
                  <p className="text-xs text-gray-400">
                    Senin – Jumat pada jam operasional
                  </p>
                </div>
              </div>

              {/* Jam Operasional & Alamat */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-surface-darkcard">
                <div className="flex items-center gap-2 font-heading text-sm font-bold text-gray-900 dark:text-white">
                  <Clock size={16} className="text-primary-600 dark:text-primary-400" />
                  Jam Operasional Layanan
                </div>
                <ul className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <li className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                    <span className="font-medium">Senin – Jumat:</span>
                    <span>09:00 – 18:00 WIB</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-100 pb-2 dark:border-gray-800">
                    <span className="font-medium">Sabtu:</span>
                    <span>09:00 – 15:00 WIB</span>
                  </li>
                  <li className="flex justify-between text-gray-400">
                    <span className="font-medium">Minggu & Hari Libur Nasional:</span>
                    <span>Tutup (Tiket diproses hari kerja berikutnya)</span>
                  </li>
                </ul>

                <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-primary-600 dark:text-primary-400" />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Kantor Pusat ZELC</p>
                      <p className="mt-0.5 text-gray-500 dark:text-gray-400">
                        Gandaria 8 Office Tower Lt. 12, Jl. Sultan Iskandar Muda, Kebayoran Lama, Jakarta Selatan 12240, DKI Jakarta, Indonesia.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Pesan */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-surface-darkcard sm:p-8">
              <h3 className="font-heading text-xl font-bold text-gray-900 dark:text-white">
                Kirimkan Pesan atau Pertanyaan
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Isi form berikut, tim kami akan merespons pertanyaan Anda via email maksimal 1x24 jam kerja.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center dark:border-green-500/20 dark:bg-green-500/10">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="mt-3 font-heading text-base font-bold text-green-800 dark:text-green-300">
                    Pesan Berhasil Terkirim!
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-green-700 dark:text-green-400">
                    Terima kasih, <strong>{fullName}</strong>. Pesan Anda mengenai <em>{category}</em> telah diterima oleh tim support ZELC. Kami akan menghubungi Anda melalui email <strong>{email}</strong> segera.
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
                      setMessage("");
                    }}
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="mis. Budi Santoso"
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Alamat Email *
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

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Nomor WhatsApp / HP
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="081234567890"
                        className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Kategori Pertanyaan *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    >
                      <option value="Konsultasi Program Kursus">Konsultasi Program Kursus (TOEFL / IELTS / Speaking)</option>
                      <option value="Kendala Teknis Akun & Video">Kendala Teknis Akun & Akses Video Pembelajaran</option>
                      <option value="Pertanyaan Pembayaran & Invoice">Pertanyaan Pembayaran & Konfirmasi Invoice</option>
                      <option value="Verifikasi Sertifikat">Bantuan Sertifikat & Kuis Kelulusan</option>
                      <option value="Kemitraan Perusahaan & Kampus">Kerjasama B2B / Institusi / Kampus</option>
                      <option value="Lainnya">Pertanyaan Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Pesan atau Detail Pertanyaan *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan kendala atau pertanyaan yang ingin Anda tanyakan..."
                      className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
                    />
                  </div>

                  <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
                    <Send size={15} /> Kirim Pesan
                  </Button>

                  <p className="text-center text-[11px] text-gray-400 dark:text-gray-500">
                    Data Anda dilindungi sesuai Kebijakan Privasi ZELC dan tidak akan dibagikan ke pihak ketiga.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
