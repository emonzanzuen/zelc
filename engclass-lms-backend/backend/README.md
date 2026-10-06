# LMS Bahasa Inggris — Backend API

Backend untuk website LMS Bahasa Inggris Berbayar. Dibangun dengan **Express + TypeScript + Prisma + PostgreSQL**, sesuai PRD (§15, §16, §17, §20, §21, §29).

Struktur folder ini **berdiri sendiri** — bisa dijalankan tanpa menunggu frontend selesai, selama frontend mengikuti kontrak di PRD §29 (API Specification).

---

## 1. Yang perlu disiapkan DI LUAR folder ini (wajib sebelum menjalankan)

Backend ini bergantung pada 4 layanan eksternal. Tanpa ini, server tidak akan bisa start (env validation akan menolak).

### 1.1 Database PostgreSQL

Pilih salah satu (paling mudah: opsi A):

**A. Supabase (gratis, tanpa install apa pun)**
1. Buat akun di [supabase.com](https://supabase.com) → New Project.
2. Setelah project dibuat, buka **Project Settings → Database → Connection String → URI**.
3. Salin connection string-nya (bentuknya seperti `postgresql://postgres:[PASSWORD]@db.xxxx.supabase.co:5432/postgres`).
4. Tempel ke variabel `DATABASE_URL` di file `.env` (langkah 2 di bawah).

**B. PostgreSQL lokal di komputer sendiri**
1. Install PostgreSQL: [postgresql.org/download](https://www.postgresql.org/download/).
2. Buat database baru:
   ```bash
   psql -U postgres
   CREATE DATABASE lms_english;
   \q
   ```
3. `DATABASE_URL` menjadi: `postgresql://postgres:PASSWORD_KAMU@localhost:5432/lms_english?schema=public`

**C. Railway / Neon / Aiven** — sama-sama menyediakan PostgreSQL gratis, tinggal salin connection string yang mereka berikan.

### 1.2 Google OAuth Client ID (untuk fitur "Login dengan Google")

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → buat project baru (atau pakai yang sudah ada).
2. Menu **APIs & Services → Credentials → Create Credentials → OAuth Client ID**.
3. Pilih tipe **Web application**.
4. Di **Authorized JavaScript origins**, tambahkan URL frontend kamu, misalnya `http://localhost:5173`.
5. Simpan, lalu salin **Client ID** yang muncul (bentuknya `xxxxx.apps.googleusercontent.com`).
6. ⚠️ **Penting:** Client ID ini harus dipakai **PERSIS SAMA** di frontend (lihat PRD §29.13) — beri tahu tim/AI yang membangun frontend nilai ini.

### 1.3 Midtrans Sandbox (payment gateway)

1. Daftar di [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com/register).
2. Setelah login, buka **Settings → Access Keys**.
3. Salin **Server Key** dan **Client Key** (yang sandbox, biasanya berawalan `SB-Mid-server-` dan `SB-Mid-client-`).

### 1.4 Cloudinary (untuk upload thumbnail kelas)

1. Daftar gratis di [cloudinary.com](https://cloudinary.com).
2. Di halaman **Dashboard**, salin: **Cloud Name**, **API Key**, **API Secret**.

---

## 2. Setup project (di dalam folder ini)

```bash
# 1. Install dependency
npm install

# 2. Salin file environment
cp .env.example .env
```

Lalu buka `.env` dan isi semua nilai yang sudah kamu siapkan di langkah 1 (DATABASE_URL, GOOGLE_CLIENT_ID, MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, CLOUDINARY_*). Untuk `JWT_SECRET`, isi string acak apa saja yang panjang (minimal 32 karakter), contoh cara generate cepat:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# 3. Generate Prisma Client (wajib, ini membuat tipe TypeScript dari schema.prisma)
npx prisma generate

# 4. Jalankan migration (membuat semua tabel di database sesuai §15 PRD)
npx prisma migrate dev --name init

# 5. (Opsional tapi disarankan) isi data contoh: 1 admin + beberapa kelas
npm run seed
```

Setelah seed berhasil, kamu akan lihat pesan berisi kredensial admin:
```
✅ Seed selesai.
   Login admin: admin@lmsenglish.test / admin12345
```

```bash
# 6. Jalankan server development
npm run dev
```

Server berjalan di `http://localhost:5000`. Cek dengan buka `http://localhost:5000/health` di browser — kalau muncul `{"success":true,...}` berarti sudah jalan.

---

## 3. Struktur folder

```
backend/
├── prisma/
│   ├── schema.prisma      # Skema database (§15 PRD)
│   └── seed.ts            # Data contoh
├── src/
│   ├── config/env.ts      # Validasi environment variable
│   ├── lib/               # Prisma client, JWT, Google Auth, Cloudinary, Midtrans
│   ├── middleware/        # authenticate, authorize, validate, upload, errorHandler
│   ├── utils/             # response helper, generator kode, retry logic
│   ├── modules/           # 1 folder per fitur: routes + controller + service
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── courses/
│   │   ├── lessons/
│   │   ├── enrollments/
│   │   ├── transactions/
│   │   ├── quiz/
│   │   ├── certificates/
│   │   ├── reviews/
│   │   ├── leaderboard/
│   │   ├── admin/
│   │   └── upload/
│   ├── app.ts              # Wiring semua routes
│   └── server.ts           # Entry point
├── .env.example
└── package.json
```

Semua endpoint mengikuti kontrak di **PRD §29 (API Specification)** — format response `{ success, data }` / `{ success, message, errors }`, base path `/api/v1`, token via header `Authorization: Bearer <token>`.

---

## 4. Menghubungkan Midtrans webhook (opsional, untuk testing pembayaran end-to-end)

Midtrans perlu bisa memanggil endpoint `POST /api/v1/transactions/webhook` di backend kamu. Kalau backend masih jalan di `localhost`, Midtrans (di internet) tidak bisa mengaksesnya langsung. Solusinya:

1. Install [ngrok](https://ngrok.com/download) (gratis) atau pakai [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/).
2. Jalankan: `ngrok http 5000` → akan muncul URL publik seperti `https://abcd1234.ngrok-free.app`.
3. Masuk ke **dashboard.sandbox.midtrans.com → Settings → Configuration**, isi **Payment Notification URL** dengan `https://abcd1234.ngrok-free.app/api/v1/transactions/webhook`.
4. Sekarang saat kamu checkout via Midtrans Sandbox, notifikasi status pembayaran akan sampai ke backend lokal kamu.

---

## 5. Script yang tersedia

| Command | Fungsi |
|---|---|
| `npm run dev` | Jalankan server development (auto-reload) |
| `npm run build` | Compile TypeScript ke `dist/` |
| `npm start` | Jalankan hasil build (untuk production) |
| `npm run type-check` | Cek error TypeScript tanpa build (`tsc --noEmit`) |
| `npm run prisma:generate` | Generate ulang Prisma Client setelah `schema.prisma` diubah |
| `npm run prisma:migrate` | Buat migration baru setelah `schema.prisma` diubah |
| `npm run prisma:studio` | Buka GUI untuk lihat/edit data di database |
| `npm run seed` | Isi ulang data contoh |

---

## 6. Login admin default (setelah seed)

- Email: `admin@lmsenglish.test`
- Password: `admin12345`

⚠️ Ganti/hapus akun ini sebelum deploy ke production.

---

## 7. Catatan penting untuk yang membangun frontend

Lihat **PRD §29.13 (Catatan Kontrak Lintas AI)** — beberapa nilai wajib sama persis dengan frontend:
- Token dikirim via `Authorization: Bearer <token>`, disimpan di localStorage (bukan cookie).
- Google Client ID harus sama persis dengan yang dipakai backend ini.
- Format response API: `{ success, data }` atau `{ success, message, errors }`.
- Upload thumbnail selalu lewat `POST /api/v1/admin/upload`, bukan langsung ke Cloudinary dari frontend.
