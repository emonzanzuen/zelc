# ZELC — Frontend LMS Kursus Bahasa Inggris

**ZELC (Zanzuen English Learning Center)** — *Learn English, Grow Beyond.*

## Akun Demo (Mode Mock)

Selama `VITE_USE_MOCK=true` (default), autentikasi tidak benar-benar memeriksa password — yang membedakan role hanyalah **email** yang dipakai:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@zelc.id` | bebas, isi apa saja (minimal tidak kosong) |
| Member | email lain apa pun, mis. `kamu@mail.com` | bebas, isi apa saja |

Login dengan `admin@zelc.id` akan otomatis diarahkan ke `/admin/dashboard`. Login dengan email lain akan diarahkan ke `/dashboard` (area member). Tombol "Masuk/Daftar dengan Google" selalu masuk sebagai Member (role Admin di dunia nyata biasanya diprovisikan langsung di database, bukan lewat self-register — lihat §6 PRD).

Setelah backend asli tersambung (`VITE_USE_MOCK=false`), role ditentukan oleh kolom `User.role` di database sesungguhnya, bukan pola email ini.

## Riwayat Update

**v1.3 — Rebrand ZELC, Starfield Background, Perbaikan Bug**
- **Rebrand penuh EngClass → ZELC** (Zanzuen English Learning Center, tagline "Learn English, Grow Beyond.") — logo, navbar, footer, judul halaman, favicon (monogram "Z"), email admin (`admin@zelc.id`), PRD di-rename jadi `PRD-ZELC-v3.1.md`.
- **Logo dinormalisasi**: file `logo-light.png` kamu awalnya ter-crop lebih "zoom" dibanding `logo-dark.png` (konten mengisi 72% vs 49% kanvas) — sekarang keduanya di-crop & scale ulang ke rasio pengisian yang sama persis, supaya tidak "loncat ukuran" saat toggle dark mode.
- **Badge Hero "18.000+ Pelajar" tidak lagi melebar melewati batas** — badge kiri & kanan sekarang baru muncul mulai breakpoint `xl` (1280px+), tempat ada gutter kosong asli di luar kolom konten untuk mengambang dengan aman, tidak lagi berisiko tumpang tindih dengan teks hero di lebar layar menengah.
- **Starfield background** (titik-titik berkelip menyerupai bintang) — komponen Canvas kustom, bukan library pihak ketiga (lihat alasannya di bawah), dipasang sebagai lapisan ambient di semua halaman + versi lebih jelas di Hero, header Katalog/Leaderboard, dan hero band dashboard member/admin. Menghormati `prefers-reduced-motion` dan menyesuaikan warna sesuai dark/light mode.
- **3 bug nyata diperbaiki** (ditemukan lewat laporan & audit manual, bukan asumsi):
  - `api.ts` — `Quiz` mock kehilangan field `title` wajib (`tsc` error).
  - `CatalogPage.tsx` — tipe `sort` tidak sinkron antara `FilterState` dan `CourseFilters` (`tsc` error); disatukan jadi `CourseSortOption` di `types/index.ts`.
  - `AdminDashboardPage.tsx` — crash `.map()` di atas `undefined` karena fallback `stats ?? {...}` cuma melindungi level atas, bukan per-field; diganti fungsi `toSafeStats()` yang memberi default ke tiap field.
  - `RoadmapListPage.tsx`, `RoadmapDetailPage.tsx`, `LearningPage.tsx`, `CheckoutPage.tsx` — beberapa halaman sempat mengimpor data dummy langsung dari `mockData.ts` alih-alih lewat `lib/api.ts`, sehingga tidak akan ikut pindah ke data asli saat `VITE_USE_MOCK=false`. Semua sudah dialihkan lewat fungsi `fetch...()` yang sesuai. `Roadmap` (detail) dan `RoadmapSummary` (list) kini juga dipisah jadi dua tipe sesuai kontrak §29.10 PRD, supaya field yang salah pakai ketahuan oleh TypeScript saat compile, bukan error runtime.

**Soal particle library:** project ini tidak memakai library particle pihak ketiga (mis. tsparticles). Alasannya: environment pembuatan project ini tidak punya akses jaringan untuk menjalankan `npm install` dan memverifikasi API/versi library tersebut benar-benar cocok sebelum dikirim — risikonya sama persis dengan bug `Quiz.title` & tipe `sort` di atas (kode yang terlihat benar tapi gagal compile/jalan karena asumsi API yang meleset). Untuk efek dekoratif sederhana seperti ini, komponen Canvas kustom (`src/components/layout/Starfield.tsx`) memberi hasil yang sama persis tanpa dependency tambahan dan saya bisa jamin benar. Kalau kamu tetap ingin pakai tsparticles secara spesifik, saya bisa tuliskan kodenya sebagai referensi — tapi rekomendasikan diuji coba dulu secara terpisah sebelum dipakai.

**v1.2 — Dark Mode Penuh, Fitur Roadmap, Leaderboard & Katalog Upgrade**
- Dark mode kini diterapkan **di seluruh halaman** (publik, member, admin) — sebelumnya hanya landing page.
- Hero: badge mengambang dipindah & diperjelas (latar solid, shadow lebih tegas, posisi aman dari overflow-clip).
- Footer dirombak total: brand card lebih besar, kolom tautan 4 kategori, badge status, dan bagian **Metode Pembayaran** dengan kanal resmi Midtrans Snap (lihat §21.1 `PRD-ZELC-v3.1.md`).
- **Fitur baru: Roadmap Belajar** (`/roadmap`, `/roadmap/:slug`, admin di `/admin/roadmap`) — jalur belajar lintas-kelas dengan progres gabungan, timeline/stepper visual, 3 roadmap contoh sudah di-seed di `mockData.ts`.
- Leaderboard dirombak dengan podium top-3 (gaya buildwithangga.com/leaderboard) + tabel gaya leaderboard game.
- Halaman Katalog Kelas dirombak: header bergaya banner, filter bar lebih clean (ikon per dropdown, chip filter aktif yang bisa dihapus satu-satu, tambahan sort Terbaru/Populer/Harga).
- PRD diperbarui ke **v3.1** — lihat `PRD-ZELC-v3.1.md` di root folder ini untuk detail lengkap perubahan requirement (roadmap, payment gateway, dark mode).

**v1.1 — Upgrade Landing Page Publik**
- Dark mode (toggle ikon matahari/bulan di navbar, tersimpan di localStorage, mengikuti preferensi sistem di kunjungan pertama).
- Section "Pilih Kategori Belajarmu" diubah jadi kartu besar ala buildwithangga.com ("Find Your Course by Category").
- Teks berjalan (marquee) diubah jadi kartu chip dua baris berlawanan arah ala santrikoding.com, bukan teks kalimat polos.
- Section "Kelas" di landing page: header center + filter chip (Semua/Gratis/Populer/Trending/Terbaru).
- Section testimoni & "Kenapa Belajar di ZELC?" dirombak lebih visual (ikon medali, rating, pita pencapaian angka) terinspirasi cakap.com.
- FAQ diubah jadi kartu bernomor dengan eyebrow + emoji ala "Tanya BuildWithAngga".
- Hero: badge mengambang kiri/kanan (bukan foto — lihat catatan di bawah), background grid + gradient blob, 3 kartu stat lebih tegas.
- Course card dirombak lebih profesional (overlay, badge siswa, hover state) ala santrikoding.com.
- Footer dirombak lebih lengkap (kolom tautan + badge kepercayaan + **Metode Pembayaran**) ala santrikoding.com & cakap.com.

Catatan soal foto di Hero: alih-alih foto stok yang tidak representatif untuk LMS fiktif ini, dipakai **badge pencapaian mengambang** (jumlah sertifikat terbit & avatar-inisial pelajar) sesuai saran kamu — lebih aman secara hak cipta dan tetap relevan temanya.


Frontend untuk platform LMS berbayar khusus kursus Bahasa Inggris, dibangun sesuai PRD:
**React + TypeScript (Vite) + Tailwind CSS + Lenis + GSAP/ScrollTrigger + Axios + JWT**.

Struktur tampilan (navbar sticky, hero dengan teks bergerak/marquee, course card,
leaderboard, dsb) terinspirasi dari **buildwithangga.com** dan **santrikoding.com**,
sementara seluruh warna, tipografi, ikon (Lucide), dan microcopy mengikuti Design System
di §28 PRD (ungu `#7C3AED` sebagai warna utama, biru `#3B82F6` sebagai aksen, font
Plus Jakarta Sans untuk heading dan Inter untuk body).

Saat ini project **hanya berisi frontend** — belum ada backend Express yang nyambung.
Supaya UI bisa langsung dicoba dan didemokan, semua data (kelas, kategori, leaderboard,
transaksi, dst) memakai **data dummy** di `src/lib/mockData.ts`, diakses lewat
`src/lib/api.ts` yang sengaja dibuat dengan bentuk fungsi & nama field **persis sama**
dengan kontrak API di §29 PRD — jadi begitu backend-nya jadi, tinggal ganti isi fungsi
di `api.ts` (atau set `VITE_USE_MOCK=false`) tanpa perlu mengubah komponen manapun.

---

## 1. Yang perlu disiapkan di luar folder ini

Project ini **tidak bisa langsung dijalankan** hanya dengan file yang ada — beberapa hal
perlu di-install/disiapkan di komputer kamu dulu:

### 1.1 Install Node.js
Dibutuhkan **Node.js versi 18 atau lebih baru** (disarankan 20 LTS).
Cek dengan:
```bash
node -v
npm -v
```
Kalau belum ada, unduh di https://nodejs.org (pilih versi LTS).

### 1.2 Install dependencies project
Karena sandbox pembuatan project ini tidak punya akses internet, folder `node_modules`
**belum ter-install**. Jalankan ini di terminal, di dalam folder project:
```bash
npm install
```
Ini akan mengunduh React, Tailwind, GSAP, Lenis, Axios, dll sesuai `package.json`.

### 1.3 Salin file environment
```bash
cp .env.example .env
```
Isi `.env` sesuai kebutuhan (lihat §3 di bawah). Untuk mencoba UI dengan data dummy,
**tidak perlu diubah sama sekali** — defaultnya sudah `VITE_USE_MOCK=true`.

### 1.4 Jalankan development server
```bash
npm run dev
```
Buka `http://localhost:5173` di browser.

### 1.5 (Opsional) Build untuk production
```bash
npm run build
npm run preview
```

---

## 2. Struktur Folder

```
src/
├── components/
│   ├── layout/       Navbar, Footer, MarqueeBanner, Layout, DashboardShell, AdminShell
│   ├── ui/            Button, Badge, RatingStars, ProgressBar, Accordion, Modal, Toast, EmptyState
│   ├── sections/      Section-section landing page (Hero, CategoryGrid, Testimonials, FAQ, dst)
│   ├── course/        CourseCard, CourseGrid, CourseFilterBar, ReviewList, ReviewForm
│   └── routing/       ProtectedRoute (member), AdminRoute (admin)
├── pages/
│   ├── public/        Landing, Catalog, CourseDetail, Leaderboard, Login, Register, VerifyCertificate
│   ├── member/        Dashboard, Checkout, Learning (player), Quiz, Certificates, Transactions, Profile
│   └── admin/         AdminDashboard, AdminCourses, AdminCourseLessons, AdminCourseQuiz,
│                       AdminCourseReviews, AdminCategories, AdminMembers, AdminTransactions
├── context/            AuthContext (login/register/logout, JWT di localStorage sesuai §20 PRD)
├── hooks/              useLenis (smooth scroll), useScrollReveal (animasi GSAP saat scroll)
├── lib/
│   ├── api.ts          Semua panggilan API — mengikuti kontrak §29 PRD
│   ├── mockData.ts     Data dummy (kelas, kategori, leaderboard, transaksi, dst)
│   └── utils.ts         Helper format Rupiah, tanggal, dsb
└── types/               Tipe TypeScript mengikuti ERD §15 PRD
```

Routing di `src/App.tsx` mengikuti sitemap §10 PRD persis (`/kelas`, `/leaderboard`,
`/dashboard/belajar/:courseId`, `/admin/kelas/:id/materi`, dst).

---

## 3. Menyambungkan ke Backend Asli (Express + Prisma)

Saat backend sesuai §21 PRD sudah siap:

1. Set di `.env`:
   ```
   VITE_API_BASE_URL=https://api-domain-kamu.com/api/v1
   VITE_USE_MOCK=false
   ```
2. Tidak perlu mengubah komponen apapun — semua pemanggilan data sudah lewat
   `src/lib/api.ts`, yang otomatis memakai `axios` ke `VITE_API_BASE_URL` begitu
   `VITE_USE_MOCK=false`.
3. Token JWT disimpan di `localStorage` (key `lms_token`) dan otomatis dikirim sebagai
   header `Authorization: Bearer <token>` di setiap request (lihat interceptor di
   `src/lib/api.ts`), sesuai keputusan final §20 PRD.

## 4. Login dengan Google

Tombol **"Masuk/Daftar dengan Google"** sudah ada di UI (`LoginPage.tsx`, `RegisterPage.tsx`),
tapi saat ini masih **disimulasikan** (langsung memanggil `googleLogin()` dengan token palsu)
supaya UI bisa dicoba tanpa perlu kredensial Google. Untuk mengaktifkan Google Identity
Services yang sesungguhnya (§20 PRD):

1. Buat OAuth Client ID di [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   (tipe **Web application**), daftarkan `http://localhost:5173` sebagai Authorized
   JavaScript origin saat development.
2. Isi `VITE_GOOGLE_CLIENT_ID` di `.env` dengan Client ID tersebut.
3. Tambahkan script Google Identity Services (`https://accounts.google.com/gsi/client`)
   di `index.html`, lalu ganti pemanggilan `googleLogin("mock-google-id-token")` di
   `LoginPage.tsx` / `RegisterPage.tsx` dengan callback asli dari
   `window.google.accounts.id.initialize(...)` yang mengembalikan `credential`
   (id_token) — kirim `credential` itu ke fungsi `googleLogin` yang sudah ada.
4. Pastikan `VITE_GOOGLE_CLIENT_ID` di frontend **sama persis** dengan `audience` yang
   dipakai backend saat `verifyIdToken` (lihat §29.13 PRD — kontrak lintas AI).

## 5. Rencana Deployment (sesuai §23 PRD)

| Komponen | Platform yang direkomendasikan |
|---|---|
| Frontend ini (hasil `npm run build`, folder `dist/`) | Vercel atau Netlify |
| Backend Express (belum termasuk di project ini) | Railway / Render |
| Database PostgreSQL | Supabase / Railway Postgres |

Untuk Vercel/Netlify: hubungkan repo Git, set build command `npm run build`, output
directory `dist`, dan tambahkan environment variable `VITE_API_BASE_URL` &
`VITE_GOOGLE_CLIENT_ID` sesuai environment production.

---

## 6. Catatan Implementasi

- **Video pembelajaran**: memakai embed YouTube iframe (`youtubeUrl` di data lesson
  diasumsikan berupa ID video YouTube, bukan URL penuh) sesuai §16 & FR-16 PRD.
- **Pembayaran Midtrans**: halaman Checkout mensimulasikan alur Snap (§13.1 PRD) karena
  belum ada backend yang membuatkan Snap token sungguhan. Setelah backend siap, ganti
  logika di `checkoutCourse()` (`src/lib/api.ts`) untuk membuka popup Snap asli
  (`window.snap.pay(snapToken)`) dan sisipkan script `https://app.sandbox.midtrans.com/snap/snap.js`.
- **Generate sertifikat PDF**: proses pembuatan file PDF dilakukan di backend (§19 PRD);
  frontend hanya menampilkan tombol unduh yang memanggil `fileUrl` dari Certificate.
- **Admin CRUD** (kelas, lesson, quiz, kategori, moderasi review) saat ini menyimpan
  perubahan di React state lokal (untuk demo interaksi UI) — begitu backend tersambung,
  setiap fungsi create/update/delete tinggal diarahkan ke endpoint di §29.12 PRD.
- Semua teks UI (tombol, error, toast) memakai microcopy persis dari §28.7 PRD.
- Animasi menghormati `prefers-reduced-motion` (GSAP di-skip, marquee berhenti berjalan).
