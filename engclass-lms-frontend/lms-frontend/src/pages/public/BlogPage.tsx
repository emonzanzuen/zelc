import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: "TOEFL & IELTS" | "Speaking" | "Grammar" | "Tips Belajar" | "Karier & Bisnis";
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  imageUrl: string;
  isFeatured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "strategi-skor-toefl-550-dalam-60-hari",
    title: "Strategi Menembus Skor TOEFL 550+ dalam 60 Hari Tanpa Stres",
    excerpt:
      "Rencana belajar mingguan terstruktur mulai dari pemetaan kelemahan Grammar, trik menghemat waktu di sesi Reading, hingga melatih fokus pada audio Listening cepat.",
    category: "TOEFL & IELTS",
    readTime: "8 min baca",
    date: "10 Okt 2026",
    author: {
      name: "Sarah Anindita, M.Ed.",
      role: "Head of IELTS/TOEFL ZELC",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    isFeatured: true,
  },
  {
    id: "post-2",
    slug: "5-kesalahan-grammar-sering-dilakukan-pemula",
    title: "5 Kesalahan Grammar yang Paling Sering Dilakukan Pemula (dan Solusinya)",
    excerpt:
      "Sering bingung membedakan Present Perfect dan Simple Past, atau salah meletakkan preposition? Simak penjelasan kontekstual beserta contoh kalimatnya.",
    category: "Grammar",
    readTime: "4 min baca",
    date: "08 Okt 2026",
    author: {
      name: "Dian Permata, M.Hum.",
      role: "Lead Grammar Instructor",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "post-3",
    slug: "rahasia-lancar-speaking-shadowing-technique",
    title: "Rahasia Lancar Speaking: Teknik Shadowing & Berhenti Menerjemahkan di Kepala",
    excerpt:
      "Berhenti menyusun kata perkata dari bahasa Indonesia di dalam pikiran sebelum bicara. Latih refleks bicara spontan lewat teknik shadowing 15 menit sehari.",
    category: "Speaking",
    readTime: "6 min baca",
    date: "04 Okt 2026",
    author: {
      name: "Alexander Pratama",
      role: "Speaking Coach",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "post-4",
    slug: "ielts-academic-vs-general-training-panduan",
    title: "IELTS Academic vs General Training: Mana yang Tepat untuk Kebutuhanmu?",
    excerpt:
      "Panduan lengkap perbedaan jenis tes IELTS. Cari tahu format mana yang wajib diambil untuk beasiswa kuliah luar negeri vs visa kerja profesional.",
    category: "TOEFL & IELTS",
    readTime: "5 min baca",
    date: "29 Sep 2026",
    author: {
      name: "Sarah Anindita, M.Ed.",
      role: "Head of IELTS/TOEFL ZELC",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "post-5",
    slug: "7-kosakata-formal-presentasi-bisnis",
    title: "7 Kosakata Formal & Idiom Penting untuk Presentasi Bisnis Bahasa Inggris",
    excerpt:
      "Tingkatkan wibawa dan profesionalitas presentasimu di hadapan klien global dengan pilihan frasa transisi dan idiom korporat yang elegan.",
    category: "Karier & Bisnis",
    readTime: "5 min baca",
    date: "22 Sep 2026",
    author: {
      name: "Rizky Firmansyah",
      role: "Corporate English Trainer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "post-6",
    slug: "metode-spaced-repetition-hafalan-vocab",
    title: "Metode Spaced Repetition: Cara Cepat Menghafal 500 Kosakata Tanpa Lupa",
    excerpt:
      "Terapkan kurva lupa Ebbinghaus untuk mengunci ribuan vocabulary ke memori jangka panjang secara sistematis tanpa beban.",
    category: "Tips Belajar",
    readTime: "7 min baca",
    date: "18 Sep 2026",
    author: {
      name: "Nadia Utami",
      role: "EdTech Learning Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "post-7",
    slug: "trik-listening-ielts-section-3-4",
    title: "Trik Menaklukkan Audio Listening IELTS Section 3 & 4 yang Bertutur Cepat",
    excerpt:
      "Ketahui cara mendeteksi kata penanda (signposting words), jebakan distraktor audio, dan teknik membaca soal lebih awal saat jeda instruksi.",
    category: "TOEFL & IELTS",
    readTime: "6 min baca",
    date: "12 Sep 2026",
    author: {
      name: "Sarah Anindita, M.Ed.",
      role: "Head of IELTS/TOEFL ZELC",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
  },
];

const CATEGORIES = [
  "Semua",
  "TOEFL & IELTS",
  "Speaking",
  "Grammar",
  "Tips Belajar",
  "Karier & Bisnis",
] as const;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredPost = BLOG_POSTS.find((p) => p.isFeatured) || BLOG_POSTS[0];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "Semua" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (subscribedEmail) {
      setSubscribed(true);
    }
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-primary-50/50 via-white to-white py-14 dark:border-gray-800 dark:from-surface-darkcard/50 dark:via-surface-dark dark:to-surface-dark sm:py-20">
        <div className="container-page text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">
            <BookOpen size={14} /> Blog & Wawasan Belajar
          </span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Tips & Panduan Kuasai Bahasa Inggris
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
            Jelajahi panduan tes TOEFL/IELTS, trik speaking percaya diri, tata bahasa aplikatif, serta artikel pengembangan karier langsung dari para mentor ZELC.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, mis. 'toefl', 'speaking', 'grammar'..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-darkcard dark:text-gray-100"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary-600 text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-primary-200 hover:text-primary-600 dark:border-gray-800 dark:bg-surface-darkcard dark:text-gray-400 dark:hover:text-primary-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article (hanya jika di tab Semua & tanpa query pencarian) */}
      {selectedCategory === "Semua" && !searchQuery && (
        <section className="py-12 dark:bg-surface-dark sm:py-16">
          <div className="container-page">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              <Sparkles size={14} /> Artikel Utama Minggu Ini
            </div>

            <div className="mt-4 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30 lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-auto">
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-4 top-4">
                  <Badge tone="primary">{featuredPost.category}</Badge>
                </div>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-10">
                <div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {featuredPost.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="mt-3 font-heading text-xl font-extrabold text-gray-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400 sm:text-2xl">
                    {featuredPost.title}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {featuredPost.author.name}
                      </p>
                      <p className="text-[11px] text-gray-400">{featuredPost.author.role}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
                    Baca Selengkapnya <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid Artikel */}
      <section className="py-12 dark:bg-surface-dark sm:py-16">
        <div className="container-page">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              {searchQuery
                ? `Hasil pencarian "${searchQuery}" (${filteredPosts.length})`
                : selectedCategory === "Semua"
                ? "Artikel Terbaru"
                : `Kategori: ${selectedCategory}`}
            </h2>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-gray-200 py-16 text-center dark:border-gray-800">
              <BookOpen size={36} className="mx-auto text-gray-400" />
              <h3 className="mt-3 font-heading text-base font-bold text-gray-900 dark:text-white">
                Tidak ada artikel ditemukan
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Coba ubah kata kunci pencarian atau pilih kategori lain.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
                }}
              >
                Reset Filter
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-surface-darkcard dark:hover:border-primary-500/30"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-3.5 top-3.5">
                      <Badge tone="primary">{post.category}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>

                      <h3 className="mt-2.5 font-heading text-base font-bold text-gray-900 line-clamp-2 transition-colors group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">
                        {post.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800/80">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {post.author.name}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-primary-600 group-hover:translate-x-0.5 transition-transform dark:text-primary-400">
                        Baca →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 dark:border-gray-800 dark:bg-surface-darkcard/40 sm:py-20">
        <div className="container-page max-w-3xl text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
            <Mail size={22} />
          </span>
          <h2 className="mt-4 font-heading text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Tingkatkan Skill Bahasa Inggris Setiap Pekan
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
            Dapatkan kiriman tips ringkas, lembar latihan kuis gratis, dan kabar diskon kelas ZELC langsung ke email kamu. Tanpa spam.
          </p>

          {subscribed ? (
            <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-xs font-semibold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 size={16} />
              Terima kasih! Kamu telah terdaftar dalam buletin mingguan ZELC.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={subscribedEmail}
                onChange={(e) => setSubscribedEmail(e.target.value)}
                placeholder="Masukkan alamat email kamu"
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-100"
              />
              <Button type="submit" size="sm">Langganan Gratis</Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
