# PANDUAN INSTALASI ZELC LMS

## Prasyarat

Sebelum memulai instalasi, pastikan perangkat Anda sudah terinstall:

- [ ] **Node.js** (v18+ atau v20+) - [Download di nodejs.org](https://nodejs.org/)
- [ ] **PostgreSQL** (v14+) - Bisa pakai [PostgreSQL resmi](https://www.postgresql.org/download/) atau [pgAdmin](https://www.pgadmin.org/)
- [ ] **Git** - [Download di git-scm.com](https://git-scm.com/downloads)
- [ ] **Code Editor** (VS Code direkomendasikan)

## 1. Clone Repository

Clone repository ini ke komputer lokal Anda:

```bash
git clone <url-repository-anda>
cd engclass-lms
```

## 2. Setup Backend

Masuk ke folder backend dan install dependency:

```bash
cd engclass-lms-backend/backend
npm install
```

### 2a. Konfigurasi Environment Variables (Backend)

Buat file `.env` berdasarkan `.env.example`:

```bash
copy .env.example .env  # Windows CMD
# atau
cp .env.example .env    # Git Bash/PowerShell
```

Lalu buka file `.env` dan isi nilai-nilai berikut:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/lms_english?schema=public"

# JWT
JWT_SECRET=isi_dengan_string_acak_minimal_32_karakter
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com

# Midtrans Sandbox
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxx
```

> **Catatan:**
> - `DATABASE_URL`: Sesuaikan dengan username, password, host, port PostgreSQL Anda
> - Untuk testing lokal, Anda bisa menggunakan akun Midtrans Sandbox gratis di [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com/)
> - Google OAuth Client ID bisa dibuat di [console.cloud.google.com](https://console.cloud.google.com/)

### 2b. Setup Database dengan Prisma

Jalankan migrasi untuk membuat tabel database:

```bash
npx prisma migrate dev --name init
```

Jalankan seeder untuk mengisi data awal (kategori, roadmap, dll):

```bash
npx prisma db seed
```

Atau jika ingin generate Prisma Client ulang:

```bash
npx prisma generate
```

## 3. Setup Frontend

Buka terminal baru, masuk ke folder frontend dan install dependency:

```bash
cd engclass-lms-frontend/lms-frontend
npm install
```

### 3a. Konfigurasi Environment Variables (Frontend)

Buat file `.env` berdasarkan `.env.example`:

```bash
copy .env.example .env  # Windows CMD
# atau
cp .env.example .env    # Git Bash/PowerShell
```

Lalu isi sesuai kebutuhan:

```env
# URL base API backend
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Google Client ID (WAJIB sama dengan backend)
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxx.apps.googleusercontent.com

# Gunakan true untuk mock data tanpa backend, false untuk konek ke backend real
VITE_USE_MOCK=false
```

> **Rekomendasi untuk testing full-stack:** Set `VITE_USE_MOCK=false` setelah backend berjalan.

## 4. Verifikasi Instalasi

Setelah semua setup selesai, pastikan tidak ada error TypeScript:

**Cek Frontend:**
```bash
cd engclass-lms-frontend/lms-frontend
npx tsc --noEmit
```

**Cek Backend:**
```bash
cd engclass-lms-backend/backend
npx tsc --noEmit
```

Kedua perintah di atas harus mengembalikan output tanpa error (`0 errors`).
