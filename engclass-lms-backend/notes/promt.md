***

**Subject: Implementasi Modul CRUD Roadmap (Admin) Sesuai PRD §17.19–§17.20**

Halo, karena setup backend sudah selesai (migration `init_with_roadmap` sukses), mari kita lanjut ke pengembangan fitur prioritas pertama: **Manajemen Roadmap di sisi Admin**.

Mohon implementasikan endpoint-endpoint berikut di `backend/src/modules/roadmaps/`:

### 1. Spesifikasi Endpoint
Buat file `roadmaps.routes.ts`, `roadmaps.controller.ts`, dan `roadmaps.service.ts`.

*   **`POST /admin/roadmaps`**: Membuat roadmap baru.
    *   Validasi: `title` wajib, `courseIds` harus berupa array ID course yang valid dan sudah published.
    *   Logika: Hitung `totalDurationMinutes` secara otomatis dari relasi courses.
*   **`GET /admin/roadmaps`**: List semua roadmap (termasuk draft).
*   **`PUT /admin/roadmaps/:id`**: Update roadmap.
    *   Validasi: Tidak boleh mempublish roadmap jika `courseIds` kosong.
*   **`DELETE /admin/roadmaps/:id`**: Hapus roadmap.
*   **`GET /roadmaps` (Public)**: List roadmap yang statusnya `published` saja (untuk persiapan halaman publik nanti).

### 2. Aturan Bisnis & Validasi (Wajib)
*   Gunakan Prisma `$transaction` saat create/update untuk memastikan data `Roadmap` dan `RoadmapCourse` tersimpan secara atomis.
*   Field `slug` harus unik dan auto-generated dari title.
*   Pastikan response mengikuti format standar `{ success: true, data: ... }`.

### 3. Integrasi
*   Daftarkan router ini di `app.ts` dengan prefix `/api/v1`.
*   Pastikan middleware `authorize('ADMIN')` terpasang untuk semua route admin.

Setelah modul ini selesai, tolong berikan contoh payload JSON untuk testing `POST /admin/roadmaps` menggunakan salah satu course ID yang ada di seed data.

***