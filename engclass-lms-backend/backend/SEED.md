# Seed data backend (pengganti mock frontend)

Letakkan folder ini di `engclass-lms-backend/backend/` (menimpa `prisma/seed.ts` dan `package.json`).

## Perintah
| Perintah | Fungsi |
|---|---|
| `npm run seed` | Mode **aman**: menambah yang belum ada & memperbarui katalog. Tidak menghapus apa pun; data member nyata tidak disentuh. Bisa diulang. |
| `npm run seed:reset` | **Menghapus SEMUA data** lalu mengisi ulang (butuh ketik nama database; `--yes` untuk non-interaktif; ditolak bila `NODE_ENV=production`). Gunakan juga untuk menyegarkan linimasa/leaderboard. |
| `npm run seed:verify` | Memeriksa dataset terhadap `schema.prisma` + aturan bisnis, tanpa database. |
| `npm run seed:test` | Menguji `seed.ts` pada database tiruan (DB kosong, ulang, hari berbeda, DB lama + member nyata, reset). |

Prasyarat: `npx prisma migrate dev` sudah dijalankan. Frontend: set `VITE_USE_MOCK=false`.

## Isi data
10 kategori · 12 course (6 gratis/berbayar sesuai UI) · 30 lesson · 12 kuis × 5 soal (60 soal) · 1 admin + 40 member ·
110 enrollment · 169 lesson selesai · 72 transaksi (success/pending/expired/failed) · 24 percobaan kuis · 16 sertifikat ·
36 review (2 disembunyikan admin) · 3 roadmap. Angka (siswa, rating, pendapatan, leaderboard) dihitung dari baris
nyata ini, jadi lebih kecil dari angka dummy frontend (mis. 2.140 siswa).

## Akun
- Admin: `admin@lmsenglish.test` / `admin12345`
- Member demo: `dimas.pratama@example.com` / `Member12345` (progres, sertifikat, 1 transaksi pending)
- Member lain: `<nama.depan.belakang>@example.com` / `Member12345` (yang bertanda Google tidak punya password)

## Video YouTube
29 dari 30 lesson belum punya video asli. Isi `prisma/seed-data/lesson-videos.json`
(kunci `<slug>#<urutan>`, nilai ID/URL) lalu `npm run seed`. Seed melaporkan yang masih kosong.
