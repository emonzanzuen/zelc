# ZELC LMS - Sistem Manajemen Pembelajaran

## Deskripsi Project

ZELC LMS adalah aplikasi Learning Management System (LMS) berbasis web yang dirancang untuk platform pembelajaran bahasa Inggris (IELTS). Sistem ini mendukung tiga peran pengguna: Publik (pengunjung), Member (siswa), dan Admin (pengelola). 

Aplikasi dibangun dengan arsitektur monorepo yang terdiri dari frontend (React + Vite) dan backend (Express + Prisma), terintegrasi dengan PostgreSQL, autentikasi JWT + Google OAuth, serta Midtrans Snap untuk pembayaran kelas berbayar.

## Tech Stack

### Frontend (lms-frontend)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Animation:** GSAP
- **UI Components:** Custom components (Modal, Badge, Toast, dll)
- **Form Handling:** React Hook Form (terintegrasi dengan validasi)

### Backend (backend)
- **Framework:** Express.js + TypeScript
- **ORM:** Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken) + Google OAuth 2.0
- **Validation:** Zod
- **File Upload:** Cloudinary + Multer
- **Payment Gateway:** Midtrans Snap (Sandbox/Production)
- **Security:** CORS, Helmet (jika diterapkan), bcryptjs
- **PDF Generation:** pdfkit (untuk sertifikat)

### Lainnya
- **Monorepo Structure:** engclass-lms (root) dengan subfolder frontend & backend
- **Environment Management:** .env
- **TypeScript:** Strict mode di kedua sisi

## Fitur Utama

- **Autentikasi & Otorisasi:** Registrasi, login email/password, login Google OAuth, role-based access (MEMBER/ADMIN)
- **Public Access:** Jelajahi kelas, roadmap belajar, detail kelas, verifikasi sertifikat tanpa login
- **Dashboard Member:** Kelas saya, progres belajar, riwayat transaksi, sertifikat, edit profil
- **Learning Flow:** Halaman belajar dengan modul & materi, tandai materi selesai, tracking progres
- **Quiz Auto-grading:** Quiz akhir per kelas, penentuan kelulusan berdasarkan passing grade
- **Sertifikat PDF:** Otomatis ter-generate saat lulus quiz, dapat diunduh & diverifikasi publik
- **Pembayaran Otomatis:** Integrasi Midtrans Snap untuk kelas berbayar, webhook handling
- **Admin CRUD:** Kelola Kategori, Kelas, Roadmap, Member, Transaksi
- **Real-time UI:** Loading state, error handling, empty state, defensive rendering

## Struktur Folder

```
engclass-lms/
├── submission-docs/        # Dokumentasi untuk pengumpulan (terpisah, tidak mengubah kode)
├── engclass-lms-backend/
│   └── backend/
│       ├── prisma/         # schema.prisma, migrations, seed.ts
│       ├── src/
│       │   ├── app.ts      # Entry point Express
│       │   ├── config/     # Konfigurasi (env, prisma, dll)
│       │   ├── middleware/ # Auth, validation, error handler
│       │   ├── modules/    # Feature modules (auth, courses, users, dll)
│       │   ├── utils/      # Helper functions
│       │   └── lib/        # Library eksternal (midtrans, cloudinary, jwt)
│       └── package.json
└── engclass-lms-frontend/
    └── lms-frontend/
        ├── src/
        │   ├── components/ # Reusable UI components
        │   ├── context/    # React Context (Auth, Toast)
        │   ├── lib/        # API client, utils, mock data
        │   ├── pages/      # Halaman (public, member, admin)
        │   ├── routes/     # Route protection
        │   └── types/      # TypeScript types
        └── package.json
```

## Catatan

- Project menggunakan pendekatan **Real API** dengan fallback **Mock Data** untuk development fleksibel (`VITE_USE_MOCK`).
- Semua panduan instalasi, menjalankan, dan deploy tersedia terpisah di folder `submission-docs/`.
- **Tidak ada perubahan kode** pada project utama untuk keperluan dokumentasi ini.
