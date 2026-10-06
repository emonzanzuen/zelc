# PRODUCT REQUIREMENT DOCUMENT (PRD) — LENGKAP
## Website LMS Berbayar — Kursus Bahasa Inggris Online

| Item | Keterangan |
|---|---|
| Versi Dokumen | 3.0 — Lengkap + fokus niche Bahasa Inggris, Leaderboard, Rating & Review, Login Google |
| Status | Draft — siap untuk development berbantuan AI |
| Platform | Web Application (Responsive) |
| Jenis | Full-Stack Web Application |
| Fokus Produk | LMS berbayar yang **khusus** menyediakan kursus **Bahasa Inggris** (Grammar, Vocabulary, Speaking, Listening, Writing, persiapan TOEFL/IELTS, Business English, dsb) — bukan LMS multi-topik umum |
| Tech Stack | **React + TypeScript (Vite) + Fetch/Axios API + JWT**, **Tailwind CSS**, **Lenis** (smooth scroll), **GSAP + ScrollTrigger** (animasi), **Express + TypeScript** (MVC), **Prisma ORM**, **PostgreSQL**, **bcrypt**, **Zod**, **Multer/Cloudinary**, **Midtrans Snap (Sandbox)**, **Google Identity Services + google-auth-library** (login Google) |
| Referensi Produk | buildwithangga.com (UI/UX & fitur gamifikasi), santrikoding.com (model bisnis single-provider) |

> Dokumen ini dibuat lengkap agar bisa langsung dipakai sebagai basis pembangunan aplikasi — termasuk untuk dikerjakan/di-generate dengan bantuan AI: user stories, functional requirement bernomor & prioritas, ERD detail dengan tipe data, business rules, matrix otorisasi API, state diagram, hingga rencana testing & deployment. PRD ini fokus pada **apa** yang harus dibangun & **mengapa**, sebagai satu-satunya dokumen acuan (tidak ada dokumen planning terpisah).

---

## Daftar Isi

1. Ringkasan Eksekutif
2. Latar Belakang
3. Tujuan & Sasaran
4. Ruang Lingkup (In/Out of Scope)
5. Glosarium
6. Target Pengguna & Persona
7. User Stories
8. Functional Requirements
9. Non-Functional Requirements
10. Sitemap & Struktur Navigasi
11. Spesifikasi Halaman — Publik & Member
12. Spesifikasi Halaman — Admin Dashboard
13. Alur Pembelian & Belajar (Detail)
14. State Diagram (Transaksi, Progress, Quiz, Sertifikat)
15. Data Model / ERD Lengkap
16. Otorisasi & Matrix Akses API
17. Business Rules & Validasi
18. Format Nomor Transaksi & Sertifikat
19. Spesifikasi Sertifikat
20. Keamanan Sistem
21. Arsitektur Teknis
22. Strategi Testing
23. Rencana Deployment
24. Risiko & Mitigasi
25. Success Metrics / KPI
26. Deliverables
27. Lampiran
28. Design System / UI Specification
29. API Specification Lengkap

---

## 1. Ringkasan Eksekutif

Website LMS Berbayar adalah platform belajar **Bahasa Inggris** online yang menggantikan cara belajar konvensional (kursus offline mahal & tidak fleksibel jadwal, materi tersebar di YouTube tanpa jalur belajar jelas, tanpa bukti kelulusan) dengan satu platform terpusat: pengguna publik bisa menjelajah katalog kelas Bahasa Inggris (Grammar, Speaking, Listening, Writing, persiapan TOEFL/IELTS, Business English, dsb), mendaftar sebagai **Member** (email/password atau **Google**), mengakses kelas gratis atau membeli kelas premium, belajar lewat video (embed YouTube), mengerjakan quiz, dan mendapatkan **sertifikat kelulusan otomatis** yang bisa diverifikasi publik. Untuk mendorong keaktifan belajar, platform menyediakan **leaderboard** siswa teraktif dan fitur **rating & review** agar calon pembeli bisa menilai kualitas kelas dari member lain. **Admin** mengelola seluruh konten (kelas, materi, quiz, kategori, harga) dan memantau statistik penjualan lewat dashboard. Model bisnis: **freemium** — materi gratis untuk menarik pengguna, dilanjutkan materi premium berbayar per kelas.

---

## 2. Latar Belakang

Belajar Bahasa Inggris secara mandiri saat ini punya beberapa masalah:

- Kursus Bahasa Inggris offline (lembaga kursus) cenderung mahal dan jadwalnya kaku, tidak fleksibel untuk pelajar/pekerja.
- Materi belajar gratis tersebar di banyak platform (YouTube, blog, PDF) dan tidak terstruktur jadi satu jalur belajar (mis. tidak jelas urutan Grammar dasar → lanjutan, atau persiapan TOEFL/IELTS yang sistematis).
- Tidak ada cara memantau progres belajar sendiri secara sistematis, sehingga pelajar mudah kehilangan motivasi.
- Tidak ada bukti kelulusan yang bisa dipakai untuk portofolio/CV/melamar kerja dan bisa diverifikasi pihak lain.
- Penyedia kelas (admin) kesulitan mengatur harga, promo, dan memantau penjualan tanpa sistem terpusat.
- Proses pembelian kelas manual (transfer bank + konfirmasi manual) lambat dan rawan kesalahan.
- Tidak ada elemen yang mendorong konsistensi belajar (gamifikasi) maupun cara bagi calon siswa menilai kualitas kelas sebelum membeli.

Website ini dibangun untuk mendigitalisasi seluruh proses tersebut — dari penemuan kelas Bahasa Inggris sampai penerbitan sertifikat — dalam satu platform yang juga mendorong keaktifan belajar lewat leaderboard dan transparansi kualitas lewat rating & review.

---

## 3. Tujuan & Sasaran

| Tujuan | Sasaran Terukur (Target) |
|---|---|
| Mempermudah cara belajar Bahasa Inggris (tujuan utama LMS) | Materi terstruktur per course → lesson, dapat diakses dari 1 platform tanpa berpindah-pindah, dikelompokkan per skill (Grammar, Speaking, dst) |
| Model freemium yang fleksibel | Admin dapat mengubah status course (gratis penuh / gratis sebagian+berbayar / berbayar penuh) kapan saja |
| Mendorong konsistensi belajar (gamifikasi) | Leaderboard siswa teraktif per bulan, mendorong member menyelesaikan lebih banyak lesson |
| Transparansi kualitas kelas | Member dapat memberi rating & review, calon pembeli melihat rata-rata rating sebelum beli |
| Kemudahan pendaftaran | Member dapat daftar/login cepat via Google, tanpa harus mengisi form manual |
| Transaksi otomatis & real-time | Status transaksi ter-update otomatis via webhook Midtrans, enrollment terbuka < 5 detik setelah bayar sukses |
| Bukti kelulusan terverifikasi | Sertifikat ter-generate otomatis setelah lulus quiz, dapat diverifikasi publik via nomor sertifikat |
| Efisiensi admin | Admin dapat memantau statistik penjualan real-time & publish course baru dalam < 10 menit |
| Keamanan data | Password ter-hash (bcrypt), JWT dengan expiry, seluruh endpoint privat diproteksi middleware role |
| Kualitas & maintainability kode | Seluruh kode (frontend & backend) ditulis **TypeScript**, validasi request wajib pakai Zod di backend, struktur Express konsisten (MVC + middleware), `schema.prisma` sebagai satu sumber kebenaran struktur data & tipe (Prisma Client auto-generate tipe TS) |

---

## 4. Ruang Lingkup

### 4.1 In Scope (MVP)
- Website berfokus **khusus kursus Bahasa Inggris** (bukan LMS multi-topik umum) — lihat kategori contoh di §5 & §11.
- Landing page publik (hero, kategori, course terbaru, testimoni, FAQ) bergaya buildwithangga.com.
- Katalog kelas dengan filter kategori/level/gratis-berbayar + search.
- Detail kelas: silabus, preview lesson gratis, harga, rating & review.
- Autentikasi Member (register/login via **email+password** maupun **Google OAuth**).
- Enrollment otomatis untuk course gratis.
- Checkout & pembayaran course berbayar via **Midtrans Snap (Sandbox)**.
- Player belajar (video YouTube embed) + tracking progress per lesson.
- Quiz pilihan ganda per course dengan auto-grading.
- Sertifikat otomatis (PDF) + halaman verifikasi publik.
- **Rating & Review** — member yang sudah enroll dapat menilai & memberi komentar pada course.
- **Leaderboard** publik — ranking siswa teraktif per bulan berdasarkan jumlah lesson selesai & menit belajar.
- Dashboard Member: kelas saya, progress, sertifikat, riwayat transaksi.
- Dashboard Admin: CRUD course/lesson/quiz/kategori, atur harga, statistik penjualan, kelola member, moderasi review.
- Responsive design (mobile, tablet, desktop) dengan animasi Lenis + GSAP.

### 4.2 Out of Scope (Fase Berikutnya / Tidak Termasuk MVP)
- Multi-instruktur / marketplace (lihat analisis role di §6 & §16 — platform ini **single-provider**, dikelola 1 tim admin).
- Live class / webinar terjadwal (mis. kelas Speaking langsung dengan native speaker).
- Latihan Speaking interaktif (rekam suara + penilaian pelafalan) — fitur khas platform bahasa yang butuh engine speech-to-text, di luar scope MVP.
- Kamus/vocabulary flashcard interaktif terpisah dari materi course.
- Forum diskusi / komunitas antar member.
- Notifikasi otomatis via Email/WhatsApp (pembelian sukses, sertifikat terbit).
- Aplikasi mobile native (Android/iOS) — cukup responsive web.
- Payment method selain Midtrans (mis. PayPal, transfer manual).
- Refund / pembatalan transaksi otomatis (ditangani manual oleh admin bila diperlukan).
- Sistem subscription/membership bulanan — pembelian bersifat **one-time purchase per course**.
- Integrasi dengan sistem eksternal (LinkedIn Learning, dsb).
- Kode promo/diskon, flash sale, dan sistem patungan (group-buy) — dapat ditambahkan di fase berikutnya bila diperlukan.

> **Catatan:** Penggunaan Zod & struktur MVC yang konsisten **bukan** bagian dari ruang lingkup produk (out of scope) — ini adalah standar pengembangan yang berlaku di seluruh in-scope items di atas. Lihat §21 Arsitektur Teknis.

---

## 5. Glosarium

| Istilah | Keterangan |
|---|---|
| LMS | Learning Management System |
| Course | Kelas/mata pelajaran yang dijual di platform |
| Lesson | Materi/sub-bagian dari sebuah course, berisi 1 video |
| Enrollment | Status "terdaftar" seorang member pada sebuah course (gratis maupun setelah bayar) |
| Passing Grade | Nilai minimum kelulusan quiz agar sertifikat diterbitkan |
| ORM | Object Relational Mapping (Prisma) |
| Migration | Perubahan struktur database yang tercatat & dapat diulang (`prisma migrate`) |
| Webhook | Callback otomatis dari Midtrans ke server saat status pembayaran berubah |
| JWT | JSON Web Token, dipakai untuk autentikasi stateless |
| RBAC | Role-Based Access Control — pembatasan akses berdasarkan role (Member/Admin) |
| Snap | Produk payment popup dari Midtrans |
| CEFR | Common European Framework of Reference for Languages — standar level kemampuan bahasa (A1–C2), dipakai sebagai referensi level course |
| Leaderboard | Papan peringkat siswa teraktif berdasarkan jumlah lesson selesai & menit belajar dalam periode tertentu |
| OAuth | Protokol otorisasi yang dipakai untuk login via akun pihak ketiga (Google) tanpa password baru |

---

## 6. Target Pengguna & Persona

### Analisis Role Pengguna
Ada 3 level akses (bukan hanya Publik & Admin):

| Role | Status | Bisa apa saja |
|---|---|---|
| **Publik (Guest)** | Belum login | Lihat landing page, katalog, detail kelas, lesson preview gratis, verifikasi sertifikat |
| **Member** | Sudah register/login (role default) | Semua akses Publik + enroll kelas gratis, beli kelas berbayar, belajar penuh, kerjakan quiz, dapat sertifikat, lihat riwayat transaksi |
| **Admin** | Login dengan role khusus | Semua akses Member + kelola course/lesson/quiz/kategori, atur harga, lihat statistik penjualan, kelola member |

Role `Instructor` terpisah **tidak digunakan**: platform ini bersifat single-provider (mengacu pada santrikoding.com), bukan marketplace multi-mentor seperti Udemy, sehingga Admin sudah merangkap sebagai pembuat konten. Jika ke depannya berkembang jadi marketplace, role `INSTRUCTOR` dapat ditambahkan tanpa mengubah struktur inti.

### Persona 1 — Member ("Dimas", 22 tahun, fresh graduate yang sedang mempersiapkan TOEFL untuk daftar kerja/beasiswa)
- **Goal:** Meningkatkan kemampuan Bahasa Inggris (terutama Grammar & persiapan TOEFL) dengan harga terjangkau, punya bukti sertifikat untuk portofolio/CV.
- **Frustrasi:** Kursus Bahasa Inggris offline mahal & jadwalnya kaku, tidak jelas isi materinya sebelum beli, tidak ada yang memotivasi belajar konsisten, tidak ada bukti kelulusan resmi.
- **Kebutuhan sistem:** Preview materi gratis sebelum beli, login cepat pakai Google, lihat rating & review dari member lain sebelum membeli, checkout cepat, progres belajar terlihat jelas, terpacu lewat leaderboard, sertifikat bisa diverifikasi.

### Persona 2 — Admin ("Tim Konten LMS Bahasa Inggris")
- **Goal:** Upload course Bahasa Inggris baru dengan cepat (per skill: Grammar/Speaking/Listening/Writing/Persiapan Tes), atur harga/promo sesuai strategi, pantau penjualan.
- **Frustrasi:** Rekap penjualan manual di Excel rawan salah, sulit tahu course mana yang paling laku, sulit memantau kualitas course lewat feedback siswa.
- **Kebutuhan sistem:** Dashboard statistik ringkas, CRUD course/lesson/quiz cepat, filter & pencarian member/transaksi, moderasi review yang tidak pantas.

---

## 7. User Stories

### Publik
- Sebagai pengunjung, saya ingin melihat katalog & detail kelas Bahasa Inggris tanpa login, agar saya bisa memutuskan sebelum mendaftar.
- Sebagai pengunjung, saya ingin menonton materi preview gratis, agar saya tahu kualitas materi sebelum membeli.
- Sebagai pengunjung, saya ingin melihat rating & review dari member lain di halaman detail kelas, agar saya yakin sebelum membeli.
- Sebagai pengunjung, saya ingin melihat leaderboard siswa teraktif, agar saya termotivasi ikut belajar di platform ini.
- Sebagai pengunjung, saya ingin memverifikasi sertifikat orang lain lewat nomor sertifikat, agar saya percaya keasliannya.

### Member
- Sebagai member, saya ingin mendaftar & login memakai email/password **atau akun Google**, agar prosesnya cepat tanpa mengisi form panjang.
- Sebagai member, saya ingin membeli kelas berbayar lewat Midtrans, agar saya bisa langsung belajar setelah bayar.
- Sebagai member, saya ingin enroll kelas gratis secara instan, agar saya tidak perlu proses pembayaran.
- Sebagai member, saya ingin melihat progres belajar saya per course, agar saya tahu materi mana yang belum selesai.
- Sebagai member, saya ingin mengerjakan quiz setelah semua materi selesai, agar saya bisa mendapat sertifikat.
- Sebagai member, saya ingin mengunduh sertifikat kelulusan, agar saya bisa memakainya sebagai portofolio.
- Sebagai member, saya ingin melihat riwayat transaksi saya, agar saya punya bukti pembelian.
- Sebagai member, saya ingin memberi rating & review pada kelas yang sudah saya ikuti, agar member lain terbantu memilih kelas.
- Sebagai member, saya ingin melihat posisi saya di leaderboard, agar saya termotivasi belajar lebih konsisten.

### Admin
- Sebagai admin, saya ingin login aman ke dashboard, agar konten & data platform terlindungi.
- Sebagai admin, saya ingin CRUD course, lesson, dan kategori, agar konten selalu up to date.
- Sebagai admin, saya ingin mengatur harga & status gratis/berbayar tiap course, agar strategi pricing fleksibel.
- Sebagai admin, saya ingin membuat quiz & soal per course, agar member diuji sebelum dinyatakan lulus.
- Sebagai admin, saya ingin melihat statistik penjualan (total revenue, course terlaris), agar saya bisa mengambil keputusan bisnis.
- Sebagai admin, saya ingin menyembunyikan/menghapus review yang tidak pantas, agar kualitas konten platform terjaga.

---

## 8. Functional Requirements

Prioritas menggunakan MoSCoW: **M**ust have, **S**hould have, **C**ould have, **W**on't have (fase ini).

| ID | Modul | Deskripsi | Prioritas |
|---|---|---|---|
| FR-01 | Public | Menampilkan landing page dengan seluruh section (navbar, hero, marquee, kategori, course terbaru, keunggulan, testimoni, FAQ, CTA, footer) | Must |
| FR-02 | Public | Menampilkan katalog course dengan filter kategori, level, dan status gratis/berbayar | Must |
| FR-03 | Public | Search course berdasarkan judul/kata kunci | Should |
| FR-04 | Public | Menampilkan detail course: silabus, jumlah lesson, level, harga, lesson preview gratis | Must |
| FR-05 | Public | Halaman verifikasi sertifikat via nomor sertifikat | Must |
| FR-06 | Auth | Register member (validasi email unik, password minimal 8 karakter, hashed bcrypt) | Must |
| FR-07 | Auth | Login member/admin, menghasilkan JWT access token berisi `userId` & `role` | Must |
| FR-07b | Auth | Register/Login via **Google OAuth** (Google Identity Services) — verifikasi id_token di backend, buat/tautkan akun otomatis | Should |
| FR-08 | Auth | Logout (hapus token di sisi client) | Must |
| FR-09 | Auth | Middleware proteksi route berdasarkan role (`authenticate` + `authorize(role)`) | Must |
| FR-10 | Enrollment | Enroll otomatis & instan untuk course dengan `isFree = true` | Must |
| FR-11 | Enrollment | Mencegah double enrollment (constraint unik `userId + courseId`) | Must |
| FR-12 | Payment | Checkout course berbayar → generate Snap token Midtrans | Must |
| FR-13 | Payment | Endpoint webhook menerima notifikasi Midtrans & memvalidasi signature sebelum update status | Must |
| FR-14 | Payment | Jika transaksi sukses (`settlement`/`capture`), sistem otomatis membuat Enrollment | Must |
| FR-15 | Payment | Member dapat melihat riwayat transaksi miliknya | Should |
| FR-16 | Belajar | Player video per lesson (embed YouTube iframe) | Must |
| FR-17 | Belajar | Member menandai lesson selesai (tercatat per lesson di `LessonProgress`); progress course dihitung otomatis (%) | Must |
| FR-18 | Belajar | Lesson bertanda `isPreview = true` dapat diakses publik tanpa enrollment | Must |
| FR-19 | Quiz | Member mengerjakan quiz hanya jika progress course = 100% | Must |
| FR-20 | Quiz | Sistem melakukan auto-grading pilihan ganda & menentukan lulus/tidak berdasarkan passing grade | Must |
| FR-21 | Sertifikat | Sistem generate sertifikat otomatis (PDF) dengan nomor unik saat member lulus quiz | Must |
| FR-22 | Sertifikat | Member dapat mengunduh sertifikat dari dashboard | Must |
| FR-23 | Admin — Course | CRUD course (judul, deskripsi, thumbnail, kategori, level, harga, status publish) | Must |
| FR-24 | Admin — Lesson | CRUD lesson per course, termasuk urutan tampil & status preview | Must |
| FR-25 | Admin — Kategori | CRUD kategori course | Must |
| FR-26 | Admin — Harga | Mengatur harga & status gratis/berbayar tiap course | Must |
| FR-27 | Admin — Quiz | CRUD quiz & soal pilihan ganda per course, atur passing grade | Must |
| FR-28 | Admin — Dashboard | Statistik penjualan (total revenue, total transaksi sukses, course terlaris, grafik per periode) | Must |
| FR-29 | Admin — Member | Melihat & mencari daftar member terdaftar | Should |
| FR-30 | UI | Notifikasi toast (Sonner-style) untuk setiap aksi sukses/gagal (CRUD, transaksi, quiz) | Should |
| FR-31 | Admin — Export | Export data transaksi ke Excel/CSV | Could |
| FR-32 | Notifikasi | Email otomatis saat pembelian sukses / sertifikat terbit | Won't (fase 2) |
| FR-33 | Review | Member yang sudah enroll dapat memberi rating (1–5) & komentar pada course, maksimal 1 review per course | Should |
| FR-34 | Review | Sistem menghitung & menampilkan rata-rata rating + jumlah review di course card & detail course | Should |
| FR-35 | Review | Admin dapat menyembunyikan/menghapus review yang tidak pantas | Could |
| FR-36 | Leaderboard | Sistem mencatat setiap lesson yang diselesaikan member (waktu & durasi) sebagai dasar perhitungan leaderboard | Must |
| FR-37 | Leaderboard | Halaman publik menampilkan leaderboard bulanan (top siswa) berdasarkan total menit belajar & jumlah lesson selesai | Should |
| FR-38 | Sosial | Latihan Speaking interaktif (rekam suara + penilaian) | Won't (fase 2) |

---

## 9. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performance | First Contentful Paint < 2.5s pada koneksi 4G; response API list course < 1s untuk katalog ≤ 1.000 course |
| Availability | Target uptime 99% (bergantung SLA hosting backend & database) |
| Responsive | Layout tetap fungsional pada breakpoint mobile (360px), tablet (768px), desktop (1280px+) menggunakan breakpoint Tailwind |
| Browser Support | 2 versi terbaru Chrome, Firefox, Edge, Safari |
| Accessibility | Kontras warna memenuhi WCAG AA minimum, elemen interaktif dapat diakses keyboard, animasi GSAP/Lenis menghormati `prefers-reduced-motion` |
| Security | Seluruh endpoint privat melalui middleware JWT + role check; input backend divalidasi Zod; webhook Midtrans divalidasi signature |
| Scalability | Struktur database mendukung ribuan course & transaksi tanpa redesign skema |
| Maintainability | Kode frontend (.tsx) & backend (.ts) terstruktur MVC (routes → controller → service), ditulis penuh **TypeScript** dengan tipe data konsisten (Prisma Client auto-generate tipe dari `schema.prisma`); `tsc --noEmit` wajib bersih sebelum deploy |
| Usability | Member dapat menyelesaikan checkout dalam ≤ 2 menit tanpa kebingungan |
| Konsistensi Visual | Seluruh halaman mengikuti satu sistem desain (warna, tipografi, spacing) bergaya buildwithangga.com |
| Data Retention | Data transaksi & sertifikat disimpan permanen (tidak dihapus, hanya soft-delete bila diperlukan) |

---

## 10. Sitemap & Struktur Navigasi

```text
PUBLIK (/)
├── / ............................. Landing Page
├── /kelas ......................... Katalog Kelas (filter kategori/level/search)
│   └── /kelas/:slug .............. Detail Kelas (silabus, rating & review)
├── /leaderboard .................... Papan peringkat siswa teraktif bulanan
├── /login, /register .............. Auth (email/password + tombol "Login dengan Google")
├── /verifikasi-sertifikat ......... Cek keaslian sertifikat via nomor
└── /faq ............................ FAQ (opsional, bisa jadi section di landing)

MEMBER (/dashboard, /checkout) — protected, role: member (admin juga otomatis punya akses ini)
├── /checkout/:courseId ............ Ringkasan pembayaran + Midtrans Snap
├── /dashboard ...................... Kelas Saya + progress
├── /dashboard/belajar/:courseId .... Player video + lesson list
├── /dashboard/quiz/:courseId ....... Pengerjaan quiz
├── /dashboard/sertifikat ........... Daftar & unduh sertifikat
├── /dashboard/transaksi ............ Riwayat transaksi
└── /profil .......................... Edit profil

ADMIN (/admin) — protected, role: admin
├── /admin/dashboard ................ Statistik penjualan
├── /admin/kelas ..................... CRUD Course
│   ├── /admin/kelas/:id/materi ..... CRUD Lesson per course
│   ├── /admin/kelas/:id/quiz ....... CRUD Quiz & Soal per course
│   └── /admin/kelas/:id/review ..... Moderasi review course
├── /admin/kategori .................. CRUD Kategori
├── /admin/member ..................... List Member
└── /admin/transaksi .................. List Semua Transaksi
```

---

## 11. Spesifikasi Halaman — Publik & Member

### 11.1 Landing Page (`/`)
**Section (urut top-to-bottom):**
1. Navbar sticky — logo, menu (Beranda, Kelas, Leaderboard, Login/Register atau avatar bila sudah login).
2. Hero — headline dengan animasi GSAP (fade/slide bertahap per baris), mis. *"Kuasai Bahasa Inggris, Mulai dari Grammar sampai Siap TOEFL"*, sub-headline, CTA "Lihat Kelas".
3. Marquee logo/teks berjalan (Lenis + CSS `@keyframes`) — pola *"Kelas Bahasa Inggris Online. Materi Paling Update."* seperti buildwithangga.com.
4. Kategori pilihan — card kategori dengan ikon, hover-scale (CSS). Contoh kategori: Grammar, Vocabulary, Speaking, Listening, Writing, Persiapan TOEFL/IELTS, Business English.
5. Kelas terbaru/trending — grid course card (thumbnail, badge Gratis/Premium, harga, level, jumlah lesson, **rating bintang + jumlah review**).
6. Keunggulan platform — 3–6 card (video praktis, sertifikat resmi, harga terjangkau, akses selamanya).
7. Testimoni (carousel, dapat memakai data dummy di awal).
8. FAQ accordion.
9. CTA akhir — banner ajakan melihat katalog/daftar.
10. Footer — sitemap, kontak, sosial media.

**Data source:** `Category`, `Course` (published = true, urut createdAt desc, limit N untuk section trending, join agregat `avgRating`/`reviewCount`).

### 11.2 Katalog Kelas (`/kelas`)
- Grid course card (termasuk rating bintang) + filter (kategori, level, gratis/berbayar) + search bar.
- Pagination.
- Animasi reveal per card saat scroll (GSAP ScrollTrigger, stagger).

### 11.3 Detail Kelas (`/kelas/:slug`)
- Video trailer/lesson pertama sebagai preview.
- Tab: Deskripsi, Silabus (accordion lesson — lesson non-preview tampil dengan ikon gembok bila belum enroll), **Rating & Review** (rata-rata bintang + list komentar member, dengan form tambah review khusus untuk member yang sudah enroll pada course tsb).
- Sidebar sticky: harga (atau badge "Gratis"), tombol dinamis: **"Beli Sekarang"** (belum beli & berbayar) / **"Mulai Belajar"** (gratis atau sudah beli) / **"Lanjutkan Belajar"** (sudah enroll, progress > 0).

### 11.4 Checkout (`/checkout/:courseId`)
- Hanya untuk course berbayar yang belum di-enroll.
- Ringkasan course + harga → memicu Midtrans Snap popup.
- Setelah pembayaran sukses → redirect ke `/dashboard/belajar/:courseId` dengan toast sukses.
- Jika gagal/expired → tampilkan pesan error, tombol "Coba Lagi".

### 11.5 Dashboard Member (`/dashboard`)
- Card course yang diikuti + progress bar animasi (GSAP).
- Filter: Semua / Sedang Berjalan / Selesai.

### 11.6 Halaman Belajar / Player (`/dashboard/belajar/:courseId`)
- Video YouTube player (kiri/atas), list lesson accordion (kanan/bawah) dengan checklist selesai.
- Tombol "Lanjut ke Quiz" aktif setelah semua lesson ditandai selesai (progress = 100%).

### 11.7 Quiz (`/dashboard/quiz/:courseId`)
- Semua soal ditampilkan sekaligus dalam satu halaman (MVP, tanpa timer).
- Submit → auto-grading → tampilkan skor & status lulus/tidak.
- Jika lulus → sertifikat langsung terbit, tombol "Lihat Sertifikat".
- Jika gagal → tombol "Ulangi Quiz" (retry, tiap attempt tercatat).

### 11.8 Sertifikat (`/dashboard/sertifikat` & `/verifikasi-sertifikat`)
- Dashboard member: list sertifikat yang dimiliki + tombol unduh PDF.
- Halaman publik: input nomor sertifikat → tampilkan nama, course, tanggal terbit (jika valid) atau pesan "sertifikat tidak ditemukan" (jika tidak).

### 11.9 Leaderboard (`/leaderboard`) — Publik
- Menampilkan Top 20–50 member paling aktif belajar **bulan berjalan**, diurutkan berdasarkan total menit belajar (utama) lalu jumlah lesson selesai (sekunder).
- Kolom yang ditampilkan: peringkat, avatar + nama tampilan (tanpa email, demi privasi), total lesson selesai, total menit belajar.
- Highlight khusus (mis. warna beda/badge) untuk posisi member yang sedang login, jika ia login dan masuk daftar.
- Reset otomatis setiap awal bulan (dihitung dari `LessonProgress.completedAt` dalam rentang bulan berjalan).
- Animasi counter angka (GSAP) saat card peringkat muncul.

### 11.10 Login/Register (`/login`, `/register`)
- Form email + password standar.
- Tombol **"Login dengan Google"** (Google Identity Services) di atas/bawah form — 1 klik langsung login/register otomatis bila akun belum ada.
- Jika email dari akun Google sudah terdaftar manual sebelumnya, sistem menautkan akun tersebut (bukan membuat akun baru).

---

## 12. Spesifikasi Halaman — Admin Dashboard

### 12.1 Login
- Satu halaman login untuk member & admin (`/login`, lihat detail di §11.10 termasuk opsi Google), redirect otomatis ke `/admin/dashboard` jika role = admin, atau `/dashboard` jika role = member.
- Pesan error generik ("Email atau password salah") — tidak membedakan email tidak terdaftar vs password salah.

### 12.2 Dashboard (`/admin/dashboard`)
**Widget statistik (card):**
- Total Revenue (dari transaksi sukses)
- Total Transaksi Sukses
- Total Member Terdaftar
- Total Course Published
- Course Terlaris (Top 5 berdasarkan jumlah enrollment)

**Visual tambahan (should have):**
- Chart batang: transaksi/revenue per bulan.
- Tabel 5 transaksi terbaru.

### 12.3 CRUD Course (`/admin/kelas`)
- Tabel: Judul, Kategori, Harga, Status (Gratis/Berbayar), Published, Jumlah Enrollment, Rating, Aksi.
- Form create/edit: judul, slug, deskripsi, thumbnail (upload), kategori, level, harga, toggle gratis/berbayar, toggle published.

### 12.4 CRUD Lesson (`/admin/kelas/:id/materi`)
- List lesson per course dengan urutan (`order`), form: judul, URL YouTube, durasi (menit, untuk keperluan leaderboard), toggle preview gratis.

### 12.5 CRUD Quiz & Soal (`/admin/kelas/:id/quiz`)
- 1 course punya 1 quiz akhir; CRUD soal pilihan ganda (4 opsi) + tentukan jawaban benar; atur passing grade (default 70).

### 12.6 CRUD Kategori (`/admin/kategori`)
- Tabel + form nama & slug kategori.

### 12.7 List Member (`/admin/member`)
- Tabel: nama, email, tanggal daftar, metode daftar (Email/Google), jumlah course diikuti; search & filter.

### 12.8 List Transaksi (`/admin/transaksi`)
- Tabel: nomor transaksi, member, course, jumlah, status, tanggal; filter status & rentang tanggal.

### 12.9 Moderasi Review (`/admin/kelas/:id/review`)
- List review per course (nama member, rating, komentar, tanggal).
- Aksi: sembunyikan (`isHidden = true`) atau hapus permanen review yang tidak pantas/spam — dengan confirmation dialog.
- Review yang disembunyikan tidak dihitung dalam `avgRating`/`reviewCount` dan tidak tampil di halaman publik.

---

## 13. Alur Pembelian & Belajar (Detail)

### 13.1 Alur Pembelian Course Berbayar
```text
1. Member buka /kelas/:slug, klik "Beli Sekarang"
2. Redirect ke /checkout/:courseId
3. Backend membuat Transaction (status = 'pending', amount = snapshot harga saat itu)
4. Backend request Snap token ke Midtrans, frontend tampilkan popup Snap
5. Member menyelesaikan pembayaran
6. Midtrans mengirim webhook ke backend
     ├── Signature valid & status settlement/capture
     │     └── Transaction.status = 'success' → sistem otomatis membuat Enrollment
     └── Signature tidak valid / status deny/expire/cancel
           └── Transaction.status = 'failed' / 'expired'
7. Frontend polling/cek status transaksi, redirect ke halaman belajar bila sukses
```

### 13.2 Alur Course Gratis
```text
1. Member buka /kelas/:slug, klik "Mulai Belajar"
2. Backend langsung membuat Enrollment (tanpa Transaction)
3. Redirect ke /dashboard/belajar/:courseId
```

### 13.3 Alur Belajar → Quiz → Sertifikat
```text
1. Member menandai lesson selesai satu per satu
2. Enrollment.progress dihitung ulang: (lesson selesai / total lesson) x 100
3. Progress = 100% → tombol "Kerjakan Quiz" aktif
4. Member submit jawaban quiz
5. Sistem auto-grading: skor = (jawaban benar / total soal) x 100
     ├── skor >= passing grade → QuizAttempt.passed = true → Certificate dibuat otomatis (jika belum ada sebelumnya)
     └── skor < passing grade → QuizAttempt.passed = false → member dapat mengulang (attempt baru dicatat)
```

---

## 14. State Diagram

### 14.1 Status Transaksi
```text
[pending] --(webhook: settlement/capture, signature valid)--> [success]
[pending] --(webhook: deny/cancel)--> [failed]
[pending] --(waktu habis)--> [expired]
```
**Aturan:** Enrollment hanya dibuat saat transisi ke `success`. Status lain tidak memberi akses.

### 14.2 Progress Belajar (Enrollment)
```text
[belum mulai] (progress = 0%) --> [sedang berjalan] (0% < progress < 100%) --> [selesai] (progress = 100%)
```

### 14.3 Status Quiz Attempt
```text
[belum attempt] --(submit, skor >= passing grade)--> [lulus] --(trigger otomatis)--> Certificate diterbitkan
[belum attempt] --(submit, skor < passing grade)--> [gagal] --(retry)--> [belum attempt] (attempt baru)
```
**Aturan:** Semua attempt (lulus maupun gagal) tercatat di `QuizAttempt` sebagai riwayat. Sertifikat hanya diterbitkan **satu kali** per member per course — attempt lulus berikutnya (jika retry setelah lulus) tidak membuat sertifikat baru.

---

## 15. Data Model / ERD Lengkap

### 15.1 Diagram Relasi
```text
User (Admin) (1) ──< (N) Course >── (1) Category
Course (1) ──< (N) Lesson
Course (1) ──< (N) Quiz ──< (N) Question
Course (1) ──< (N) Review >── (1) User
User (1) ──< (N) Enrollment >── (1) Course
User (1) ──< (N) Transaction >── (1) Course
User (1) ──< (N) QuizAttempt >── (1) Quiz
User (1) ──< (N) Certificate >── (1) Course
User (1) ──< (N) LessonProgress >── (1) Lesson
```

### 15.2 Tabel: User
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK, default uuid() |
| name | varchar | not null |
| email | varchar | not null, unique |
| password | varchar | nullable (hashed bcrypt; kosong jika daftar via Google) |
| googleId | varchar | nullable, unique (diisi jika login via Google OAuth) |
| role | enum | not null, default `MEMBER`, values: `MEMBER`, `ADMIN` |
| avatarUrl | varchar | nullable |
| createdAt | timestamp | default now() |

**Aturan:** minimal salah satu dari `password` atau `googleId` wajib terisi (divalidasi di level aplikasi).

### 15.3 Tabel: Category
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| name | varchar | not null |
| slug | varchar | not null, unique |

### 15.4 Tabel: Course
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| title | varchar | not null |
| slug | varchar | not null, unique |
| description | text | not null |
| thumbnailUrl | varchar | nullable |
| price | integer | not null, default 0 (dalam Rupiah) |
| isFree | boolean | not null, default false |
| level | varchar | nullable (Pemula/Menengah/Lanjutan) |
| published | boolean | not null, default false |
| categoryId | uuid | FK → Category.id |
| authorId | uuid | FK → User.id (wajib role = ADMIN, divalidasi di level aplikasi) |
| avgRating | float | not null, default 0 (cache, dihitung ulang dari tabel `Review`) |
| reviewCount | integer | not null, default 0 (cache) |
| createdAt | timestamp | default now() |

**Index tambahan:** `idx_course_category` pada `categoryId`, `idx_course_published` pada `published`.

### 15.5 Tabel: Lesson
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| courseId | uuid | FK → Course.id |
| title | varchar | not null |
| youtubeUrl | varchar | not null |
| durationMinutes | integer | not null, default 0 (dipakai untuk hitung total menit belajar di Leaderboard) |
| order | integer | not null |
| isPreview | boolean | not null, default false |

### 15.6 Tabel: Enrollment
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| userId | uuid | FK → User.id |
| courseId | uuid | FK → Course.id |
| progress | integer | not null, default 0 (persen 0–100) |
| enrolledAt | timestamp | default now() |

**Constraint:** unique (`userId`, `courseId`) — 1 member hanya 1 kali enroll per course.

### 15.7 Tabel: Transaction
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| transactionNumber | varchar | not null, unique (format lihat §18) |
| userId | uuid | FK → User.id |
| courseId | uuid | FK → Course.id |
| amount | integer | not null (snapshot harga saat checkout) |
| status | varchar | not null, default `pending`, check in (`pending`,`success`,`failed`,`expired`) |
| midtransOrderId | varchar | unique, nullable |
| paidAt | timestamp | nullable |
| createdAt | timestamp | default now() |

**Index:** `idx_transaction_status` pada `status`, `idx_transaction_user` pada `userId`.

### 15.8 Tabel: Quiz
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| courseId | uuid | FK → Course.id, unique (1 course = 1 quiz akhir) |
| title | varchar | not null |
| passingGrade | integer | not null, default 70 |

### 15.9 Tabel: Question
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| quizId | uuid | FK → Quiz.id |
| text | text | not null |
| options | json | not null (array 4 opsi) |
| correctOption | varchar | not null |

### 15.10 Tabel: QuizAttempt (Audit Trail Kelulusan)
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| userId | uuid | FK → User.id |
| quizId | uuid | FK → Quiz.id |
| score | integer | not null (0–100) |
| passed | boolean | not null |
| attemptedAt | timestamp | default now() |

**Index:** `idx_quizattempt_user` pada `userId`.

### 15.11 Tabel: Certificate
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| certNumber | varchar | not null, unique (format lihat §18) |
| userId | uuid | FK → User.id |
| courseId | uuid | FK → Course.id |
| fileUrl | varchar | nullable (link PDF) |
| issuedAt | timestamp | default now() |

**Constraint:** unique (`userId`, `courseId`) — 1 sertifikat per member per course.

### 15.12 Tabel: LessonProgress (Tracking Per-Lesson + Basis Leaderboard)
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| userId | uuid | FK → User.id |
| lessonId | uuid | FK → Lesson.id |
| completedAt | timestamp | default now() |

**Constraint:** unique (`userId`, `lessonId`) — 1 lesson hanya tercatat selesai 1 kali per member.
**Index:** `idx_lessonprogress_user`, `idx_lessonprogress_completedat` (dipakai untuk query leaderboard per periode bulan).
**Fungsi:** Sumber kebenaran untuk menghitung `Enrollment.progress` (lesson mana saja yang sudah selesai) **dan** untuk menghitung Leaderboard (total lesson selesai & total menit belajar per member per bulan, via join ke `Lesson.durationMinutes`).

### 15.13 Tabel: Review
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| userId | uuid | FK → User.id |
| courseId | uuid | FK → Course.id |
| rating | integer | not null, check 1–5 |
| comment | text | nullable |
| isHidden | boolean | not null, default false (moderasi admin) |
| createdAt | timestamp | default now() |

**Constraint:** unique (`userId`, `courseId`) — 1 member hanya bisa memberi 1 review per course (dapat diedit, tidak dapat duplikat).
**Aturan:** hanya member dengan `Enrollment` aktif pada course tsb yang boleh membuat review (lihat §17).

### 15.14 Draft Schema Prisma (Lengkap)

```prisma
enum Role {
  MEMBER
  ADMIN
}

model User {
  id             String           @id @default(uuid())
  name           String
  email          String           @unique
  password       String?          // nullable, kosong jika daftar via Google
  googleId       String?          @unique
  role           Role             @default(MEMBER)
  avatarUrl      String?
  createdAt      DateTime         @default(now())
  coursesCreated Course[]         @relation("CourseAuthor")
  enrollments    Enrollment[]
  transactions   Transaction[]
  quizAttempts   QuizAttempt[]
  certificates   Certificate[]
  reviews        Review[]
  lessonProgress LessonProgress[]
}

model Category {
  id      String   @id @default(uuid())
  name    String
  slug    String   @unique
  courses Course[]
}

model Course {
  id           String        @id @default(uuid())
  title        String
  slug         String        @unique
  description  String
  thumbnailUrl String?
  price        Int           @default(0)
  isFree       Boolean       @default(false)
  level        String?
  published    Boolean       @default(false)
  category     Category      @relation(fields: [categoryId], references: [id])
  categoryId   String
  author       User          @relation("CourseAuthor", fields: [authorId], references: [id])
  authorId     String
  avgRating    Float         @default(0) // cache, recalculate saat Review berubah
  reviewCount  Int           @default(0) // cache
  lessons      Lesson[]
  enrollments  Enrollment[]
  transactions Transaction[]
  quiz         Quiz?
  certificates Certificate[]
  reviews      Review[]
  createdAt    DateTime      @default(now())
}

model Lesson {
  id              String           @id @default(uuid())
  course          Course           @relation(fields: [courseId], references: [id])
  courseId        String
  title           String
  youtubeUrl      String
  durationMinutes Int              @default(0) // dipakai untuk hitung menit belajar di Leaderboard
  order           Int
  isPreview       Boolean          @default(false)
  progressLogs    LessonProgress[]
}

model Enrollment {
  id         String   @id @default(uuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  course     Course   @relation(fields: [courseId], references: [id])
  courseId   String
  progress   Int      @default(0)
  enrolledAt DateTime @default(now())

  @@unique([userId, courseId])
}

model LessonProgress {
  id          String   @id @default(uuid())
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  lessonId    String
  completedAt DateTime @default(now())

  @@unique([userId, lessonId])
  @@index([userId])
  @@index([completedAt]) // dipakai untuk query leaderboard per periode
}

model Transaction {
  id                String    @id @default(uuid())
  transactionNumber String    @unique
  user              User      @relation(fields: [userId], references: [id])
  userId            String
  course            Course    @relation(fields: [courseId], references: [id])
  courseId          String
  amount            Int
  status            String    @default("pending") // pending, success, failed, expired
  midtransOrderId   String?   @unique
  paidAt            DateTime?
  createdAt         DateTime  @default(now())
}

model Quiz {
  id           String        @id @default(uuid())
  course       Course        @relation(fields: [courseId], references: [id])
  courseId     String        @unique
  title        String
  passingGrade Int           @default(70)
  questions    Question[]
  attempts     QuizAttempt[]
}

model Question {
  id            String @id @default(uuid())
  quiz          Quiz   @relation(fields: [quizId], references: [id])
  quizId        String
  text          String
  options       Json
  correctOption String
}

model QuizAttempt {
  id          String   @id @default(uuid())
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id])
  quizId      String
  score       Int
  passed      Boolean
  attemptedAt DateTime @default(now())
}

model Certificate {
  id         String   @id @default(uuid())
  certNumber String   @unique
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  course     Course   @relation(fields: [courseId], references: [id])
  courseId   String
  fileUrl    String?
  issuedAt   DateTime @default(now())

  @@unique([userId, courseId])
}

model Review {
  id        String   @id @default(uuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  course    Course   @relation(fields: [courseId], references: [id])
  courseId  String
  rating    Int      // 1–5, divalidasi via Zod
  comment   String?
  isHidden  Boolean  @default(false)
  createdAt DateTime @default(now())

  @@unique([userId, courseId])
}
```

---

## 16. Otorisasi & Matrix Akses API

Backend menggunakan Express + JWT (bukan Supabase RLS), sehingga otorisasi diterapkan lewat **middleware** `authenticate` (verifikasi JWT) dan `authorize(role)` (cek role) di setiap route. Prinsip: **default deny** untuk endpoint privat.

| Endpoint / Resource | Publik (tanpa token) | Member (token, role=MEMBER) | Admin (token, role=ADMIN) |
|---|---|---|---|
| `GET /courses`, `/courses/:slug` | ✅ | ✅ | ✅ |
| `GET /categories` | ✅ | ✅ | ✅ |
| `POST /auth/register`, `/auth/login` | ✅ | — | — |
| `POST /auth/google` (verifikasi id_token Google) | ✅ | — | — |
| `GET /me` (profil user login, untuk restore session) | ❌ | ✅ | ✅ |
| `GET /certificates/verify/:certNumber` | ✅ | ✅ | ✅ |
| `GET /leaderboard` | ✅ | ✅ | ✅ |
| `GET /courses/:id/reviews` | ✅ (hanya `isHidden = false`) | ✅ | ✅ (termasuk yang disembunyikan) |
| `POST /enrollments` (course gratis) | ❌ | ✅ | ✅ |
| `POST /transactions/checkout` | ❌ | ✅ | ✅ |
| `POST /transactions/webhook` | Khusus server Midtrans (divalidasi via signature, bukan role user) | | |
| `GET /me/enrollments`, `/me/transactions`, `/me/certificates` | ❌ | ✅ (data milik sendiri) | ✅ |
| `PATCH /lessons/:id/complete` | ❌ | ✅ (harus punya Enrollment aktif) | ✅ |
| `POST /quiz/:id/submit` | ❌ | ✅ (progress course harus 100%) | ✅ |
| `POST /courses/:id/reviews` | ❌ | ✅ (harus punya Enrollment pada course tsb) | ❌ (admin tidak membeli course sendiri) |
| `POST/PUT/DELETE /courses`, `/lessons`, `/categories`, `/quiz`, `/questions` | ❌ | ❌ | ✅ |
| `POST /admin/upload` (upload thumbnail) | ❌ | ❌ | ✅ |
| `PATCH /reviews/:id/hide`, `DELETE /reviews/:id` (moderasi) | ❌ | ❌ | ✅ |
| `GET /admin/stats` | ❌ | ❌ | ✅ |
| `GET /admin/transactions`, `/admin/members` | ❌ | ❌ | ✅ |

---

## 17. Business Rules & Validasi

1. Email wajib unik, password minimal 8 karakter dan disimpan ter-hash (bcrypt, salt round ≥ 10).
2. 1 member hanya bisa enroll 1 kali per course (constraint unik `userId + courseId`).
3. Course dengan `isFree = true` → enrollment dibuat langsung tanpa transaksi.
4. Course berbayar → enrollment **hanya** dibuat setelah `Transaction.status = 'success'`.
5. Lesson dengan `isPreview = true` dapat diakses tanpa enrollment.
6. Progress course dihitung: `(jumlah lesson selesai / total lesson) x 100`; quiz tidak dihitung sebagai lesson.
7. Quiz hanya dapat diakses jika `Enrollment.progress = 100`.
8. Skor quiz dihitung: `(jawaban benar / total soal) x 100`; lulus jika skor ≥ `Quiz.passingGrade` (default 70).
9. Sertifikat hanya diterbitkan **satu kali** per member per course, meskipun quiz diulang setelah lulus.
10. Amount pada `Transaction` adalah **snapshot** harga saat checkout dibuat — perubahan harga course setelahnya tidak memengaruhi transaksi yang sudah berjalan.
11. Course tidak dapat dihapus permanen oleh admin jika sudah memiliki transaksi sukses — gunakan `published = false` (unpublish) untuk menjaga integritas data riwayat pembelian.
12. Webhook Midtrans wajib divalidasi signature key sebelum mengubah status transaksi (mencegah spoofing).
13. Validasi input wajib dilakukan di **dua sisi**: client (UX cepat) dan server via Zod (keamanan sesungguhnya).
14. Nomor transaksi & nomor sertifikat bersifat permanen dan tidak pernah dipakai ulang.
15. Review hanya dapat diberikan oleh member yang memiliki `Enrollment` aktif pada course tersebut (tidak harus sudah selesai 100%); 1 member hanya 1 review per course, dapat diedit tapi tidak bisa duplikat.
16. `Course.avgRating` & `Course.reviewCount` dihitung ulang otomatis setiap ada review baru/diedit/dihapus, dan hanya menghitung review dengan `isHidden = false`.
17. Leaderboard dihitung berdasarkan `LessonProgress.completedAt` dalam rentang **bulan berjalan** (reset otomatis tiap awal bulan); metrik utama total menit belajar, metrik sekunder jumlah lesson selesai. Leaderboard publik hanya menampilkan nama tampilan & avatar, **tidak** menampilkan email.
18. Login via Google: jika email dari akun Google sudah terdaftar secara manual sebelumnya, sistem menautkan `googleId` ke akun yang sudah ada (bukan membuat user baru) untuk mencegah duplikasi akun.

---

## 18. Format Nomor Transaksi & Sertifikat

**Nomor Transaksi:**
```
TRX-[YYYYMMDD]-[6 digit urut/random]
Contoh: TRX-20260923-000123
```

**Nomor Sertifikat:**
```
CERT-[TAHUN]-[5 digit urut]
Contoh: CERT-2026-00042
```

**Cara generate (hindari race condition saat transaksi bersamaan):**
- Gunakan Prisma `$transaction` dengan penghitungan urutan terkunci, atau kombinasi timestamp + random string (mis. `nanoid`), agar aman tanpa perlu locking manual di level aplikasi.

---

## 19. Spesifikasi Sertifikat

- **Ukuran:** A4 landscape (standar sertifikat digital).
- **Konten wajib:** logo platform, judul "SERTIFIKAT KELULUSAN", nama lengkap member, nama course, skor akhir quiz, nomor sertifikat, tanggal terbit, nama penandatangan (platform/admin).
- **Opsional:** QR code berisi link verifikasi cepat ke `/verifikasi-sertifikat?no=CERT-xxxx`.
- **Generate PDF:** dibuat di backend Express dari template HTML menggunakan library seperti `pdf-lib` atau `puppeteer`, hasil disimpan (Cloudinary/local) dan link-nya disimpan di `Certificate.fileUrl`.
- **Verifikasi publik:** input nomor sertifikat → backend cek ke DB → tampilkan status valid (nama, course, tanggal) atau "tidak ditemukan", tanpa mengekspos data sensitif tambahan.

---

## 20. Keamanan Sistem

- Password di-hash dengan bcrypt (salt round ≥ 10), tidak pernah disimpan/dikirim dalam bentuk plain text.
- JWT access token dengan masa berlaku wajar (mis. 7 hari). **Keputusan final (wajib diikuti frontend & backend):** token dikirim via header `Authorization: Bearer <token>`, disimpan di **localStorage** sisi client — bukan httpOnly cookie. Ini dipilih agar backend tetap stateless murni (tidak perlu setup CORS `credentials`/cookie cross-domain, yang rawan salah konfigurasi ketika frontend & backend di-hosting terpisah dan dibangun oleh AI/tim berbeda). Risiko XSS localStorage diterima untuk skala MVP; mitigasi lain: hindari `dangerouslySetInnerHTML`/eval di frontend.
- Middleware `authenticate` (verifikasi token) & `authorize(role)` wajib di semua route privat (lihat matrix §16).
- Validasi Zod di **setiap** request body backend, bukan hanya di frontend.
- Endpoint webhook Midtrans wajib memverifikasi signature key sebelum memproses data.
- Login Google: id_token dari Google Identity Services **wajib** diverifikasi di backend menggunakan `google-auth-library` (`verifyIdToken`) sebelum membuat sesi/JWT — jangan pernah mempercayai data user dari payload frontend tanpa verifikasi server-side.
- CORS dikonfigurasi hanya untuk origin frontend yang sah.
- Upload file (thumbnail course, foto profil) divalidasi tipe & ukuran di backend (Multer `fileFilter` + `limits`), bukan hanya di client.
- Rate limiting pada endpoint login/register — Could have, mencegah brute force.

---

## 21. Arsitektur Teknis

```text
┌──────────────────────────────────────────┐
│              Browser (User)                │
│  React + TypeScript (Vite) SPA (.tsx)      │
│  Tailwind CSS                               │
│  Lenis (smooth scroll) + GSAP/ScrollTrigger │
│  (animasi) + Axios (Fetch API + JWT)        │
│  Google Identity Services (tombol login)    │
└───────────────────┬─────────────────────────┘
                     │ HTTPS (REST API, typed)
                     ▼
┌──────────────────────────────────────────┐
│         Express + TypeScript API (.ts)      │
│  Router → Middleware (auth, Zod validasi)   │
│         → Controller → Service              │
└───┬─────────────┬───────────────┬───────┬───┘
    │             │               │       │
    ▼             ▼               ▼       ▼
Prisma ORM   Midtrans Snap  Cloudinary/  google-auth-library
(typed client)  (Payment)   Multer (file)  (verifikasi id_token)
    │
    ▼
PostgreSQL Database
```

**Deskripsi layer:**
- **Frontend Layer:** React + TypeScript (Vite), file `.tsx`, dengan Tailwind untuk styling. Data fetching memakai Axios + JWT di header `Authorization`, tipe response API didefinisikan sebagai TypeScript interface (idealnya disamakan dengan tipe request/response di §29). Animasi: GSAP (+ ScrollTrigger) untuk reveal & hero text, Lenis untuk smooth scroll — dipakai selektif, tidak di semua elemen. Tombol "Login dengan Google" memakai script Google Identity Services, mengirim `id_token` ke backend.
- **Backend Layer:** Express + TypeScript, file `.ts`, dengan struktur MVC (routes → controller → service), validasi request via Zod (tipe hasil validasi otomatis konsisten berkat `z.infer`), autentikasi via JWT + bcrypt. Business logic kritikal (generate nomor transaksi/sertifikat, hitung progress, grading quiz, verifikasi webhook, verifikasi id_token Google, agregasi leaderboard & rating) dijalankan di service layer backend, bukan di frontend.
- **Database Layer:** PostgreSQL diakses lewat Prisma ORM; **Prisma Client otomatis meng-generate tipe TypeScript** dari `schema.prisma` (mis. `Prisma.CourseGetPayload`), dipakai langsung di service layer agar tipe data selalu sinkron dengan struktur database. Seluruh perubahan struktur database wajib lewat `prisma migrate` (tercatat, dapat di-rollback).
- **Payment Layer:** Midtrans Snap (Sandbox untuk development, Production untuk go-live).
- **Storage Layer:** Cloudinary (atau setara) untuk thumbnail course & file PDF sertifikat.
- **Auth Layer (Google):** `google-auth-library` di backend memverifikasi `id_token` yang dikirim frontend sebelum membuat/menautkan user & menerbitkan JWT sendiri (arsitektur tetap stateless, tidak pakai session Passport).

---

## 22. Strategi Testing

| Jenis Testing | Cakupan |
|---|---|
| Unit Testing | Fungsi utilitas: hitung progress course, grading quiz, format nomor transaksi/sertifikat, kalkulasi `avgRating`, agregasi leaderboard |
| Integration Testing | Alur checkout → webhook → enrollment; alur lesson selesai → quiz → sertifikat; alur submit review → `avgRating` ter-update; alur login Google baru vs akun tertaut |
| Authorization Testing | Pastikan endpoint admin **tidak bisa** diakses oleh member/publik; member tidak bisa akses data enrollment/transaksi member lain; member tanpa Enrollment **tidak bisa** submit review |
| Payment Testing | Simulasi status Midtrans Sandbox (settlement, deny, expire, cancel) dan pastikan status Transaction ter-update benar |
| UAT (User Acceptance Testing) | Simulasi calon member: register/login (email & Google) → beli/enroll → belajar → quiz → sertifikat → beri review; simulasi admin: CRUD penuh + cek statistik + moderasi review |
| Responsive Testing | Manual check di breakpoint 360px, 768px, 1280px |
| Accessibility Testing | Kontras warna, navigasi keyboard, `prefers-reduced-motion` untuk animasi GSAP/Lenis |
| Type-Safety Testing | `tsc --noEmit` di frontend **dan** backend, serta `npm run build` lulus tanpa error TypeScript sebelum deploy |
| Edge Case Testing | Double enroll, webhook diterima 2x (idempotency by `midtransOrderId`), quiz retry setelah lulus, harga course berubah saat checkout berjalan, upload thumbnail file besar/salah format, double review pada course yang sama, email Google yang sudah terdaftar manual |

---

## 23. Rencana Deployment

| Komponen | Platform |
|---|---|
| Frontend (React + TypeScript build) | Vercel / Netlify |
| Backend (Express + TypeScript API) | Railway / Render |
| Database (PostgreSQL) | Supabase / Railway Postgres / Aiven (free tier cukup untuk skala tugas) |
| Storage (thumbnail, PDF) | Cloudinary |
| Payment | Midtrans Sandbox (development) → Production (bila go-live nyata) |
| Auth pihak ketiga | Google Cloud Console (OAuth Client ID untuk Google Identity Services) |
| Environment | `development` (`.env` lokal), `production` (env variable di dashboard hosting) |

**Checklist sebelum go-live:**
- [ ] Semua endpoint privat diuji middleware auth & role-nya.
- [ ] Environment variable (JWT secret, DB URL, Midtrans key, Cloudinary key, Google OAuth Client ID) sudah di-set di hosting.
- [ ] Authorized origin & redirect URI Google OAuth sudah didaftarkan sesuai domain production.
- [ ] Data dummy testing sudah dihapus/direset.
- [ ] Webhook Midtrans sudah dikonfigurasi ke URL production backend.
- [ ] Migration Prisma sudah dijalankan di database production.

---

## 24. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Webhook Midtrans diproses lebih dari 1 kali | Enrollment ganda / data tidak konsisten | Cek idempotency berdasarkan `midtransOrderId` unik sebelum memproses ulang |
| Race condition saat generate nomor transaksi/sertifikat | Nomor duplikat | Gunakan Prisma transaction / kombinasi timestamp + random string, bukan penghitungan sederhana di client |
| Harga course berubah saat proses checkout berjalan | Member membayar jumlah yang tidak sesuai | `Transaction.amount` disimpan sebagai snapshot saat checkout dibuat, bukan re-fetch harga terbaru |
| Video YouTube dihapus/di-private oleh pemilik | Materi tidak bisa diakses | Admin melakukan pengecekan berkala tautan video |
| Sertifikat dipalsukan pihak lain | Kredibilitas platform turun | Nomor sertifikat unik + halaman verifikasi publik (§11.8) |
| Traffic tinggi saat promo besar-besaran | Website lambat/down | Index pada kolom yang sering difilter (status, categoryId), optimasi query list course |

---

## 25. Success Metrics / KPI

- ≥ 95% transaksi berhasil diproses tanpa error teknis.
- Waktu rata-rata checkout ≤ 2 menit.
- 0 insiden nomor transaksi/sertifikat duplikat.
- Waktu admin mem-publish course baru ≤ 10 menit.
- Website dapat diakses lancar dari perangkat mobile tanpa layout rusak.
- 0 insiden kebocoran password/JWT.
- 0 error TypeScript (`tsc --noEmit` bersih) di setiap build production, frontend maupun backend.

---

## 26. Deliverables

1. PRD (dokumen ini).
2. ERD & `schema.prisma` final + file migration.
3. Source code React (frontend) & Express (backend).
4. Database PostgreSQL siap pakai + seed data dummy (course, kategori, quiz contoh).
5. Website LMS publik yang live.
6. Dashboard admin yang live & terproteksi.
7. Dokumentasi API ringkas (daftar endpoint + contoh request/response).
8. Panduan penggunaan singkat untuk admin (could have).

---

## 27. Lampiran

### 27.1 Ringkasan MVP Checklist

**Publik**
- [ ] Landing Page (hero animasi, marquee, kategori, course terbaru, testimoni, FAQ)
- [ ] Katalog Kelas + filter & search
- [ ] Detail Kelas + preview gratis + rating & review
- [ ] Leaderboard siswa teraktif bulanan
- [ ] Verifikasi Sertifikat

**Member**
- [ ] Register/Login (JWT) via email/password **dan** Google OAuth
- [ ] Enroll kelas gratis
- [ ] Checkout & bayar kelas berbayar (Midtrans Sandbox)
- [ ] Player belajar + tracking progress per lesson (`LessonProgress`)
- [ ] Kerjakan Quiz + auto-grading
- [ ] Unduh Sertifikat
- [ ] Riwayat Transaksi
- [ ] Beri Rating & Review pada course yang diikuti

**Admin**
- [ ] Login (role admin)
- [ ] Dashboard statistik penjualan
- [ ] CRUD Course, Lesson, Kategori
- [ ] Atur Harga & Status Gratis/Berbayar
- [ ] CRUD Quiz & Soal
- [ ] List Member & Transaksi
- [ ] Moderasi Review (sembunyikan/hapus)

**Backend**
- [ ] Skema database + relasi (`schema.prisma`) sesuai §15, termasuk `LessonProgress` & `Review`
- [ ] Middleware `authenticate` & `authorize(role)` di semua route privat
- [ ] Endpoint checkout + webhook Midtrans (dengan validasi signature)
- [ ] Endpoint verifikasi Google id_token (`google-auth-library`) + auto-link akun
- [ ] Endpoint agregasi Leaderboard per bulan
- [ ] Generator nomor transaksi & sertifikat (anti race condition)
- [ ] Generator PDF sertifikat

### 27.2 Tech Stack Final

| Komponen | Pilihan | Alasan |
|---|---|---|
| Frontend | React + **TypeScript** (Vite) + Fetch/Axios + JWT | Wajib dari dosen; TypeScript menambah keamanan tipe di sisi client |
| Styling | Tailwind CSS | Cepat membangun UI bergaya buildwithangga.com |
| Smooth Scroll | Lenis | Scroll halus di halaman publik |
| Animasi | GSAP + ScrollTrigger | Animasi hero text, scroll reveal, counter statistik/leaderboard |
| Backend | Express + **TypeScript** | Belajar MVC & Middleware dari nol, tipe data konsisten dengan Prisma Client |
| ORM | Prisma | Migration otomatis, type-safe, auto-generate tipe TypeScript |
| Database | PostgreSQL | RDBMS kuat untuk relasi transaksi & enrollment |
| Auth | JWT + bcrypt | Autentikasi stateless, password ter-hash |
| Auth Pihak Ketiga | Google Identity Services + google-auth-library | Login cepat 1 klik tanpa password baru |
| Validasi | Zod | Validasi request body di Express, tipe hasil validasi otomatis via `z.infer` |
| Upload File | Multer + Cloudinary | Thumbnail course, PDF sertifikat |
| Payment | Midtrans Snap (Sandbox) | Sesuai roadmap tugas (opsional/mode tes) |
| Video Materi | YouTube embed (iframe) | Tidak perlu simpan file video sendiri |

### 27.3 Referensi Desain
- **buildwithangga.com** — acuan utama gaya UI/UX & fitur gamifikasi: hero animasi, marquee logo tools, course card + rating, leaderboard, FAQ accordion.
- **santrikoding.com** — acuan model bisnis single-provider (bukan marketplace multi-mentor).

### 27.4 Contoh Kategori Kelas (Fokus Bahasa Inggris)
Grammar, Vocabulary, Speaking, Listening, Writing, Persiapan TOEFL, Persiapan IELTS, Business English, English for Beginners, English Conversation. Level course dapat memakai label sederhana (Pemula/Menengah/Mahir) dengan opsi mencantumkan referensi level CEFR (A1–C2) di deskripsi course.

---

## 28. Design System / UI Specification

> Section ini dibuat khusus agar **AI/developer frontend** punya semua data visual yang dibutuhkan tanpa harus menebak — warna, tipografi, ikon, komponen, sampai microcopy. Kode warna & font di bawah adalah **rekomendasi konkret bergaya buildwithangga.com** (bersih, modern, dengan ungu sebagai warna utama) berdasarkan pengamatan langsung struktur & nuansa visual situs tersebut — bukan hasil color-picking presisi dari CSS asli mereka (butuh inspect element manual untuk itu). Tim bebas menyesuaikan asal konsisten dipakai di seluruh halaman.

### 28.1 Filosofi Desain
Bersih, modern, banyak *whitespace*, terasa terpercaya (karena menjual produk berbayar), dengan **ungu sebagai warna utama** (kesan kreatif, modern, mendukung branding edukasi bahasa) dan biru sebagai warna aksen pelengkap, plus sedikit gradient di elemen CTA/hero — meniru kesan BuildWithAngga: rapi, ramah, tidak kaku.

### 28.2 Palet Warna

| Token | Hex | Pemakaian |
|---|---|---|
| `primary-50` | `#F5F3FF` | Background section terang/hover halus |
| `primary-100` | `#EDE9FE` | Background badge/chip terang |
| `primary-500` | `#8B5CF6` | Warna dasar brand, link, ikon aktif |
| `primary-600` | `#7C3AED` | Tombol utama (default state) |
| `primary-700` | `#6D28D9` | Tombol utama (hover/active) |
| `accent-500` | `#3B82F6` | Aksen biru — elemen pelengkap, ikon sekunder |
| `accent-600` | `#2563EB` | Aksen biru hover |
| `gray-50` | `#F9FAFB` | Background halaman |
| `gray-100` | `#F3F4F6` | Background card alternatif |
| `gray-200` | `#E5E7EB` | Border/divider |
| `gray-500` | `#6B7280` | Teks sekunder/caption |
| `gray-700` | `#374151` | Teks body |
| `gray-900` | `#111827` | Teks heading |
| `success` | `#22C55E` | Badge "Gratis", status Diterima/Sukses |
| `warning` | `#F59E0B` | Status pending, level "Menengah" |
| `danger` | `#EF4444` | Status gagal/error, tombol hapus |
| `info` | `#0EA5E9` | Notifikasi informasi netral |
| Gradient Hero | `linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)` | Background hero section, badge "Premium" |

**Dark mode:** tidak wajib di MVP (Could have) — bila ditambah, gunakan `gray-900` sebagai background & `gray-50` sebagai teks, warna brand tetap sama.

### 28.3 Tipografi

| Elemen | Font | Ukuran (Desktop / Mobile) | Weight |
|---|---|---|---|
| Font Heading & CTA | **Plus Jakarta Sans** (Google Fonts) | — | 600–800 |
| Font Body | **Inter** (Google Fonts) | — | 400–500 |
| H1 | Plus Jakarta Sans | 40px / 28px | 800 |
| H2 | Plus Jakarta Sans | 32px / 24px | 700 |
| H3 | Plus Jakarta Sans | 24px / 20px | 600 |
| H4 | Plus Jakarta Sans | 20px / 18px | 600 |
| Body Large | Inter | 18px / 16px | 400 |
| Body | Inter | 16px / 14px | 400 |
| Caption/Small | Inter | 14px / 12px | 400 |
| Tombol | Plus Jakarta Sans | 16px | 600 |

Line-height: heading 1.2–1.3×, body 1.5–1.6×.

### 28.4 Icon Library
**Lucide React** (`lucide-react`) — stroke-based, ringan, konsisten dengan ekosistem Tailwind + React modern.

| Konteks | Ikon |
|---|---|
| Kategori Grammar | `BookOpen` |
| Kategori Speaking | `Mic` |
| Kategori Listening | `Headphones` |
| Kategori Writing | `PenLine` |
| Lesson selesai | `CheckCircle2` |
| Lesson terkunci | `Lock` |
| Sertifikat | `Award` |
| Leaderboard | `Trophy` |
| Rating | `Star` (filled/outline) |
| Harga/Beli | `ShoppingCart` |
| Progress/Waktu | `Clock` |
| Notifikasi sukses | `CheckCircle2` (warna success) |
| Notifikasi gagal | `XCircle` (warna danger) |

Ukuran standar: 16px (inline teks), 20–24px (tombol/navbar), 32–48px (ikon kategori/feature card).

### 28.5 Spacing, Radius & Shadow
- **Spacing scale:** ikuti default Tailwind (4px basis): `1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px.
- **Border radius:** Card = `rounded-xl` (12px), Tombol = `rounded-lg` (8px), Badge/Pill = `rounded-full`, Input = `rounded-md` (6px).
- **Shadow:** Card default `shadow-sm`, Card hover `shadow-md`, Modal/Dropdown `shadow-xl`.
- **Container:** max-width `1280px` (`max-w-7xl`), padding horizontal 16px (mobile) – 24px (desktop).

### 28.6 Komponen UI Kunci

| Komponen | Spesifikasi Visual |
|---|---|
| Tombol Primary | Background `primary-600`, teks putih, `rounded-lg`, padding 12px 24px, hover `primary-700` + transisi 150ms |
| Tombol Outline | Border `primary-600` 1.5px, teks `primary-600`, background transparan, hover background `primary-50` |
| Course Card | `rounded-xl`, `shadow-sm`→`shadow-md` on hover, thumbnail rasio 16:9, badge Gratis (hijau)/Premium (gradient ungu, `primary-500`→`accent-500`) di pojok kiri-atas thumbnail, rating bintang + harga di bawah judul |
| Badge Level | Pill kecil: Pemula (hijau soft `bg-green-50 text-green-700`), Menengah (kuning soft), Mahir (ungu soft `bg-violet-50 text-violet-700`) |
| Navbar | Putih dengan `backdrop-blur`, sticky top, `shadow-sm` muncul saat halaman di-scroll |
| Progress Bar | `rounded-full`, warna `primary-500`, animasi lebar (transition-width 300ms) |
| Toast Notifikasi | Posisi top-right, ikon sesuai jenis (sukses/gagal/info), auto-dismiss 3–4 detik |

### 28.7 Microcopy / Teks UI Standar

| Konteks | Teks |
|---|---|
| CTA hero | "Lihat Semua Kelas" |
| Tombol beli | "Beli Sekarang" |
| Tombol mulai (gratis) | "Mulai Belajar" |
| Tombol lanjut | "Lanjutkan Belajar" |
| Tombol daftar | "Daftar Gratis" |
| Tombol login | "Masuk" |
| Tombol Google | "Masuk dengan Google" |
| Placeholder email | "Masukkan email kamu" |
| Placeholder password | "Minimal 8 karakter" |
| Error login gagal | "Email atau password salah." |
| Error email terdaftar | "Email ini sudah terdaftar. Coba masuk atau gunakan email lain." |
| Toast bayar sukses | "Pembayaran berhasil! Selamat belajar 🎉" |
| Toast bayar gagal | "Pembayaran gagal atau dibatalkan. Silakan coba lagi." |
| Label progress | "{progress}% selesai" |
| Empty state "Kelas Saya" | "Kamu belum mengikuti kelas apapun. Yuk mulai belajar!" |
| Tombol tandai selesai | "Tandai Selesai" |
| Tombol kerjakan quiz | "Kerjakan Quiz" |
| Quiz lulus | "Selamat, kamu lulus dengan skor {score}! 🎓" |
| Quiz gagal | "Skor kamu {score}, belum mencapai nilai minimum ({passingGrade}). Yuk coba lagi!" |
| Tombol ulangi quiz | "Ulangi Quiz" |
| Tombol unduh sertifikat | "Unduh Sertifikat" |
| Verifikasi sertifikat valid | "Sertifikat ini valid ✅" |
| Verifikasi sertifikat invalid | "Nomor sertifikat tidak ditemukan." |
| CTA review | "Beri Rating & Ulasan" |
| Placeholder komentar review | "Ceritakan pengalaman belajarmu di kelas ini..." |
| Empty state review | "Belum ada ulasan untuk kelas ini. Jadilah yang pertama!" |
| Judul leaderboard | "Papan Peringkat Siswa Teraktif" |
| Subjudul leaderboard | "Peringkat direset setiap awal bulan" |
| Toast admin sukses simpan | "Berhasil disimpan" |
| Toast admin sukses hapus | "Berhasil dihapus" |
| Toast admin gagal | "Terjadi kesalahan, silakan coba lagi." |
| Konfirmasi hapus | "Yakin ingin menghapus {item} ini? Tindakan ini tidak bisa dibatalkan." |

### 28.8 Referensi Visual dari buildwithangga.com
Struktur & elemen yang diadopsi dari pengamatan langsung situs tersebut: layout hero + marquee logo berjalan, gaya course card (thumbnail + badge + rating + harga), whitespace lega antar section, sudut membulat (`rounded-xl`) pada card, FAQ accordion, dan susunan navbar sticky. Nuansa warna dengan **ungu sebagai warna utama** (biru sebagai pelengkap) dipilih untuk mendekati kesan visual serupa sekaligus memberi identitas brand yang khas.

---

## 29. API Specification Lengkap

> Section ini melengkapi Matrix Otorisasi (§16) dengan **kontrak request/response** tiap endpoint, agar AI/developer backend tidak perlu menebak struktur JSON. Base URL: `/api/v1`. Semua response mengikuti format standar di §29.1.

### 29.1 Konvensi Umum

**Format response sukses:**
```json
{ "success": true, "data": { } }
```

**Format response gagal:**
```json
{ "success": false, "message": "Pesan error singkat", "errors": { "field": "detail error validasi (opsional, dari Zod)" } }
```

**HTTP Status Code:** `200` OK, `201` Created, `400` Bad Request (validasi gagal), `401` Unauthorized (token tidak ada/invalid), `403` Forbidden (role tidak sesuai), `404` Not Found, `409` Conflict (data duplikat), `500` Internal Server Error.

**Auth header:** `Authorization: Bearer <JWT>` untuk semua endpoint privat.

### 29.2 Auth

**`POST /auth/register`**
```json
// Request
{ "name": "Dimas Pratama", "email": "dimas@mail.com", "password": "password123" }

// Response 201
{ "success": true, "data": { "user": { "id": "uuid", "name": "Dimas Pratama", "email": "dimas@mail.com", "role": "MEMBER" }, "token": "jwt..." } }

// Response 409
{ "success": false, "message": "Email sudah terdaftar" }
```

**`POST /auth/login`**
```json
// Request
{ "email": "dimas@mail.com", "password": "password123" }

// Response 200
{ "success": true, "data": { "user": { "id": "uuid", "name": "Dimas Pratama", "role": "MEMBER" }, "token": "jwt..." } }

// Response 401
{ "success": false, "message": "Email atau password salah" }
```

**`POST /auth/google`**
```json
// Request
{ "credential": "<google_id_token>" }

// Response 200 (sama dengan login biasa)
{ "success": true, "data": { "user": { "id": "uuid", "name": "Dimas Pratama", "role": "MEMBER" }, "token": "jwt..." } }
```

**`GET /me`** — dipanggil frontend saat aplikasi pertama kali dimuat (restore session dari token tersimpan)
```json
// Response 200
{ "success": true, "data": { "id": "uuid", "name": "Dimas Pratama", "email": "dimas@mail.com", "role": "MEMBER", "avatarUrl": null } }

// Response 401 (token tidak valid/kadaluarsa)
{ "success": false, "message": "Sesi tidak valid, silakan login kembali" }
```

### 29.3 Courses (Publik)

**`GET /courses?category=grammar&level=Pemula&isFree=true&search=toefl&page=1&limit=12`**
```json
// Response 200
{
  "success": true,
  "data": {
    "courses": [
      { "id": "uuid", "title": "Grammar Dasar untuk Pemula", "slug": "grammar-dasar-pemula", "thumbnailUrl": "...", "price": 0, "isFree": true, "level": "Pemula", "avgRating": 4.8, "reviewCount": 120 }
    ],
    "pagination": { "page": 1, "limit": 12, "total": 45, "totalPages": 4 }
  }
}
```

**`GET /courses/:slug`**
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid", "title": "Persiapan TOEFL ITP", "description": "...", "price": 150000, "isFree": false,
    "level": "Menengah", "avgRating": 4.7, "reviewCount": 89,
    "lessons": [ { "id": "uuid", "title": "Pengenalan Structure & Written Expression", "order": 1, "durationMinutes": 15, "isPreview": true, "locked": false } ],
    "hasQuiz": true,
    "isEnrolled": false
  }
}
```

### 29.4 Enrollment (Course Gratis)

**`POST /enrollments`**
```json
// Request
{ "courseId": "uuid" }

// Response 201
{ "success": true, "data": { "enrollment": { "id": "uuid", "courseId": "uuid", "progress": 0 } } }

// Response 409 (sudah enroll)
{ "success": false, "message": "Kamu sudah terdaftar di kelas ini" }
```

### 29.5 Transaction / Payment

**`POST /transactions/checkout`**
```json
// Request
{ "courseId": "uuid" }

// Response 201
{ "success": true, "data": { "transactionNumber": "TRX-20260923-000123", "snapToken": "abc123...", "redirectUrl": "https://app.sandbox.midtrans.com/snap/v2/vtweb/abc123" } }
```

**`POST /transactions/webhook`** (dipanggil server Midtrans, bukan client)
```json
// Request (contoh field penting dari Midtrans)
{ "order_id": "TRX-20260923-000123", "transaction_status": "settlement", "gross_amount": "150000.00", "signature_key": "..." }

// Response 200 (selalu balas cepat ke Midtrans)
{ "success": true }
```

**`GET /me/transactions`**
```json
// Response 200
{ "success": true, "data": { "transactions": [ { "transactionNumber": "TRX-...", "courseTitle": "...", "amount": 150000, "status": "success", "paidAt": "2026-09-20T10:00:00Z" } ] } }
```

### 29.6 Belajar (Lesson Progress)

**`PATCH /lessons/:id/complete`**
```json
// Response 200
{ "success": true, "data": { "lessonId": "uuid", "courseProgress": 45 } }
```

### 29.7 Quiz

**`GET /quiz/:courseId`** (tanpa `correctOption` di response, demi keamanan)
```json
{ "success": true, "data": { "quizId": "uuid", "passingGrade": 70, "questions": [ { "id": "uuid", "text": "Choose the correct form: She ___ to school every day.", "options": ["go", "goes", "going", "gone"] } ] } }
```

**`POST /quiz/:id/submit`**
```json
// Request
{ "answers": [ { "questionId": "uuid", "selectedOption": "goes" } ] }

// Response 200 (lulus)
{ "success": true, "data": { "score": 85, "passed": true, "certificate": { "certNumber": "CERT-2026-00042" } } }

// Response 200 (gagal)
{ "success": true, "data": { "score": 60, "passed": false, "certificate": null } }
```

### 29.8 Sertifikat

**`GET /certificates/verify/:certNumber`**
```json
// Response 200 (valid)
{ "success": true, "data": { "valid": true, "name": "Dimas Pratama", "courseTitle": "Persiapan TOEFL ITP", "issuedAt": "2026-09-20" } }

// Response 404
{ "success": false, "message": "Sertifikat tidak ditemukan" }
```

### 29.9 Review

**`POST /courses/:id/reviews`**
```json
// Request
{ "rating": 5, "comment": "Materinya jelas dan mudah dipahami!" }

// Response 201
{ "success": true, "data": { "id": "uuid", "rating": 5, "comment": "Materinya jelas dan mudah dipahami!" } }

// Response 403 (belum enroll)
{ "success": false, "message": "Kamu harus mengikuti kelas ini sebelum memberi ulasan" }
```

**`GET /courses/:id/reviews?page=1`**
```json
{ "success": true, "data": { "avgRating": 4.7, "reviewCount": 89, "reviews": [ { "userName": "Dimas P.", "rating": 5, "comment": "...", "createdAt": "2026-09-15" } ], "pagination": { "page": 1, "totalPages": 8 } } }
```

### 29.10 Leaderboard

**`GET /leaderboard?month=2026-09`**
```json
{
  "success": true,
  "data": {
    "period": "2026-09",
    "rankings": [
      { "rank": 1, "name": "Dimas P.", "avatarUrl": "...", "totalLessonsCompleted": 42, "totalMinutesLearned": 630 }
    ]
  }
}
```

### 29.11 Upload File (Thumbnail Course)

**Keputusan final (wajib diikuti, ini titik sambung paling rawan beda asumsi antara AI frontend & backend):** upload file **selalu lewat backend**, bukan langsung dari frontend ke Cloudinary. Alasan: validasi tipe/ukuran file terpusat di server (§20), dan frontend AI tidak perlu tahu credential Cloudinary sama sekali.

**Alur:** Frontend kirim `multipart/form-data` berisi file gambar ke endpoint di bawah → backend (Multer) validasi & upload ke Cloudinary → backend balas URL hasil upload → frontend pakai URL itu saat mengisi field `thumbnailUrl` di form create/edit course.

**`POST /admin/upload`** (`Content-Type: multipart/form-data`, field name: `file`)
```json
// Response 201
{ "success": true, "data": { "url": "https://res.cloudinary.com/.../course-thumbnail-abc123.jpg" } }

// Response 400 (tipe/ukuran tidak valid)
{ "success": false, "message": "File harus berupa gambar (jpg/png) maksimal 2MB" }
```

### 29.12 Admin — Contoh Pola CRUD (pola sama untuk Lesson, Category, Quiz, Question)

**`POST /admin/courses`**
```json
// Request (thumbnailUrl diisi dari hasil endpoint upload di §29.11, bukan file mentah)
{ "title": "Business English Essentials", "description": "...", "categoryId": "uuid", "thumbnailUrl": "https://res.cloudinary.com/.../course-thumbnail-abc123.jpg", "price": 200000, "isFree": false, "level": "Menengah" }

// Response 201
{ "success": true, "data": { "id": "uuid", "slug": "business-english-essentials" } }
```

**`GET /admin/stats`**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 45000000,
    "totalTransactions": 320,
    "totalMembers": 1520,
    "totalPublishedCourses": 38,
    "topCourses": [ { "title": "Persiapan TOEFL ITP", "enrollmentCount": 210 } ]
  }
}
```

### 29.13 Catatan Kontrak Lintas AI (Backend & Frontend Dibangun Terpisah)

> Section ini khusus untuk skenario backend & frontend dibangun oleh **AI/tool berbeda dalam sesi terpisah** (mis. backend oleh Claude, frontend oleh Gemini) — keduanya tidak saling tahu apa yang satu sama lain kerjakan. Nilai & konvensi berikut **wajib sama persis** di kedua sisi agar hasilnya nyambung tanpa perlu debugging integrasi manual:

| Hal yang harus sama persis | Nilai/Konvensi yang dipakai |
|---|---|
| Format response API | `{ success, data }` / `{ success, message, errors }` — lihat §29.1 |
| Cara kirim token | Header `Authorization: Bearer <token>`, **bukan** cookie (lihat §20) |
| Tempat simpan token di client | `localStorage`, key bebas asal konsisten (mis. `lms_token`) |
| Base path API | `/api/v1` di depan semua endpoint |
| Nama field JSON | Mengikuti persis nama kolom di ERD §15 (camelCase, mis. `thumbnailUrl`, `avgRating`, `isFree`) — jangan diterjemahkan/diubah ke istilah lain di frontend |
| Google OAuth Client ID | **Satu nilai yang sama** dipakai frontend (inisialisasi tombol Google Identity Services) dan backend (`audience` saat `verifyIdToken`) — ambil dari Google Cloud Console yang sama |
| Upload file | Selalu lewat backend (`POST /admin/upload`), frontend tidak pernah upload langsung ke Cloudinary (§29.11) |
| Cara enum ditulis | Selalu UPPERCASE untuk role (`MEMBER`/`ADMIN`) dan status transaksi lowercase (`pending`/`success`/`failed`/`expired`) — ikuti persis contoh di §29, jangan ubah casing |

**Rekomendasi praktis:** saat memberi prompt ke masing-masing AI, sertakan **section §29 (API Specification) secara utuh** ke kedua sisi (bukan cuma bagian yang "relevan") — supaya AI backend tahu persis apa yang frontend harapkan, dan AI frontend tahu persis apa yang backend sediakan, walau mereka bekerja di sesi/tool yang berbeda dan tidak saling berkomunikasi langsung.
