# CARA MENJALANKAN APLIKASI DI LOCAL DEVELOPMENT

## Prasyarat Sebelum Menjalankan

Pastikan langkah-langkah di `PANDUAN_INSTALASI.md` sudah selesai, terutama:
- [x] Database PostgreSQL sudah aktif
- [x] Migrasi Prisma berhasil (`prisma migrate dev`)
- [x] Seeder berhasil dijalankan (`prisma db seed`)
- [x] File `.env` sudah terisi dengan benar (frontend & backend)

## 1. Menjalankan Backend (Express API)

Buka terminal pertama, masuk ke folder backend:

```bash
cd engclass-lms-backend/backend
```

Jalankan server development:

```bash
npm run dev
```

Jika berhasil, akan muncul output seperti:

```text
Server running on port 5000
Connected to database
```

**Port Backend:** `http://localhost:5000`

**Base API:** `http://localhost:5000/api/v1`

## 2. Menjalankan Frontend (React + Vite)

Buka terminal kedua, masuk ke folder frontend:

```bash
cd engclass-lms-frontend/lms-frontend
```

Jalankan aplikasi frontend:

```bash
npm run dev
```

Jika berhasil, akan muncul output seperti:

```text
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Buka browser dan akses: **[http://localhost:5173](http://localhost:5173)**

## 3. Port yang Digunakan

| Aplikasi | Port | URL |
|---|---|---|
| **Frontend (Vite)** | 5173 | http://localhost:5173 |
| **Backend (Express)** | 5000 | http://localhost:5000/api/v1 |

## 4. Akun Demo untuk Testing

Setelah seeder dijalankan, tersedia akun demo berikut untuk keperluan testing:

### Akun Admin
- **Email:** `admin@zelc.id`
- **Password:** `admin123`
- **Role:** ADMIN
- **Akses:** Panel Admin (`/admin/*`) - Kelola Kelas, Kategori, Roadmap, Member, Transaksi

### Akun Member (Contoh)
- **Email:** `dimas@zelc.id`
- **Password:** `password123`
- **Role:** MEMBER
- **Akses:** Dashboard Member (`/member/*`) - Belajar, Transaksi, Profil, Sertifikat

> **Catatan:** Password bisa berbeda tergantung data yang di-seed. Jika ingin login dengan Google, pastikan `GOOGLE_CLIENT_ID` sudah dikonfigurasi dengan benar di frontend & backend.

## 5. Tips Menjalankan Bersamaan

Disarankan menjalankan **kedua terminal secara bersamaan** (backend + frontend) agar aplikasi bisa berfungsi penuh dengan Real API.

- Terminal 1: `npm run dev` (backend) - biarkan berjalan
- Terminal 2: `npm run dev` (frontend) - biarkan berjalan

## 6. Mode Mock vs Real API

- **Mode Real API** (`VITE_USE_MOCK=false`): Frontend terhubung ke backend Express + PostgreSQL. Semua fitur berjalan sesuai database.
- **Mode Mock** (`VITE_USE_MOCK=true`): Frontend menggunakan data dummy lokal tanpa backend. Cocok untuk UI testing cepat.
