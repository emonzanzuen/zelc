# CARA DEPLOY ZELC LMS (Vercel + Railway/Render)

## Overview Arsitektur Deploy

ZELC LMS menggunakan arsitektur monorepo dengan 2 aplikasi terpisah:

| Komponen | Platform Rekomendasi | Kegunaan |
|---|---|---|
| **Frontend (React + Vite)** | [Vercel](https://vercel.com/) | Hosting static SPA dengan CDN global |
| **Backend (Express + TypeScript)** | [Railway](https://railway.app/) atau [Render](https://render.com/) | REST API server |
| **Database (PostgreSQL)** | [Railway Postgres](https://docs.railway.app/databases/postgresql), [Supabase](https://supabase.com/), atau [Neon](https://neon.tech/) | Database Production |

> **Rekomendasi:** Vercel (Frontend) + Railway (Backend + DB) untuk setup paling mudah.

## 1. Persiapan Sebelum Deploy

Sebelum melakukan deploy, pastikan:

- [ ] Repository sudah ter-push ke GitHub/GitLab/Bitbucket
- [ ] File `.env.example` sudah jadi acuan variabel yang dibutuhkan
- [ ] Akun di platform hosting (Vercel, Railway/Render)
- [ ] Akun Midtrans Production (opsional) atau tetap pakai Sandbox untuk testing
- [ ] Akun Cloudinary sudah siap
- [ ] Google OAuth Client ID untuk production sudah dibuat (dengan domain baru)

## 2. Deploy Database Production

Pilih salah satu opsi:

### Opsi A: Railway Postgres (Terintegrasi)
1. Login ke [railway.app](https://railway.app/) → New Project → Provision PostgreSQL
2. Buka tab "Variables" atau "Connect" untuk mendapatkan `DATABASE_URL`
3. Copy connection string (format `postgresql://...`)

### Opsi B: Supabase
1. Login ke [supabase.com](https://supabase.com/) → New Project
2. Masuk ke Project Settings > Database > Connection string → Copy "URI"
3. Ganti `sslmode=require` jika perlu

### Opsi C: Neon
1. Login ke [neon.tech](https://neon.tech/) → Create Project
2. Copy connection string dari dashboard

## 3. Deploy Backend (Railway)

### Langkah Deploy

1. Login ke [railway.app](https://railway.app/) → "Deploy from GitHub repo"
2. Pilih repository Anda
3. Set **Root Directory**: `engclass-lms-backend/backend`
4. Railway akan otomatis detect `package.json`

### Build & Start Command

Railway umumnya auto-detect. Pastikan di `package.json` backend terdapat:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "dev": "tsx watch src/app.ts"
  }
}
```

### Environment Variables (Railway)

Tambahkan semua variabel dari `.env` backend ke Railway → Variables:

| Variabel | Nilai (Production) |
|---|---|
| `PORT` | Biarkan Railway assign (atau 5000) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend-domain.vercel.app` |
| `DATABASE_URL` | Connection string dari DB production |
| `JWT_SECRET` | Buat string acak kuat (min 32 karakter) |
| `JWT_EXPIRES_IN` | `7d` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID untuk production |
| `MIDTRANS_SERVER_KEY` | Midtrans Server Key (Sandbox/Production) |
| `MIDTRANS_CLIENT_KEY` | Midtrans Client Key |
| `MIDTRANS_IS_PRODUCTION` | `false` (sandbox) / `true` (live) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Setelah deploy, Railway akan memberikan URL backend seperti: `https://your-app-name.up.railway.app`

## 4. Jalankan Migrasi & Seed di Production

Setelah backend berhasil deploy & DB terhubung, jalankan migrasi production:

**Opsi 1: Via Railway CLI**
```bash
railway login
railway link
railway run npx prisma migrate deploy
railway run npx prisma db seed
```

**Opsi 2: Via Railway Shell (Web)**
Buka Railway Project → Backend Service → "Shell" → Jalankan:

```bash
npx prisma migrate deploy
npx prisma db seed
```

> **Penting:** Gunakan `prisma migrate deploy` (bukan `migrate dev`) untuk production.

## 5. Deploy Frontend (Vercel)

### Langkah Deploy

1. Login ke [vercel.com](https://vercel.com/) → "Add New Project" → Import GitHub repo
2. Pilih repository Anda
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `engclass-lms-frontend/lms-frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Environment Variables (Vercel)

Tambahkan variabel berikut di Vercel → Settings → Environment Variables:

| Variabel | Nilai |
|---|---|
| `VITE_API_BASE_URL` | `https://your-backend-url.up.railway.app/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | Sama dengan backend (`GOOGLE_CLIENT_ID`) |
| `VITE_USE_MOCK` | `false` |

Setelah disimpan, Vercel akan auto-redeploy. Frontend siap diakses di: `https://your-app.vercel.app`

## 6. Konfigurasi CORS

Pastikan backend mengizinkan origin frontend production. Cek file `src/app.ts` atau konfigurasi CORS di backend.

Contoh konfigurasi yang benar:

```ts
app.use(cors({
  origin: [
    'http://localhost:5173',           // dev
    'https://your-frontend.vercel.app' // production
  ],
  credentials: true
}));
```

Jika belum disesuaikan, update sesuai domain Vercel Anda, lalu redeploy backend.

## 7. Konfigurasi Midtrans Webhook (Opsional tapi Direkomendasikan)

Untuk update status transaksi otomatis saat pembayaran berhasil:

1. Login ke [dashboard.midtrans.com](https://dashboard.midtrans.com/) (Production) atau [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com/) (Sandbox)
2. Masuk ke Settings → Configuration → Notification URL
3. Isi dengan: `https://your-backend-url.up.railway.app/api/v1/webhooks/midtrans`
4. Simpan perubahan

Pastikan endpoint webhook sudah tersedia di backend (`modules/transactions/webhook.controller.ts`).

## 8. Troubleshooting Umum Saat Deploy

| Masalah | Solusi |
|---|---|
| **Build frontend gagal (TS error)** | Jalankan `npx tsc --noEmit` lokal terlebih dahulu. Perbaiki error sebelum push. |
| **CORS Error di browser** | Pastikan `FRONTEND_URL` di backend & `origin` CORS sudah sesuai domain Vercel. |
| **Database connection failed** | Cek `DATABASE_URL` di Railway. Pastikan tidak ada typo & format benar. |
| **Prisma Client missing** | Tambahkan `npx prisma generate` di build command backend, atau pastikan `postinstall` ada di `package.json`. |
| **Google Login tidak berfungsi** | Update Authorized JavaScript origins di Google Cloud Console: tambahkan `https://your-app.vercel.app` |
| **Midtrans Snap tidak muncul** | Cek `MIDTRANS_CLIENT_KEY` di frontend & `MIDTRANS_SERVER_KEY` di backend. Pastikan mode (sandbox/production) konsisten. |
| **404 saat refresh Vercel** | Normal untuk SPA. Vercel sudah handle `vercel.json`? Jika perlu tambahkan rewrite ke `index.html`. |

## 9. Checklist Deploy Selesai

- [ ] Backend live & dapat diakses (`/health` atau root)
- [ ] Migrasi & seed berhasil dijalankan di production DB
- [ ] Frontend bisa login/register normal
- [ ] Google OAuth berfungsi
- [ ] Pembayaran Midtrans (sandbox) berhasil
- [ ] Admin panel dapat diakses dengan akun admin
- [ ] Member bisa belajar & generate sertifikat
- [ ] Verifikasi sertifikat via publik berfungsi
