# PRODUCT REQUIREMENT DOCUMENT (PRD) — LENGKAP
## Website LMS Berbayar — Kursus Bahasa Inggris Online

| Item | Keterangan |
|---|---|
| Versi Dokumen | **3.1** — Lengkap + fokus niche Bahasa Inggris, Leaderboard, Rating & Review, Login Google, **Roadmap Belajar, Dark Mode, Spesifikasi Payment Gateway** |
| Status | Draft — siap untuk development berbantuan AI |
| Platform | Web Application (Responsive) |
| Jenis | Full-Stack Web Application |
| Fokus Produk | LMS berbayar yang **khusus** menyediakan kursus **Bahasa Inggris** (Grammar, Vocabulary, Speaking, Listening, Writing, persiapan TOEFL/IELTS, Business English, dsb) — bukan LMS multi-topik umum |
| Tech Stack | **React + TypeScript (Vite) + Fetch/Axios API + JWT**, **Tailwind CSS**, **Lenis** (smooth scroll), **GSAP + ScrollTrigger** (animasi), **Express + TypeScript** (MVC), **Prisma ORM**, **PostgreSQL**, **bcrypt**, **Zod**, **Multer/Cloudinary**, **Midtrans Snap (Sandbox)**, **Google Identity Services + google-auth-library** (login Google) |
| Referensi Produk | buildwithangga.com (UI/UX, fitur gamifikasi & roadmap/career-path), santrikoding.com (model bisnis single-provider & struktur roadmap multi-modul), cakap.com (struktur pencapaian & metode pembayaran) |

> Dokumen ini dibuat lengkap agar bisa langsung dipakai sebagai basis pembangunan aplikasi — termasuk untuk dikerjakan/di-generate dengan bantuan AI: user stories, functional requirement bernomor & prioritas, ERD detail dengan tipe data, business rules, matrix otorisasi API, state diagram, hingga rencana testing & deployment. PRD ini fokus pada **apa** yang harus dibangun & **mengapa**, sebagai satu-satunya dokumen acuan (tidak ada dokumen planning terpisah).

### Changelog v3.1 (dari v3.0)

| Perubahan | Bagian Terkait |
|---|---|
| **Fitur baru: Roadmap Belajar** — jalur belajar lintas-kelas yang menggabungkan beberapa Course berurutan dengan progres gabungan | §4, §5, §7, §8 (FR-39–FR-41), §10, §11.11–11.12, §12.10, §13.4, §15, §16, §17, §22, §27, §29.10 |
| **Spesifikasi resmi Payment Gateway** — kanal pembayaran Midtrans Snap yang diaktifkan dirinci (sebelumnya hanya disebut "Midtrans Snap" tanpa rincian kanal) | §21.1 (baru), §17, §29.5 |
| **Dark Mode dinaikkan jadi Must have** di seluruh halaman (sebelumnya "Could have" di v3.0) | §8 (FR-43), §28.2 (token warna dark mode) |
| **Filter cepat kelas** (Gratis/Populer/Trending/Terbaru) pada listing kelas di landing page | §8 (FR-42), §11.1 |
| Frontend referensi implementasi sudah dibangun — lihat project terlampir | — |

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
14. State Diagram (Transaksi, Progress, Quiz, Sertifikat, Roadmap)
15. Data Model / ERD Lengkap
16. Otorisasi & Matrix Akses API
17. Business Rules & Validasi
18. Format Nomor Transaksi & Sertifikat
19. Spesifikasi Sertifikat
20. Keamanan Sistem
21. Arsitektur Teknis & Spesifikasi Payment Gateway
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

Website LMS Berbayar adalah platform belajar **Bahasa Inggris** online yang menggantikan cara belajar konvensional (kursus offline mahal & tidak fleksibel jadwal, materi tersebar di YouTube tanpa jalur belajar jelas, tanpa bukti kelulusan) dengan satu platform terpusat: pengguna publik bisa menjelajah katalog kelas Bahasa Inggris (Grammar, Speaking, Listening, Writing, persiapan TOEFL/IELTS, Business English, dsb), mendaftar sebagai **Member** (email/password atau **Google**), mengakses kelas gratis atau membeli kelas premium, belajar lewat video (embed YouTube), mengerjakan quiz, dan mendapatkan **sertifikat kelulusan otomatis** yang bisa diverifikasi publik. Untuk mendorong keaktifan belajar, platform menyediakan **leaderboard** siswa teraktif dan fitur **rating & review** agar calon pembeli bisa menilai kualitas kelas dari member lain. **Member yang belum yakin harus mulai dari kelas mana juga bisa mengikuti Roadmap Belajar** — jalur bertahap yang menggabungkan beberapa kelas menuju satu tujuan (mis. "Jalur Siap TOEFL"), dengan progres gabungan yang terlihat jelas. **Admin** mengelola seluruh konten (kelas, materi, quiz, kategori, harga, roadmap) dan memantau statistik penjualan lewat dashboard. Model bisnis: **freemium** — materi gratis untuk menarik pengguna, dilanjutkan materi premium berbayar per kelas.

---

## 2. Latar Belakang

Belajar Bahasa Inggris secara mandiri saat ini punya beberapa masalah:

- Kursus Bahasa Inggris offline (lembaga kursus) cenderung mahal dan jadwalnya kaku, tidak fleksibel untuk pelajar/pekerja.
- Materi belajar gratis tersebar di banyak platform (YouTube, blog, PDF) dan tidak terstruktur jadi satu jalur belajar (mis. tidak jelas urutan Grammar dasar → lanjutan, atau persiapan TOEFL/IELTS yang sistematis).
- **Pelajar baru sering bingung harus mulai dari kelas mana** untuk mencapai tujuan tertentu (mis. "siap TOEFL dalam 3 bulan") karena katalog kelas tidak menunjukkan urutan atau jalur yang disarankan.
- Tidak ada cara memantau progres belajar sendiri secara sistematis, sehingga pelajar mudah kehilangan motivasi.
- Tidak ada bukti kelulusan yang bisa dipakai untuk portofolio/CV/melamar kerja dan bisa diverifikasi pihak lain.
- Penyedia kelas (admin) kesulitan mengatur harga, promo, dan memantau penjualan tanpa sistem terpusat.
- Proses pembelian kelas manual (transfer bank + konfirmasi manual) lambat dan rawan kesalahan.
- Tidak ada elemen yang mendorong konsistensi belajar (gamifikasi) maupun cara bagi calon siswa menilai kualitas kelas sebelum membeli.

Website ini dibangun untuk mendigitalisasi seluruh proses tersebut — dari penemuan kelas Bahasa Inggris (baik satuan maupun lewat jalur roadmap terarah) sampai penerbitan sertifikat — dalam satu platform yang juga mendorong keaktifan belajar lewat leaderboard dan transparansi kualitas lewat rating & review.

---

## 3. Tujuan & Sasaran

| Tujuan | Sasaran Terukur (Target) |
|---|---|
| Mempermudah cara belajar Bahasa Inggris (tujuan utama LMS) | Materi terstruktur per course → lesson, dapat diakses dari 1 platform tanpa berpindah-pindah, dikelompokkan per skill (Grammar, Speaking, dst) |
| **Memberi arah belajar yang jelas bagi pemula** | Minimal 3 Roadmap Belajar tersedia saat launch (mis. Jalur TOEFL, Jalur IELTS, Jalur Business English), masing-masing menggabungkan 3–5 course berurutan |
| Model freemium yang fleksibel | Admin dapat mengubah status course (gratis penuh / gratis sebagian+berbayar / berbayar penuh) kapan saja |
| Mendorong konsistensi belajar (gamifikasi) | Leaderboard siswa teraktif per bulan, mendorong member menyelesaikan lebih banyak lesson |
| Transparansi kualitas kelas | Member dapat memberi rating & review, calon pembeli melihat rata-rata rating sebelum beli |
| Kemudahan pendaftaran | Member dapat daftar/login cepat via Google, tanpa harus mengisi form manual |
| Transaksi otomatis & real-time | Status transaksi ter-update otomatis via webhook Midtrans, enrollment terbuka < 5 detik setelah bayar sukses |
| Bukti kelulusan terverifikasi | Sertifikat ter-generate otomatis setelah lulus quiz, dapat diverifikasi publik via nomor sertifikat |
| Efisiensi admin | Admin dapat memantau statistik penjualan real-time & publish course baru dalam < 10 menit |
| Keamanan data | Password ter-hash (bcrypt), JWT dengan expiry, seluruh endpoint privat diproteksi middleware role |
| **Pengalaman visual yang konsisten & nyaman di mata** | Seluruh halaman (publik, member, admin) mendukung dark mode penuh, bukan hanya landing page |
| Kualitas & maintainability kode | Seluruh kode (frontend & backend) ditulis **TypeScript**, validasi request wajib pakai Zod di backend, struktur Express konsisten (MVC + middleware), `schema.prisma` sebagai satu sumber kebenaran struktur data & tipe (Prisma Client auto-generate tipe TS) |

---

## 4. Ruang Lingkup

### 4.1 In Scope (MVP)
- Website berfokus **khusus kursus Bahasa Inggris** (bukan LMS multi-topik umum) — lihat kategori contoh di §5 & §11.
- Landing page publik (hero, kategori, course terbaru, testimoni, FAQ) bergaya buildwithangga.com.
- Katalog kelas dengan filter kategori/level/gratis-berbayar/sort + search.
- Detail kelas: silabus, preview lesson gratis, harga, rating & review.
- **Roadmap Belajar** — jalur belajar terstruktur yang menggabungkan beberapa course menjadi satu alur bertahap, dengan progres gabungan per member (lihat §11.11–§11.12, §15). Roadmap disusun **manual oleh admin** dari course-course yang sudah ada — bukan direkomendasikan otomatis berbasis AI/assessment (lihat Out of Scope).
- Autentikasi Member (register/login via **email+password** maupun **Google OAuth**).
- Enrollment otomatis untuk course gratis.
- Checkout & pembayaran course berbayar via **Midtrans Snap (Sandbox)** dengan kanal pembayaran yang dirinci di §21.1.
- Player belajar (video YouTube embed) + tracking progress per lesson.
- Quiz pilihan ganda per course dengan auto-grading.
- Sertifikat otomatis (PDF) + halaman verifikasi publik.
- **Rating & Review** — member yang sudah enroll dapat menilai & memberi komentar pada course.
- **Leaderboard** publik — ranking siswa teraktif per bulan berdasarkan jumlah lesson selesai & menit belajar.
- **Dark mode** di seluruh halaman (publik, member, admin), toggle manual tersimpan per perangkat, mengikuti preferensi sistem pada kunjungan pertama.
- Dashboard Member: kelas saya, progress, sertifikat, riwayat transaksi, progres roadmap yang diikuti.
- Dashboard Admin: CRUD course/lesson/quiz/kategori/**roadmap**, atur harga, statistik penjualan, kelola member, moderasi review.
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
- **Rekomendasi roadmap otomatis/personal** berbasis AI atau hasil assessment siswa — roadmap di MVP ini bersifat statis, disusun manual oleh admin, sama untuk semua member yang mengaksesnya (bukan jalur yang di-generate berbeda per individu).
- **Roadmap bersertifikat terpisah** — menyelesaikan seluruh course dalam satu roadmap **tidak** menerbitkan sertifikat tambahan di luar sertifikat per-course yang sudah ada (lihat §17).

> **Catatan:** Penggunaan Zod & struktur MVC yang konsisten **bukan** bagian dari ruang lingkup produk (out of scope) — ini adalah standar pengembangan yang berlaku di seluruh in-scope items di atas. Lihat §21 Arsitektur Teknis.

---

## 5. Glosarium

| Istilah | Keterangan |
|---|---|
| LMS | Learning Management System |
| Course | Kelas/mata pelajaran yang dijual di platform |
| Lesson | Materi/sub-bagian dari sebuah course, berisi 1 video |
| Enrollment | Status "terdaftar" seorang member pada sebuah course (gratis maupun setelah bayar) |
| **Roadmap** | **Jalur belajar yang menggabungkan beberapa Course berurutan menjadi satu alur bertahap menuju satu tujuan belajar (mis. "siap TOEFL"), dengan progres gabungan dihitung dari seluruh course anggotanya** |
| **RoadmapCourse** | **Tabel penghubung (join table) yang menentukan urutan tampil sebuah Course di dalam sebuah Roadmap** |
| Passing Grade | Nilai minimum kelulusan quiz agar sertifikat diterbitkan |
| ORM | Object Relational Mapping (Prisma) |
| Migration | Perubahan struktur database yang tercatat & dapat diulang (`prisma migrate`) |
| Webhook | Callback otomatis dari Midtrans ke server saat status pembayaran berubah |
| JWT | JSON Web Token, dipakai untuk autentikasi stateless |
| RBAC | Role-Based Access Control — pembatasan akses berdasarkan role (Member/Admin) |
| Snap | Produk payment popup dari Midtrans |
| **VA (Virtual Account)** | **Nomor rekening sementara yang diterbitkan bank untuk satu transaksi, salah satu kanal pembayaran Transfer Bank di Midtrans Snap — lihat §21.1** |
| **QRIS** | **Quick Response Code Indonesian Standard — kode QR pembayaran yang dipindai lewat aplikasi e-wallet/mobile banking apa pun yang mendukungnya (GoPay, OVO, DANA, LinkAja, dll), satu kanal pembayaran resmi di Midtrans Snap** |
| CEFR | Common European Framework of Reference for Languages — standar level kemampuan bahasa (A1–C2), dipakai sebagai referensi level course |
| Leaderboard | Papan peringkat siswa teraktif berdasarkan jumlah lesson selesai & menit belajar dalam periode tertentu |
| OAuth | Protokol otorisasi yang dipakai untuk login via akun pihak ketiga (Google) tanpa password baru |
| **Dark Mode** | **Mode tampilan alternatif dengan latar gelap & teks terang, dapat diaktifkan manual lewat toggle di navbar; preferensi tersimpan per perangkat (localStorage)** |

---

## 6. Target Pengguna & Persona

### Analisis Role Pengguna
Ada 3 level akses (bukan hanya Publik & Admin):

| Role | Status | Bisa apa saja |
|---|---|---|
| **Publik (Guest)** | Belum login | Lihat landing page, katalog, detail kelas, **daftar & detail roadmap**, lesson preview gratis, verifikasi sertifikat |
| **Member** | Sudah register/login (role default) | Semua akses Publik + enroll kelas gratis, beli kelas berbayar, belajar penuh, kerjakan quiz, dapat sertifikat, lihat riwayat transaksi, **melacak progres gabungan roadmap yang diikuti** |
| **Admin** | Login dengan role khusus | Semua akses Member + kelola course/lesson/quiz/kategori/**roadmap**, atur harga, lihat statistik penjualan, kelola member |

Role `Instructor` terpisah **tidak digunakan**: platform ini bersifat single-provider (mengacu pada santrikoding.com), bukan marketplace multi-mentor seperti Udemy, sehingga Admin sudah merangkap sebagai pembuat konten. Jika ke depannya berkembang jadi marketplace, role `INSTRUCTOR` dapat ditambahkan tanpa mengubah struktur inti.

### Persona 1 — Member ("Dimas", 22 tahun, fresh graduate yang sedang mempersiapkan TOEFL untuk daftar kerja/beasiswa)
- **Goal:** Meningkatkan kemampuan Bahasa Inggris (terutama Grammar & persiapan TOEFL) dengan harga terjangkau, punya bukti sertifikat untuk portofolio/CV.
- **Frustrasi:** Kursus Bahasa Inggris offline mahal & jadwalnya kaku, tidak jelas isi materinya sebelum beli, **tidak tahu harus mulai belajar dari kelas yang mana**, tidak ada yang memotivasi belajar konsisten, tidak ada bukti kelulusan resmi.
- **Kebutuhan sistem:** Preview materi gratis sebelum beli, login cepat pakai Google, **mengikuti roadmap siap pakai alih-alih menyusun urutan belajar sendiri**, lihat rating & review dari member lain sebelum membeli, checkout cepat, progres belajar terlihat jelas, terpacu lewat leaderboard, sertifikat bisa diverifikasi.

### Persona 2 — Admin ("Tim Konten LMS Bahasa Inggris")
- **Goal:** Upload course Bahasa Inggris baru dengan cepat (per skill: Grammar/Speaking/Listening/Writing/Persiapan Tes), **menyusun roadmap dari course yang sudah ada**, atur harga/promo sesuai strategi, pantau penjualan.
- **Frustrasi:** Rekap penjualan manual di Excel rawan salah, sulit tahu course mana yang paling laku, sulit memantau kualitas course lewat feedback siswa, **tidak ada cara mudah menyusun & menampilkan jalur belajar bertahap ke siswa**.
- **Kebutuhan sistem:** Dashboard statistik ringkas, CRUD course/lesson/quiz cepat, **CRUD roadmap dengan pengaturan urutan course yang mudah**, filter & pencarian member/transaksi, moderasi review yang tidak pantas.

---

## 7. User Stories

### Publik
- Sebagai pengunjung, saya ingin melihat katalog & detail kelas Bahasa Inggris tanpa login, agar saya bisa memutuskan sebelum mendaftar.
- Sebagai pengunjung, saya ingin menonton materi preview gratis, agar saya tahu kualitas materi sebelum membeli.
- Sebagai pengunjung, saya ingin melihat rating & review dari member lain di halaman detail kelas, agar saya yakin sebelum membeli.
- Sebagai pengunjung, saya ingin melihat leaderboard siswa teraktif, agar saya termotivasi ikut belajar di platform ini.
- Sebagai pengunjung, saya ingin memverifikasi sertifikat orang lain lewat nomor sertifikat, agar saya percaya keasliannya.
- **Sebagai pengunjung, saya ingin melihat daftar Roadmap Belajar (mis. "Jalur Siap TOEFL"), agar saya tahu urutan kelas yang disarankan untuk mencapai tujuan tertentu tanpa harus menyusun sendiri.**
- **Sebagai pengunjung, saya ingin membuka detail sebuah roadmap dan melihat urutan course di dalamnya beserta harga masing-masing, agar saya bisa memperkirakan biaya & waktu sebelum mendaftar.**

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
- **Sebagai member, saya ingin melihat progres gabungan saya di sebuah roadmap (berapa persen total course di roadmap itu sudah saya selesaikan), agar saya tahu seberapa jauh saya menuju tujuan belajar saya.**
- **Sebagai member, saya ingin mengaktifkan dark mode di seluruh halaman yang saya akses (termasuk dashboard belajar & quiz), agar nyaman dipakai di kondisi minim cahaya.**

### Admin
- Sebagai admin, saya ingin login aman ke dashboard, agar konten & data platform terlindungi.
- Sebagai admin, saya ingin CRUD course, lesson, dan kategori, agar konten selalu up to date.
- Sebagai admin, saya ingin mengatur harga & status gratis/berbayar tiap course, agar strategi pricing fleksibel.
- Sebagai admin, saya ingin membuat quiz & soal per course, agar member diuji sebelum dinyatakan lulus.
- Sebagai admin, saya ingin melihat statistik penjualan (total revenue, course terlaris), agar saya bisa mengambil keputusan bisnis.
- Sebagai admin, saya ingin menyembunyikan/menghapus review yang tidak pantas, agar kualitas konten platform terjaga.
- **Sebagai admin, saya ingin menyusun roadmap dari course-course yang sudah ada dan mengatur urutannya (termasuk menambah/menghapus course dari roadmap kapan saja), agar siswa punya panduan jalur belajar yang jelas tanpa saya perlu membuat konten baru dari nol.**
- **Sebagai admin, saya ingin men-draft roadmap sebelum dipublikasikan (`published = false`), agar saya bisa menyiapkan beberapa course anggotanya dulu sebelum roadmap tampil ke publik.**

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
| **FR-39** | **Roadmap** | **Publik dapat melihat daftar roadmap (`/roadmap`) dan detail roadmap (`/roadmap/:slug`) berisi daftar course berurutan di dalamnya** | **Must** |
| **FR-40** | **Roadmap** | **Member yang login dapat melihat progres gabungan sebuah roadmap — dihitung sebagai rata-rata `Enrollment.progress` seluruh course anggota roadmap tsb; course yang belum di-enroll dihitung 0%** | **Must** |
| **FR-41** | **Admin — Roadmap** | **CRUD roadmap (judul, slug, deskripsi, thumbnail, status publish) dan atur daftar + urutan course di dalamnya (tambah/hapus/geser urutan)** | **Must** |
| **FR-42** | **Public — UI** | **Filter cepat (chip) pada listing kelas landing page: Semua / Gratis / Populer / Trending / Terbaru — difilter di sisi client dari data yang sudah di-fetch, tanpa request baru ke server** | **Should** |
| **FR-43** | **UI** | **Dark mode di seluruh halaman (publik, member, admin) via toggle di navbar; preferensi tersimpan per perangkat (localStorage) dan mengikuti preferensi sistem (`prefers-color-scheme`) pada kunjungan pertama** | **Must** |
| **FR-44** | **Payment** | **Checkout course berbayar mengaktifkan kanal pembayaran Midtrans Snap sesuai daftar resmi di §21.1 (kartu, VA bank, GoPay, ShopeePay, QRIS, gerai ritel)** | **Must** |

---

## 9. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performance | First Contentful Paint < 2.5s pada koneksi 4G; response API list course < 1s untuk katalog ≤ 1.000 course |
| Availability | Target uptime 99% (bergantung SLA hosting backend & database) |
| Responsive | Layout tetap fungsional pada breakpoint mobile (360px), tablet (768px), desktop (1280px+) menggunakan breakpoint Tailwind |
| Browser Support | 2 versi terbaru Chrome, Firefox, Edge, Safari |
| Accessibility | Kontras warna memenuhi WCAG AA minimum **di kedua mode (terang & gelap)**, elemen interaktif dapat diakses keyboard, animasi GSAP/Lenis menghormati `prefers-reduced-motion` |
| Security | Seluruh endpoint privat melalui middleware JWT + role check; input backend divalidasi Zod; webhook Midtrans divalidasi signature |
| Scalability | Struktur database mendukung ribuan course, roadmap, dan transaksi tanpa redesign skema |
| Maintainability | Kode frontend (.tsx) & backend (.ts) terstruktur MVC (routes → controller → service), ditulis penuh **TypeScript** dengan tipe data konsisten (Prisma Client auto-generate tipe dari `schema.prisma`); `tsc --noEmit` wajib bersih sebelum deploy |
| Usability | Member dapat menyelesaikan checkout dalam ≤ 2 menit tanpa kebingungan |
| Konsistensi Visual | Seluruh halaman mengikuti satu sistem desain (warna, tipografi, spacing) bergaya buildwithangga.com, **konsisten di mode terang maupun gelap** |
| Data Retention | Data transaksi & sertifikat disimpan permanen (tidak dihapus, hanya soft-delete bila diperlukan) |

---

## 10. Sitemap & Struktur Navigasi

```text
PUBLIK (/)
├── / ............................. Landing Page
├── /kelas ......................... Katalog Kelas (filter kategori/level/price/sort/search)
│   └── /kelas/:slug .............. Detail Kelas (silabus, rating & review)
├── /roadmap ........................ Daftar Roadmap Belajar
│   └── /roadmap/:slug ............. Detail Roadmap (urutan course + progres gabungan jika login)
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
├── /admin/roadmap ................... CRUD Roadmap (pilih & urutkan course anggota)
├── /admin/kategori .................. CRUD Kategori
├── /admin/member ..................... List Member
└── /admin/transaksi .................. List Semua Transaksi
```

Navbar publik (desktop & mobile) menampilkan menu: **Beranda, Kelas, Roadmap, Leaderboard**, lalu tombol Masuk/Daftar (atau avatar bila sudah login) dan **toggle dark mode**.

---

## 11. Spesifikasi Halaman — Publik & Member

### 11.1 Landing Page (`/`)
**Section (urut top-to-bottom):**
1. Navbar sticky — logo, menu (Beranda, Kelas, Roadmap, Leaderboard, Login/Register atau avatar bila sudah login), toggle dark mode.
2. Hero — headline dengan animasi GSAP (fade/slide bertahap per baris), mis. *"Kuasai Bahasa Inggris, Mulai dari Grammar sampai Siap TOEFL"*, sub-headline, CTA "Lihat Kelas", badge mengambang berisi pencapaian (jumlah sertifikat terbit, jumlah pelajar aktif).
3. Marquee logo/teks berjalan (Lenis + CSS `@keyframes`) — kartu chip kategori (ikon + nama + tagline) yang berjalan otomatis, dua baris berlawanan arah.
4. Kategori pilihan — kartu besar (ikon + judul + subjudul + panah) per jalur belajar utama, dengan tautan ke katalog kelas kategori terkait. Contoh kategori: Grammar, Vocabulary, Speaking, Listening, Writing, Persiapan TOEFL/IELTS, Business English.
5. Kelas terbaru/trending — header center-aligned "Kelas" + filter chip (**Semua/Gratis/Populer/Trending/Terbaru**, lihat FR-42), lalu grid course card (thumbnail, badge Gratis/Premium, harga, level, jumlah lesson, **rating bintang + jumlah review**).
6. Keunggulan platform (Pencapaian Kami) — pita angka pencapaian (pelajar aktif, sertifikat terbit, rating, transaksi sukses) + kartu benefit (video praktis, sertifikat resmi, harga terjangkau, akses selamanya).
7. Testimoni (grid kartu bergaya ikon kutipan + rating, dapat memakai data dummy di awal).
8. FAQ — kartu bernomor dengan eyebrow + emoji, dilengkapi kotak "Hubungi Kami".
9. CTA akhir — banner ajakan melihat katalog/daftar.
10. Footer — kolom tautan terstruktur, brand card, **Metode Pembayaran** (lihat §21.1), status badge, kontak.

**Data source:** `Category`, `Course` (published = true, urut createdAt desc, limit N untuk section trending, join agregat `avgRating`/`reviewCount`).

### 11.2 Katalog Kelas (`/kelas`)
- Header halaman dengan eyebrow + judul + jumlah kelas tersedia.
- Filter bar: search, kategori, level, gratis/berbayar, **urutkan (Terbaru/Populer/Harga Terendah/Harga Tertinggi)** — tiap filter aktif tampil sebagai chip yang bisa dihapus satu per satu atau sekaligus ("Hapus Semua").
- Grid course card + pagination.
- Animasi reveal per card saat scroll (GSAP ScrollTrigger, stagger).

### 11.3 Detail Kelas (`/kelas/:slug`)
- Video trailer/lesson pertama sebagai preview.
- Tab: Deskripsi, Silabus (accordion lesson — lesson non-preview tampil dengan ikon gembok bila belum enroll), **Rating & Review** (rata-rata bintang + list komentar member, dengan form tambah review khusus untuk member yang sudah enroll pada course tsb).
- Sidebar sticky: harga (atau badge "Gratis"), tombol dinamis: **"Beli Sekarang"** (belum beli & berbayar) / **"Mulai Belajar"** (gratis atau sudah beli) / **"Lanjutkan Belajar"** (sudah enroll, progress > 0).

### 11.4 Checkout (`/checkout/:courseId`)
- Hanya untuk course berbayar yang belum di-enroll.
- Ringkasan course + harga → memicu Midtrans Snap popup dengan kanal pembayaran sesuai §21.1.
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
- **Podium 3 besar** ditampilkan terpisah di atas tabel: posisi #1 di tengah dengan pedestal tertinggi + mahkota, #2 di kiri, #3 di kanan, masing-masing dengan avatar bercincin warna (emas/perak/perunggu) dan medali peringkat.
- Peringkat ke-4 dan seterusnya ditampilkan sebagai **tabel bergaya leaderboard game**: header gelap, baris selang-seling, kolom peringkat/avatar+nama/lesson selesai/menit belajar, baris member yang sedang login di-highlight dengan aksen warna di sisi kiri.
- Menampilkan Top 20–50 member paling aktif belajar **bulan berjalan**, diurutkan berdasarkan total menit belajar (utama) lalu jumlah lesson selesai (sekunder).
- Kolom yang ditampilkan: peringkat, avatar + nama tampilan (tanpa email, demi privasi), total lesson selesai, total menit belajar.
- Reset otomatis setiap awal bulan (dihitung dari `LessonProgress.completedAt` dalam rentang bulan berjalan).
- Animasi reveal podium & baris tabel (GSAP) saat halaman dimuat.

### 11.10 Login/Register (`/login`, `/register`)
- Form email + password standar.
- Tombol **"Login dengan Google"** (Google Identity Services) di atas/bawah form — 1 klik langsung login/register otomatis bila akun belum ada.
- Jika email dari akun Google sudah terdaftar manual sebelumnya, sistem menautkan akun tersebut (bukan membuat akun baru).

### 11.11 Daftar Roadmap (`/roadmap`) — Publik, Baru
- Header halaman: eyebrow "Panduan Belajar Terarah" + judul "Roadmap Belajar" + subjudul penjelas.
- Grid kartu roadmap (thumbnail, badge "Roadmap", judul, ringkasan deskripsi, jumlah kelas anggota, tautan "Lihat Jalur").
- Hanya menampilkan roadmap dengan `published = true`.
- **Data source:** `Roadmap` (published = true) beserta relasi `RoadmapCourse` terurut `order` untuk menghitung jumlah course anggota.

### 11.12 Detail Roadmap (`/roadmap/:slug`) — Publik, Baru
- Header: judul roadmap, deskripsi lengkap.
- **Jika member login:** progress bar progres gabungan (lihat FR-40) ditampilkan di bawah header.
- **Jika belum login:** ajakan "Masuk untuk melacak progres gabunganmu di roadmap ini".
- Daftar course anggota ditampilkan sebagai **stepper/timeline vertikal berurutan**: tiap langkah berisi nomor urut (atau ikon centang bila course tsb sudah 100% selesai) terhubung garis vertikal ke langkah berikutnya, kartu course (thumbnail, level, status gratis/berbayar, harga, progress bar individual bila sudah di-enroll), dan tombol "Mulai"/"Lanjutkan" yang mengarah ke halaman detail course tsb.

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
- Dari tabel ini, admin juga punya akses cepat (ikon aksi) ke: Kelola Materi, Kelola Quiz, dan Moderasi Review course tsb.

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

### 12.10 CRUD Roadmap (`/admin/roadmap`) — Baru
- List roadmap: thumbnail, status (Published/Draft), judul, ringkasan urutan course (`Course A → Course B → Course C`), jumlah course anggota, aksi edit/hapus.
- Form create/edit: judul, slug (auto-generate dari judul, dapat diubah manual), deskripsi, thumbnail (upload), toggle published.
- **Pemilihan & pengurutan course anggota:** panel pencarian/pilih course dari seluruh course yang sudah ada (checkbox/klik untuk menambah), course yang sudah dipilih tampil sebagai list bernomor dengan tombol naik/turun untuk mengubah urutan, dan tombol hapus per item.
- Validasi: roadmap tidak dapat dipublikasikan (`published = true`) jika belum punya minimal 1 course anggota (lihat §17).
- Hapus roadmap **tidak** menghapus course anggotanya — hanya menghapus relasi `RoadmapCourse`.

---

## 13. Alur Pembelian & Belajar (Detail)

### 13.1 Alur Pembelian Course Berbayar
```text
1. Member buka /kelas/:slug, klik "Beli Sekarang"
2. Redirect ke /checkout/:courseId
3. Backend membuat Transaction (status = 'pending', amount = snapshot harga saat itu)
4. Backend request Snap token ke Midtrans dengan enabled_payments sesuai §21.1,
   frontend tampilkan popup Snap
5. Member menyelesaikan pembayaran lewat salah satu kanal yang tersedia
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

### 13.4 Alur Progres Roadmap — Baru
```text
1. Member membuka /roadmap/:slug sebuah roadmap yang diikuti sebagian/seluruh course-nya
2. Backend mengambil seluruh RoadmapCourse milik roadmap tsb (terurut `order`)
3. Untuk tiap course anggota, backend mencari Enrollment member pada course tsb:
     ├── Ada Enrollment → pakai Enrollment.progress
     └── Belum ada Enrollment → dianggap 0%
4. Roadmap.progress (gabungan) = rata-rata seluruh nilai progress course anggota
5. Frontend menampilkan progress bar gabungan + progress individual tiap course di timeline
```
**Catatan:** Progres roadmap bersifat *read model* (dihitung saat diakses, tidak disimpan sebagai kolom tersendiri) karena nilainya selalu turunan dari `Enrollment.progress` yang sudah ada — lihat §17 Business Rules.

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
**Progres Roadmap** (gabungan, lihat §13.4) mengikuti transisi yang sama secara agregat: roadmap dianggap "selesai" ketika rata-rata progress seluruh course anggotanya mencapai 100% (artinya setiap course anggota sudah masing-masing 100%).

### 14.3 Status Quiz Attempt
```text
[belum attempt] --(submit, skor >= passing grade)--> [lulus] --(trigger otomatis)--> Certificate diterbitkan
[belum attempt] --(submit, skor < passing grade)--> [gagal] --(retry)--> [belum attempt] (attempt baru)
```
**Aturan:** Semua attempt (lulus maupun gagal) tercatat di `QuizAttempt` sebagai riwayat. Sertifikat hanya diterbitkan **satu kali** per member per course — attempt lulus berikutnya (jika retry setelah lulus) tidak membuat sertifikat baru. **Menyelesaikan seluruh course dalam satu roadmap tidak memicu penerbitan sertifikat tambahan** (lihat §4.2 Out of Scope & §17).

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
Roadmap (1) ──< (N) RoadmapCourse >── (1) Course
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

### 15.14 Tabel: Roadmap — Baru
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| title | varchar | not null |
| slug | varchar | not null, unique |
| description | text | not null |
| thumbnailUrl | varchar | nullable |
| published | boolean | not null, default false |
| createdAt | timestamp | default now() |

### 15.15 Tabel: RoadmapCourse (Join Table) — Baru
| Kolom | Tipe | Constraint |
|---|---|---|
| id | uuid | PK |
| roadmapId | uuid | FK → Roadmap.id |
| courseId | uuid | FK → Course.id |
| order | integer | not null (urutan tampil course di dalam roadmap) |

**Constraint:** unique (`roadmapId`, `courseId`) — 1 course hanya muncul sekali di dalam roadmap yang sama (tapi boleh dipakai ulang di roadmap lain). unique (`roadmapId`, `order`) — tidak ada 2 course dengan urutan sama persis di roadmap yang sama.
**Catatan:** Tabel ini sengaja berupa join table murni (tanpa kolom progress) karena progres roadmap selalu dihitung on-the-fly dari `Enrollment.progress` tiap course anggota (lihat §13.4) — bukan disimpan sebagai state tersendiri, supaya tidak ada dua sumber kebenaran yang bisa tidak sinkron.

### 15.16 Draft Schema Prisma (Lengkap)

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
  id              String           @id @default(uuid())
  title           String
  slug            String           @unique
  description     String
  thumbnailUrl    String?
  price           Int              @default(0)
  isFree          Boolean          @default(false)
  level           String?
  published       Boolean          @default(false)
  category        Category         @relation(fields: [categoryId], references: [id])
  categoryId      String
  author          User             @relation("CourseAuthor", fields: [authorId], references: [id])
  authorId        String
  avgRating       Float            @default(0) // cache, recalculate saat Review berubah
  reviewCount     Int              @default(0) // cache
  lessons         Lesson[]
  enrollments     Enrollment[]
  transactions    Transaction[]
  quiz            Quiz?
  certificates    Certificate[]
  reviews         Review[]
  roadmapCourses  RoadmapCourse[]  // relasi baru — roadmap mana saja yang memuat course ini
  createdAt       DateTime         @default(now())
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

// --- Model baru v3.1: Roadmap Belajar ---

model Roadmap {
  id           String          @id @default(uuid())
  title        String
  slug         String          @unique
  description  String
  thumbnailUrl String?
  published    Boolean         @default(false)
  courses      RoadmapCourse[]
  createdAt    DateTime        @default(now())
}

model RoadmapCourse {
  id        String  @id @default(uuid())
  roadmap   Roadmap @relation(fields: [roadmapId], references: [id])
  roadmapId String
  course    Course  @relation(fields: [courseId], references: [id])
  courseId  String
  order     Int

  @@unique([roadmapId, courseId])
  @@unique([roadmapId, order])
}
```

---

## 16. Otorisasi & Matrix Akses API

Backend menggunakan Express + JWT (bukan Supabase RLS), sehingga otorisasi diterapkan lewat **middleware** `authenticate` (verifikasi JWT) dan `authorize(role)` (cek role) di setiap route. Prinsip: **default deny** untuk endpoint privat.

| Endpoint / Resource | Publik (tanpa token) | Member (token, role=MEMBER) | Admin (token, role=ADMIN) |
|---|---|---|---|
| `GET /courses`, `/courses/:slug` | ✅ | ✅ | ✅ |
| `GET /categories` | ✅ | ✅ | ✅ |
| `GET /roadmaps`, `/roadmaps/:slug` | ✅ | ✅ | ✅ |
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
| `GET /me/roadmap-progress/:roadmapId` | ❌ | ✅ (progres gabungan milik sendiri) | ✅ |
| `PATCH /lessons/:id/complete` | ❌ | ✅ (harus punya Enrollment aktif) | ✅ |
| `POST /quiz/:id/submit` | ❌ | ✅ (progress course harus 100%) | ✅ |
| `POST /courses/:id/reviews` | ❌ | ✅ (harus punya Enrollment pada course tsb) | ❌ (admin tidak membeli course sendiri) |
| `POST/PUT/DELETE /courses`, `/lessons`, `/categories`, `/quiz`, `/questions` | ❌ | ❌ | ✅ |
| `POST/PUT/DELETE /roadmaps`, `/roadmaps/:id/courses` | ❌ | ❌ | ✅ |
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
19. **Roadmap hanya dapat dipublikasikan (`published = true`) jika memiliki minimal 1 `RoadmapCourse` — roadmap kosong tidak boleh tampil ke publik.**
20. **Progres gabungan roadmap tidak disimpan sebagai kolom database** — selalu dihitung saat diakses sebagai rata-rata `Enrollment.progress` seluruh course anggota (course yang belum di-enroll member dihitung sebagai 0%); lihat §13.4.
21. **Satu course yang sama boleh menjadi anggota lebih dari satu roadmap sekaligus** (mis. "Grammar Dasar" bisa muncul baik di "Jalur Siap TOEFL" maupun "Jalur Karier: Business English") — tidak ada batasan eksklusivitas.
22. **Menyelesaikan seluruh course dalam satu roadmap (progres gabungan mencapai 100%) tidak menerbitkan sertifikat atau entitas baru apa pun** — sertifikat tetap diterbitkan per-course seperti biasa (lihat §4.2, §14.3).
23. **Kanal pembayaran yang dikirim ke Midtrans Snap saat generate Snap token (`enabled_payments`) mengikuti daftar resmi di §21.1** dan dikonfigurasi di level backend (environment/config), bukan dipilih manual oleh member per transaksi.
24. **Dark mode adalah preferensi tampilan murni (UI-only)** — tidak memengaruhi data atau logika bisnis apa pun, tersimpan di `localStorage` sisi client, tidak disimpan di database/akun user.

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
- **Catatan Roadmap:** sertifikat **tidak** diterbitkan untuk roadmap secara keseluruhan (lihat §4.2, §17 rule 22) — hanya per course seperti biasa.

---

## 20. Keamanan Sistem

- Password di-hash dengan bcrypt (salt round ≥ 10), tidak pernah disimpan/dikirim dalam bentuk plain text.
- JWT access token dengan masa berlaku wajar (mis. 7 hari). **Keputusan final (wajib diikuti frontend & backend):** token dikirim via header `Authorization: Bearer <token>`, disimpan di **localStorage** sisi client — bukan httpOnly cookie. Ini dipilih agar backend tetap stateless murni (tidak perlu setup CORS `credentials`/cookie cross-domain, yang rawan salah konfigurasi ketika frontend & backend di-hosting terpisah dan dibangun oleh AI/tim berbeda). Risiko XSS localStorage diterima untuk skala MVP; mitigasi lain: hindari `dangerouslySetInnerHTML`/eval di frontend.
- Middleware `authenticate` (verifikasi token) & `authorize(role)` wajib di semua route privat (lihat matrix §16), **termasuk seluruh endpoint Roadmap milik admin**.
- Validasi Zod di **setiap** request body backend, bukan hanya di frontend.
- Endpoint webhook Midtrans wajib memverifikasi signature key sebelum memproses data.
- Login Google: id_token dari Google Identity Services **wajib** diverifikasi di backend menggunakan `google-auth-library` (`verifyIdToken`) sebelum membuat sesi/JWT — jangan pernah mempercayai data user dari payload frontend tanpa verifikasi server-side.
- CORS dikonfigurasi hanya untuk origin frontend yang sah.
- Upload file (thumbnail course, thumbnail roadmap, foto profil) divalidasi tipe & ukuran di backend (Multer `fileFilter` + `limits`), bukan hanya di client.
- Rate limiting pada endpoint login/register — Could have, mencegah brute force.

---

## 21. Arsitektur Teknis & Spesifikasi Payment Gateway

```text
┌──────────────────────────────────────────┐
│              Browser (User)                │
│  React + TypeScript (Vite) SPA (.tsx)      │
│  Tailwind CSS (+ dark mode via class)       │
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
- **Frontend Layer:** React + TypeScript (Vite), file `.tsx`, dengan Tailwind untuk styling (termasuk dark mode berbasis `class` strategy — lihat §28.2). Data fetching memakai Axios + JWT di header `Authorization`, tipe response API didefinisikan sebagai TypeScript interface (idealnya disamakan dengan tipe request/response di §29). Animasi: GSAP (+ ScrollTrigger) untuk reveal & hero text, Lenis untuk smooth scroll — dipakai selektif, tidak di semua elemen. Tombol "Login dengan Google" memakai script Google Identity Services, mengirim `id_token` ke backend.
- **Backend Layer:** Express + TypeScript, file `.ts`, dengan struktur MVC (routes → controller → service), validasi request via Zod (tipe hasil validasi otomatis konsisten berkat `z.infer`), autentikasi via JWT + bcrypt. Business logic kritikal (generate nomor transaksi/sertifikat, hitung progress, grading quiz, verifikasi webhook, verifikasi id_token Google, agregasi leaderboard & rating, **agregasi progres roadmap**) dijalankan di service layer backend, bukan di frontend.
- **Database Layer:** PostgreSQL diakses lewat Prisma ORM; **Prisma Client otomatis meng-generate tipe TypeScript** dari `schema.prisma` (mis. `Prisma.CourseGetPayload`), dipakai langsung di service layer agar tipe data selalu sinkron dengan struktur database. Seluruh perubahan struktur database wajib lewat `prisma migrate` (tercatat, dapat di-rollback).
- **Payment Layer:** Midtrans Snap (Sandbox untuk development, Production untuk go-live) — lihat §21.1 untuk kanal pembayaran resmi.
- **Storage Layer:** Cloudinary (atau setara) untuk thumbnail course, thumbnail roadmap, & file PDF sertifikat.
- **Auth Layer (Google):** `google-auth-library` di backend memverifikasi `id_token` yang dikirim frontend sebelum membuat/menautkan user & menerbitkan JWT sendiri (arsitektur tetap stateless, tidak pakai session Passport).

### 21.1 Spesifikasi Payment Gateway (Midtrans Snap) — Baru

PRD v3.0 hanya menyebutkan **Midtrans Snap (Sandbox)** sebagai gateway tanpa merinci kanal pembayaran di dalamnya. v3.1 menegaskan kanal resmi yang **diaktifkan** di konfigurasi Snap (parameter `enabled_payments` saat backend membuat transaksi — lihat §29.5), berdasarkan kanal yang benar-benar didukung produk Midtrans Snap:

| Kategori | Kanal | Payment Type (Midtrans) | Catatan |
|---|---|---|---|
| Kartu | Kredit/Debit | `credit_card` | Mendukung Visa, Mastercard, JCB; cicilan untuk nominal tertentu (opsional, Could have) |
| Transfer Bank (Virtual Account) | BCA, BNI, BRI, Mandiri, Permata | `bca_va`, `bni_va`, `bri_va`, `echannel` (Mandiri Bill Payment), `permata_va` | VA dibuatkan otomatis per transaksi, kedaluwarsa sesuai `expiry_duration` |
| E-Wallet | GoPay, ShopeePay | `gopay`, `shopeepay` | Pembayaran via aplikasi atau scan QR dari dalam Snap popup |
| QR | QRIS | `other_qris` | Satu kode QR yang bisa dipindai dari aplikasi e-wallet/bank apa pun yang mendukung QRIS (termasuk OVO, DANA, LinkAja) — **bukan kanal terpisah untuk tiap e-wallet** |
| Gerai Ritel (Convenience Store) | Indomaret, Alfamart | `cstore` (`indomaret`, `alfamart`) | Member bayar tunai di kasir dengan kode pembayaran dari Snap — Should have |
| Paylater/Cicilan Tanpa Kartu | Akulaku, Kredivo | `akulaku`, `kredivo` | Could have, fase berikutnya bila diperlukan |

**Keputusan arsitektur:**
- Daftar `enabled_payments` dikonfigurasi di **backend** (environment/config), bukan dipilih manual oleh member per transaksi — member tetap memilih kanal spesifik (mis. bank VA mana) di dalam popup Snap itu sendiri.
- OVO dan DANA **tidak** diperlakukan sebagai payment_type terpisah karena Midtrans Snap mengaksesnya lewat kanal **QRIS**, bukan integrasi langsung per-wallet — UI footer & checkout tidak menampilkan badge "OVO"/"DANA" berdiri sendiri, melainkan di bawah badge QRIS.
- Untuk MVP, kanal **Wajib (Must have)** diaktifkan: Kartu Kredit/Debit, VA Bank (kelima bank di atas), GoPay, ShopeePay, QRIS. Kanal **Should/Could have**: Gerai Ritel, Paylater — dapat diaktifkan belakangan tanpa perubahan skema database (hanya ubah konfigurasi `enabled_payments`).
- Simulasi pembayaran di environment Sandbox memakai kredensial uji Midtrans resmi (nomor kartu/VA simulasi), bukan kanal production.

---

## 22. Strategi Testing

| Jenis Testing | Cakupan |
|---|---|
| Unit Testing | Fungsi utilitas: hitung progress course, grading quiz, format nomor transaksi/sertifikat, kalkulasi `avgRating`, agregasi leaderboard, **agregasi progres roadmap** |
| Integration Testing | Alur checkout → webhook → enrollment; alur lesson selesai → quiz → sertifikat; alur submit review → `avgRating` ter-update; alur login Google baru vs akun tertaut; **alur CRUD roadmap → tampil benar di halaman publik dengan urutan course yang sesuai** |
| Authorization Testing | Pastikan endpoint admin **tidak bisa** diakses oleh member/publik; member tidak bisa akses data enrollment/transaksi member lain; member tanpa Enrollment **tidak bisa** submit review; **endpoint CRUD roadmap hanya bisa diakses admin** |
| Payment Testing | Simulasi status Midtrans Sandbox (settlement, deny, expire, cancel) untuk **setiap kanal di §21.1** (kartu, tiap VA bank, GoPay, ShopeePay, QRIS) dan pastikan status Transaction ter-update benar |
| UAT (User Acceptance Testing) | Simulasi calon member: register/login (email & Google) → beli/enroll → belajar → quiz → sertifikat → beri review; **ikuti roadmap dari awal sampai progres gabungan 100%**; simulasi admin: CRUD penuh (termasuk roadmap) + cek statistik + moderasi review |
| Responsive Testing | Manual check di breakpoint 360px, 768px, 1280px, **di mode terang maupun gelap** |
| Accessibility Testing | Kontras warna (termasuk dark mode) memenuhi WCAG AA, navigasi keyboard, `prefers-reduced-motion` untuk animasi GSAP/Lenis |
| Dark Mode Testing | Toggle di navbar berfungsi di seluruh halaman (publik/member/admin); preferensi tersimpan setelah refresh/kunjungan ulang; kontras teks & elemen interaktif tetap terbaca di semua halaman |
| Type-Safety Testing | `tsc --noEmit` di frontend **dan** backend, serta `npm run build` lulus tanpa error TypeScript sebelum deploy |
| Edge Case Testing | Double enroll, webhook diterima 2x (idempotency by `midtransOrderId`), quiz retry setelah lulus, harga course berubah saat checkout berjalan, upload thumbnail file besar/salah format, double review pada course yang sama, email Google yang sudah terdaftar manual, **roadmap dengan 0 course (tidak boleh dipublikasikan)**, **course yang dihapus dari roadmap sementara member sedang mengikutinya (progres tetap akurat terhadap course yang tersisa)** |

---

## 23. Rencana Deployment

| Komponen | Platform |
|---|---|
| Frontend (React + TypeScript build) | Vercel / Netlify |
| Backend (Express + TypeScript API) | Railway / Render |
| Database (PostgreSQL) | Supabase / Railway Postgres / Aiven (free tier cukup untuk skala tugas) |
| Storage (thumbnail, PDF) | Cloudinary |
| Payment | Midtrans Sandbox (development, kanal sesuai §21.1) → Production (bila go-live nyata) |
| Auth pihak ketiga | Google Cloud Console (OAuth Client ID untuk Google Identity Services) |
| Environment | `development` (`.env` lokal), `production` (env variable di dashboard hosting) |

**Checklist sebelum go-live:**
- [ ] Semua endpoint privat diuji middleware auth & role-nya (termasuk endpoint Roadmap).
- [ ] Environment variable (JWT secret, DB URL, Midtrans key, Cloudinary key, Google OAuth Client ID) sudah di-set di hosting.
- [ ] Authorized origin & redirect URI Google OAuth sudah didaftarkan sesuai domain production.
- [ ] Data dummy testing sudah dihapus/direset.
- [ ] Webhook Midtrans sudah dikonfigurasi ke URL production backend.
- [ ] Daftar `enabled_payments` di konfigurasi Midtrans sudah sesuai §21.1 dan diuji di tiap kanal.
- [ ] Migration Prisma sudah dijalankan di database production (termasuk tabel `Roadmap`/`RoadmapCourse`).
- [ ] Minimal 1 roadmap published dengan course yang valid sebelum go-live.

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
| **Roadmap menampilkan course yang sudah di-unpublish/dihapus** | **Member melihat jalur belajar yang rusak/error di tengah jalan** | **Validasi di service layer: saat roadmap diakses publik, course anggota yang `published = false` disembunyikan dari tampilan (bukan dihapus dari relasi), admin diberi peringatan di dashboard roadmap jika ada course draft di dalamnya** |
| **Kanal pembayaran tertentu (mis. VA bank tertentu) sedang gangguan di sisi Midtrans/bank** | **Member gagal checkout lewat kanal favoritnya** | **Beberapa kanal diaktifkan sekaligus (§21.1) sehingga member punya alternatif; status gangguan dipantau lewat dashboard Midtrans** |

---

## 25. Success Metrics / KPI

- ≥ 95% transaksi berhasil diproses tanpa error teknis.
- Waktu rata-rata checkout ≤ 2 menit.
- 0 insiden nomor transaksi/sertifikat duplikat.
- Waktu admin mem-publish course baru ≤ 10 menit.
- Website dapat diakses lancar dari perangkat mobile tanpa layout rusak, **di mode terang maupun gelap**.
- 0 insiden kebocoran password/JWT.
- 0 error TypeScript (`tsc --noEmit` bersih) di setiap build production, frontend maupun backend.
- **Minimal 15% member baru mengakses halaman Roadmap dalam minggu pertama setelah daftar** (indikasi fitur membantu arah belajar pemula).
- **Distribusi transaksi sukses merata di ≥ 3 kanal pembayaran berbeda** (indikasi konfigurasi `enabled_payments` §21.1 benar-benar dipakai, bukan cuma 1 kanal dominan).

---

## 26. Deliverables

1. PRD (dokumen ini, v3.1).
2. ERD & `schema.prisma` final + file migration (termasuk `Roadmap`/`RoadmapCourse`).
3. Source code React (frontend) & Express (backend).
4. Database PostgreSQL siap pakai + seed data dummy (course, kategori, quiz contoh, **roadmap contoh**).
5. Website LMS publik yang live.
6. Dashboard admin yang live & terproteksi.
7. Dokumentasi API ringkas (daftar endpoint + contoh request/response).
8. Panduan penggunaan singkat untuk admin (could have).

---

## 27. Lampiran

### 27.1 Ringkasan MVP Checklist

**Publik**
- [x] Landing Page (hero animasi, marquee, kategori, course terbaru + filter chip, testimoni, FAQ)
- [ ] Katalog Kelas + filter & search & sort
- [x] Detail Kelas + preview gratis + rating & review
- [x] **Daftar Roadmap & Detail Roadmap (stepper + progres gabungan)**
- [x] Leaderboard siswa teraktif bulanan (podium top-3 + tabel)
- [ ] Verifikasi Sertifikat
- [ ] **Dark mode di seluruh halaman**

**Member**
- [x] Register/Login (JWT) via email/password **dan** Google OAuth
- [ ] Enroll kelas gratis
- [ ] Checkout & bayar kelas berbayar (Midtrans Sandbox, kanal sesuai §21.1)
- [ ] Player belajar + tracking progress per lesson (`LessonProgress`)
- [ ] Kerjakan Quiz + auto-grading
- [ ] Unduh Sertifikat
- [ ] Riwayat Transaksi
- [ ] Beri Rating & Review pada course yang diikuti 
- [ ] **Lihat progres gabungan roadmap yang diikuti**

**Admin**
- [x] Login (role admin)
- [x] Dashboard statistik penjualan
- [x] CRUD Course, Lesson, Kategori
- [ ] **CRUD Roadmap (pilih & urutkan course anggota)**
- [ ] Atur Harga & Status Gratis/Berbayar
- [ ] CRUD Quiz & Soal
- [ ] List Member & Transaksi
- [ ] Moderasi Review (sembunyikan/hapus)

**Backend**
- [ ] Skema database + relasi (`schema.prisma`) sesuai §15, termasuk `LessonProgress`, `Review`, **`Roadmap`, `RoadmapCourse`**
- [ ] Middleware `authenticate` & `authorize(role)` di semua route privat
- [ ] Endpoint checkout + webhook Midtrans (dengan validasi signature, `enabled_payments` sesuai §21.1)
- [ ] Endpoint verifikasi Google id_token (`google-auth-library`) + auto-link akun
- [ ] Endpoint agregasi Leaderboard per bulan
- [ ] **Endpoint agregasi progres Roadmap per member**
- [ ] Generator nomor transaksi & sertifikat (anti race condition)
- [ ] Generator PDF sertifikat

### 27.2 Tech Stack Final

| Komponen | Pilihan | Alasan |
|---|---|---|
| Frontend | React + **TypeScript** (Vite) + Fetch/Axios + JWT | Wajib dari dosen; TypeScript menambah keamanan tipe di sisi client |
| Styling | Tailwind CSS (class-based dark mode) | Cepat membangun UI bergaya buildwithangga.com, dark mode konsisten lewat satu toggle class |
| Smooth Scroll | Lenis | Scroll halus di halaman publik |
| Animasi | GSAP + ScrollTrigger | Animasi hero text, scroll reveal, counter statistik/leaderboard, podium reveal |
| Backend | Express + **TypeScript** | Belajar MVC & Middleware dari nol, tipe data konsisten dengan Prisma Client |
| ORM | Prisma | Migration otomatis, type-safe, auto-generate tipe TypeScript |
| Database | PostgreSQL | RDBMS kuat untuk relasi transaksi, enrollment, dan roadmap |
| Auth | JWT + bcrypt | Autentikasi stateless, password ter-hash |
| Auth Pihak Ketiga | Google Identity Services + google-auth-library | Login cepat 1 klik tanpa password baru |
| Validasi | Zod | Validasi request body di Express, tipe hasil validasi otomatis via `z.infer` |
| Upload File | Multer + Cloudinary | Thumbnail course, thumbnail roadmap, PDF sertifikat |
| Payment | Midtrans Snap (Sandbox) | Kanal resmi dirinci di §21.1 |
| Video Materi | YouTube embed (iframe) | Tidak perlu simpan file video sendiri |

### 27.3 Referensi Desain
- **buildwithangga.com** — acuan utama gaya UI/UX & fitur gamifikasi: hero animasi, marquee logo tools, course card + rating, leaderboard dengan podium top-3, FAQ accordion, **struktur menu Roadmap/career-path**.
- **santrikoding.com** — acuan model bisnis single-provider (bukan marketplace multi-mentor), **struktur roadmap multi-modul**, gaya marquee kartu chip, dan struktur footer.
- **cakap.com** — acuan struktur section pencapaian (achievement/stat band) dan blok Metode Pembayaran di footer.

### 27.4 Contoh Kategori Kelas (Fokus Bahasa Inggris)
Grammar, Vocabulary, Speaking, Listening, Writing, Persiapan TOEFL, Persiapan IELTS, Business English, English for Beginners, English Conversation. Level course dapat memakai label sederhana (Pemula/Menengah/Mahir) dengan opsi mencantumkan referensi level CEFR (A1–C2) di deskripsi course.

### 27.5 Contoh Roadmap Belajar Awal (Seed Data) — Baru
| Roadmap | Urutan Course |
|---|---|
| Jalur Siap TOEFL | Grammar Dasar untuk Pemula → Grammar Lanjutan: Conditional & Passive Voice → Persiapan TOEFL ITP |
| Jalur Siap IELTS Academic | Vocabulary Booster: 1000 Kata Penting → Writing Academic Essay → Persiapan IELTS Academic |
| Jalur Karier: Business English | Grammar Dasar untuk Pemula → Speaking Percaya Diri untuk Kerja → Business English Essentials → Business English: Meeting & Presentation |

---

## 28. Design System / UI Specification

> Section ini dibuat khusus agar **AI/developer frontend** punya semua data visual yang dibutuhkan tanpa harus menebak — warna, tipografi, ikon, komponen, sampai microcopy. Kode warna & font di bawah adalah **rekomendasi konkret bergaya buildwithangga.com** (bersih, modern, dengan ungu sebagai warna utama) berdasarkan pengamatan langsung struktur & nuansa visual situs tersebut — bukan hasil color-picking presisi dari CSS asli mereka (butuh inspect element manual untuk itu). Tim bebas menyesuaikan asal konsisten dipakai di seluruh halaman.

### 28.1 Filosofi Desain
Bersih, modern, banyak *whitespace*, terasa terpercaya (karena menjual produk berbayar), dengan **ungu sebagai warna utama** (kesan kreatif, modern, mendukung branding edukasi bahasa) dan biru sebagai warna aksen pelengkap, plus sedikit gradient di elemen CTA/hero — meniru kesan BuildWithAngga: rapi, ramah, tidak kaku. **Dark mode mengikuti filosofi yang sama** — warna brand (ungu/biru) tetap dipertahankan vibrant di atas permukaan gelap, bukan di-desaturasi. **Seluruh elemen visual memakai ikon (Lucide), bukan emoji** — konsisten di semua microcopy, toast, dan heading, supaya tampilan tetap profesional dan tidak bergantung pada rendering emoji platform yang bisa berbeda-beda di tiap OS/browser.

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
| `gray-50` | `#F9FAFB` | Background halaman (mode terang) |
| `gray-100` | `#F3F4F6` | Background card alternatif (mode terang) |
| `gray-200` | `#E5E7EB` | Border/divider (mode terang) |
| `gray-500` | `#6B7280` | Teks sekunder/caption |
| `gray-700` | `#374151` | Teks body |
| `gray-900` | `#111827` | Teks heading (mode terang) |
| `success` | `#22C55E` | Badge "Gratis", status Diterima/Sukses |
| `warning` | `#F59E0B` | Status pending, level "Menengah" |
| `danger` | `#EF4444` | Status gagal/error, tombol hapus |
| `info` | `#0EA5E9` | Notifikasi informasi netral |
| Gradient Hero | `linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)` | Background hero section, badge "Premium" (mode terang) |

#### Dark Mode — **Wajib (Must have)**, diaktifkan via toggle di navbar

v3.0 menulis dark mode sebagai "Could have"; v3.1 menaikkannya jadi **requirement resmi** (lihat FR-43). Strategi Tailwind: `darkMode: "class"` — class `dark` ditambahkan ke elemen `<html>` saat toggle aktif, preferensi tersimpan di `localStorage` dan mengikuti `prefers-color-scheme` pada kunjungan pertama.

| Token | Hex | Pemakaian |
|---|---|---|
| `surface-dark` | `#0B0F19` | Background utama halaman (pengganti `gray-50`) |
| `surface-darkcard` | `#131826` | Background card/panel/modal (pengganti `white`) |
| `primary-500`/`600` | *(sama seperti mode terang)* | Warna brand dipertahankan vibrant, tidak di-desaturasi |
| Border | `gray-800` (`#1F2937`) | Pengganti `gray-200` untuk border card/divider |
| Teks heading | `white` | Pengganti `gray-900` |
| Teks body | `gray-300` (`#D1D5DB`) | Pengganti `gray-700` |
| Teks sekunder | `gray-400` (`#9CA3AF`) | Pengganti `gray-500` |
| Gradient Hero (dark) | `linear-gradient(135deg, #6D28D9 0%, #1D4ED8 100%)` | Versi gradient hero yang sedikit lebih gelap, menjaga kontras dengan teks putih |

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
| Leaderboard | `Trophy`, `Crown` (posisi #1), `Medal` |
| **Roadmap** | **`Route`, `Map`** |
| Rating | `Star` (filled/outline) |
| Harga/Beli | `ShoppingCart` |
| Progress/Waktu | `Clock` |
| **Toggle Dark Mode** | **`Sun` (mode terang aktif), `Moon` (mode gelap aktif)** |
| Notifikasi sukses | `CheckCircle2` (warna success) |
| Notifikasi gagal | `XCircle` (warna danger) |

Ukuran standar: 16px (inline teks), 20–24px (tombol/navbar), 32–48px (ikon kategori/feature card).

### 28.5 Spacing, Radius & Shadow
- **Spacing scale:** ikuti default Tailwind (4px basis): `1`=4px, `2`=8px, `3`=12px, `4`=16px, `6`=24px, `8`=32px, `12`=48px, `16`=64px.
- **Border radius:** Card = `rounded-xl`/`rounded-2xl` (12–16px), Tombol = `rounded-lg` (8px), Badge/Pill = `rounded-full`, Input = `rounded-md`/`rounded-lg` (6–8px).
- **Shadow:** Card default `shadow-sm`, Card hover `shadow-md`/`shadow-lg`/`shadow-xl` (tergantung elevasi), Modal/Dropdown `shadow-xl`.
- **Container:** max-width `1280px` (`max-w-7xl`), padding horizontal 16px (mobile) – 24px (desktop).

### 28.6 Komponen UI Kunci

| Komponen | Spesifikasi Visual |
|---|---|
| Tombol Primary | Background `primary-600`, teks putih, `rounded-lg`, padding 12px 24px, hover `primary-700` + transisi 150ms |
| Tombol Outline | Border `primary-600` 1.5px, teks `primary-600`, background transparan, hover background `primary-50` (dark: `primary-500/10`) |
| Course Card | `rounded-2xl`, `shadow-sm`→`shadow-xl` on hover + translate-y, thumbnail rasio 16:9 dengan overlay gradient saat hover, badge Gratis (hijau)/Premium (gradient ungu) di pojok kiri-atas thumbnail, badge jumlah siswa di pojok kiri-bawah, rating bintang + harga + tombol "Lihat Detail" yang muncul saat hover |
| Badge Level | Pill kecil: Pemula (hijau soft), Menengah (kuning soft), Mahir (ungu soft) — dengan varian dark mode |
| Navbar | Putih (dark: `surface-dark`) dengan `backdrop-blur`, sticky top, `shadow-sm` muncul saat halaman di-scroll, toggle dark mode di kanan |
| Progress Bar | `rounded-full`, warna `primary-500`, animasi lebar (transition-width 300ms) |
| Toast Notifikasi | Posisi top-right, ikon sesuai jenis (sukses/gagal/info), auto-dismiss 3–4 detik |
| **Podium Leaderboard** | **3 pedestal dengan tinggi berbeda (rank 1 tertinggi di tengah), gradient warna emas/perak/perunggu, avatar bercincin warna sesuai rank, mahkota untuk rank 1** |
| **Roadmap Stepper** | **Garis vertikal penghubung antar langkah, lingkaran nomor urut (atau centang bila selesai) di tiap langkah, kartu course di sisi kanan tiap langkah** |
| **Filter Chip** | **Pill dengan ikon, state aktif berwarna `primary-600` solid dengan teks putih, state tidak aktif berwarna putih/`surface-darkcard` dengan border** |

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
| Toast bayar sukses | "Pembayaran berhasil! Selamat belajar." |
| Toast bayar gagal | "Pembayaran gagal atau dibatalkan. Silakan coba lagi." |
| Label progress | "{progress}% selesai" |
| Empty state "Kelas Saya" | "Kamu belum mengikuti kelas apapun. Yuk mulai belajar!" |
| Tombol tandai selesai | "Tandai Selesai" |
| Tombol kerjakan quiz | "Kerjakan Quiz" |
| Quiz lulus | "Selamat, kamu lulus dengan skor {score}!" |
| Quiz gagal | "Skor kamu {score}, belum mencapai nilai minimum ({passingGrade}). Yuk coba lagi!" |
| Tombol ulangi quiz | "Ulangi Quiz" |
| Tombol unduh sertifikat | "Unduh Sertifikat" |
| Verifikasi sertifikat valid | "Sertifikat ini valid" (ditandai ikon `ShieldCheck`, bukan emoji) |
| Verifikasi sertifikat invalid | "Nomor sertifikat tidak ditemukan." |
| CTA review | "Beri Rating & Ulasan" |
| Placeholder komentar review | "Ceritakan pengalaman belajarmu di kelas ini..." |
| Empty state review | "Belum ada ulasan untuk kelas ini. Jadilah yang pertama!" |
| Judul leaderboard | "Papan Peringkat Siswa Teraktif" |
| Subjudul leaderboard | "Peringkat direset setiap awal bulan" |
| **Judul daftar roadmap** | **"Roadmap Belajar"** |
| **Subjudul daftar roadmap** | **"Tidak tahu harus mulai dari mana? Ikuti jalur yang sudah disusun bertahap."** |
| **Label progres roadmap** | **"Progres Gabungan Kamu: {progress}%"** |
| **Ajakan login di roadmap** | **"Masuk untuk melacak progres gabunganmu di roadmap ini"** |
| Toast admin sukses simpan | "Berhasil disimpan" |
| Toast admin sukses hapus | "Berhasil dihapus" |
| Toast admin gagal | "Terjadi kesalahan, silakan coba lagi." |
| Konfirmasi hapus | "Yakin ingin menghapus {item} ini? Tindakan ini tidak bisa dibatalkan." |

### 28.8 Referensi Visual
Struktur & elemen yang diadopsi dari pengamatan langsung situs referensi: layout hero + marquee kartu chip berjalan, gaya course card (thumbnail + badge + rating + harga), whitespace lega antar section, sudut membulat (`rounded-xl`/`rounded-2xl`) pada card, FAQ accordion bergaya kartu bernomor, susunan navbar sticky, **podium leaderboard 3 besar**, **struktur roadmap multi-modul**, dan **blok Metode Pembayaran di footer**. Nuansa warna dengan **ungu sebagai warna utama** (biru sebagai pelengkap) dipilih untuk mendekati kesan visual serupa sekaligus memberi identitas brand yang khas, konsisten di mode terang maupun gelap.

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

**`GET /courses?category=grammar&level=Pemula&isFree=true&search=toefl&sort=populer&page=1&limit=12`**

Parameter `sort` (baru v3.1): `terbaru` | `populer` | `harga-rendah` | `harga-tinggi` — opsional, default urutan relevansi biasa.

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

Backend membentuk request ke Midtrans Snap dengan `enabled_payments` sesuai §21.1 (bukan seluruh kanal yang didukung Midtrans — hanya yang sudah diputuskan aktif untuk platform ini).

```json
// Request
{ "courseId": "uuid" }

// Payload internal ke Midtrans Snap (bukan dikirim ke frontend, hanya ilustrasi)
// {
//   "transaction_details": { "order_id": "TRX-20260923-000123", "gross_amount": 150000 },
//   "enabled_payments": [
//     "credit_card", "bca_va", "bni_va", "bri_va", "echannel", "permata_va",
//     "gopay", "shopeepay", "other_qris"
//   ]
// }

// Response 201
{ "success": true, "data": { "transactionNumber": "TRX-20260923-000123", "snapToken": "abc123...", "redirectUrl": "https://app.sandbox.midtrans.com/snap/v2/vtweb/abc123" } }
```

**`POST /transactions/webhook`** (dipanggil server Midtrans, bukan client)
```json
// Request (contoh field penting dari Midtrans)
{ "order_id": "TRX-20260923-000123", "transaction_status": "settlement", "payment_type": "gopay", "gross_amount": "150000.00", "signature_key": "..." }

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

### 29.10 Roadmap — Baru

**`GET /roadmaps`**
```json
// Response 200
{
  "success": true,
  "data": [
    {
      "id": "uuid", "title": "Jalur Siap TOEFL", "slug": "jalur-siap-toefl",
      "description": "...", "thumbnailUrl": "...", "courseCount": 3
    }
  ]
}
```

**`GET /roadmaps/:slug`**
```json
// Response 200
{
  "success": true,
  "data": {
    "id": "uuid", "title": "Jalur Siap TOEFL", "description": "...",
    "courses": [
      { "order": 1, "course": { "id": "uuid", "slug": "grammar-dasar-pemula", "title": "Grammar Dasar untuk Pemula", "level": "Pemula", "price": 0, "isFree": true } },
      { "order": 2, "course": { "id": "uuid", "slug": "grammar-lanjutan-conditional-passive", "title": "Grammar Lanjutan", "level": "Mahir", "price": 119000, "isFree": false } },
      { "order": 3, "course": { "id": "uuid", "slug": "persiapan-toefl-itp", "title": "Persiapan TOEFL ITP", "level": "Menengah", "price": 150000, "isFree": false } }
    ]
  }
}

// Response 404
{ "success": false, "message": "Roadmap tidak ditemukan" }
```

**`GET /me/roadmap-progress/:roadmapId`** (privat, member)
```json
// Response 200
{ "success": true, "data": { "roadmapId": "uuid", "progress": 62 } }
```

**`POST /admin/roadmaps`** (privat, admin)
```json
// Request
{
  "title": "Jalur Siap TOEFL", "slug": "jalur-siap-toefl", "description": "...",
  "thumbnailUrl": "https://res.cloudinary.com/.../roadmap-toefl.jpg", "published": true,
  "courseIds": ["uuid-course-1", "uuid-course-2", "uuid-course-3"]
}
// Catatan: urutan elemen di array courseIds menentukan kolom `order` di RoadmapCourse

// Response 201
{ "success": true, "data": { "id": "uuid", "slug": "jalur-siap-toefl" } }
```

**`PUT /admin/roadmaps/:id`** (privat, admin) — payload sama seperti create, menimpa seluruh relasi `RoadmapCourse` sesuai `courseIds` baru.

**`DELETE /admin/roadmaps/:id`** (privat, admin)
```json
// Response 200
{ "success": true, "data": { "deleted": true } }
```

### 29.11 Leaderboard

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

### 29.12 Upload File (Thumbnail Course/Roadmap)

**Keputusan final (wajib diikuti, ini titik sambung paling rawan beda asumsi antara AI frontend & backend):** upload file **selalu lewat backend**, bukan langsung dari frontend ke Cloudinary. Alasan: validasi tipe/ukuran file terpusat di server (§20), dan frontend AI tidak perlu tahu credential Cloudinary sama sekali.

**Alur:** Frontend kirim `multipart/form-data` berisi file gambar ke endpoint di bawah → backend (Multer) validasi & upload ke Cloudinary → backend balas URL hasil upload → frontend pakai URL itu saat mengisi field `thumbnailUrl` di form create/edit course **atau roadmap**.

**`POST /admin/upload`** (`Content-Type: multipart/form-data`, field name: `file`)
```json
// Response 201
{ "success": true, "data": { "url": "https://res.cloudinary.com/.../course-thumbnail-abc123.jpg" } }

// Response 400 (tipe/ukuran tidak valid)
{ "success": false, "message": "File harus berupa gambar (jpg/png) maksimal 2MB" }
```

### 29.13 Admin — Contoh Pola CRUD (pola sama untuk Lesson, Category, Quiz, Question)

**`POST /admin/courses`**
```json
// Request (thumbnailUrl diisi dari hasil endpoint upload di §29.12, bukan file mentah)
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

### 29.14 Catatan Kontrak Lintas AI (Backend & Frontend Dibangun Terpisah)

> Section ini khusus untuk skenario backend & frontend dibangun oleh **AI/tool berbeda dalam sesi terpisah** (mis. backend oleh Claude, frontend oleh Gemini) — keduanya tidak saling tahu apa yang satu sama lain kerjakan. Nilai & konvensi berikut **wajib sama persis** di kedua sisi agar hasilnya nyambung tanpa perlu debugging integrasi manual:

| Hal yang harus sama persis | Nilai/Konvensi yang dipakai |
|---|---|
| Format response API | `{ success, data }` / `{ success, message, errors }` — lihat §29.1 |
| Cara kirim token | Header `Authorization: Bearer <token>`, **bukan** cookie (lihat §20) |
| Tempat simpan token di client | `localStorage`, key bebas asal konsisten (mis. `lms_token`) |
| Base path API | `/api/v1` di depan semua endpoint |
| Nama field JSON | Mengikuti persis nama kolom di ERD §15 (camelCase, mis. `thumbnailUrl`, `avgRating`, `isFree`) — jangan diterjemahkan/diubah ke istilah lain di frontend |
| Google OAuth Client ID | **Satu nilai yang sama** dipakai frontend (inisialisasi tombol Google Identity Services) dan backend (`audience` saat `verifyIdToken`) — ambil dari Google Cloud Console yang sama |
| Upload file | Selalu lewat backend (`POST /admin/upload`), frontend tidak pernah upload langsung ke Cloudinary (§29.12) |
| Cara enum ditulis | Selalu UPPERCASE untuk role (`MEMBER`/`ADMIN`) dan status transaksi lowercase (`pending`/`success`/`failed`/`expired`) — ikuti persis contoh di §29, jangan ubah casing |
| **Daftar `enabled_payments` Midtrans Snap** | **Harus sama persis dengan §21.1 — kedua sisi (atau sisi yang membangun backend) mengacu ke tabel kanal resmi tsb, bukan menebak sendiri kanal mana yang aktif** |
| **Nama field Roadmap** | **`title`, `slug`, `description`, `thumbnailUrl`, `published`, `courses` (array `{ order, course }`) — ikuti persis §15.14–§15.15 dan §29.10, jangan ganti jadi istilah lain seperti "path"/"track"/"journey"** |

**Rekomendasi praktis:** saat memberi prompt ke masing-masing AI, sertakan **section §29 (API Specification), §21.1 (Payment Gateway), dan §15 (ERD) secara utuh** ke kedua sisi (bukan cuma bagian yang "relevan") — supaya AI backend tahu persis apa yang frontend harapkan, dan AI frontend tahu persis apa yang backend sediakan, walau mereka bekerja di sesi/tool yang berbeda dan tidak saling berkomunikasi langsung.
