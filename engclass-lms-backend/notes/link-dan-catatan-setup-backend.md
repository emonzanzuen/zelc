### 📋 Rangkuman Link & Catatan Setup Backend

| Tahap | Link Website / Resource | Komentar / Catatan Penting |
| :--- | :--- | :--- |
| **1. Database** | [supabase.com](https://supabase.com) atau [postgresql.org](https://www.postgresql.org/download/) | Gunakan Supabase untuk kemudahan (tanpa install lokal). Connection string dimasukkan ke `DATABASE_URL` di `.env`. |
| **2. Google OAuth** | [console.cloud.google.com](https://console.cloud.google.com/) | Buat **OAuth Client ID** tipe "Web Application". Pastikan *Authorized JS Origins* mencakup `http://localhost:5173`. Client ID harus sama persis di FE & BE. |
| **3. Midtrans Sandbox** | [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com) | Ambil **Server Key** & **Client Key**. Jangan pakai kredensial Production. Gunakan kartu tes `4811 1111 1111 1114` untuk simulasi. |
| **4. Cloudinary** | [cloudinary.com](https://cloudinary.com) | Ambil **Cloud Name**, **API Key**, & **API Secret** dari Dashboard. Digunakan untuk upload thumbnail course & roadmap. |
| **5. Ngrok (Tunnel)** | [ngrok.com](https://ngrok.com) | Jalankan `ngrok http 5000`. URL berubah setiap restart. Wajib untuk testing webhook Midtrans dari localhost. |
| **6. Prisma Studio** | [prisma.io/docs/tools/prisma-studio](https://www.prisma.io/studio) | Jalankan via `npx prisma studio`. GUI untuk melihat/edit data database secara visual tanpa SQL manual. |

### 💡 Catatan Teknis Kritis (Dari Sesi Kita)

1.  **Migration Name:** Gunakan `npx prisma migrate dev --name init_with_roadmap` karena schema sudah mencakup tabel Roadmap sejak awal.
2.  **Webhook Endpoint:** Pastikan URL di Midtrans adalah `https://[URL-NGROK]/api/v1/transactions/webhook`. Tambahkan `?ngrok-skip-browser-warning=true` jika ngrok free tier memblokir request test.
3.  **Akun Seed Default:**
    *   Email: `admin@lmsenglish.test`
    *   Password: `admin12345`
4.  **Struktur Response:** Backend selalu mengembalikan format `{ success: true, data: {...} }`. Frontend wajib melakukan *defensive check* (`?? []`) pada array sebelum melakukan operasi `.map()` atau `.filter()`.

### Menghubungkan Midtrans Webhook (via Ngrok)

Midtrans perlu memanggil endpoint `POST /api/v1/transactions/webhook` di backend kamu. Karena backend berjalan di `localhost`, Midtrans (di internet) tidak bisa mengaksesnya langsung. Kita menggunakan **ngrok** untuk membuat terowongan publik sementara.

**Langkah-langkah:**

1.  **Jalankan Ngrok di Terminal Baru:**
    Pastikan server backend (`npm run dev`) sudah berjalan di port 5000, lalu buka terminal baru dan jalankan:
    ```bash
    ngrok http 5000
    ```

2.  **Salin URL Forwarding:**
    Di terminal ngrok, cari baris **Forwarding**. Salin URL yang berawalan `https://` (contoh: `https://snore-shininess-stubbed.ngrok-free.dev`).
    
    > ⚠️ **Catatan:** URL ini akan berubah setiap kali kamu menutup dan membuka ulang ngrok.

3.  **Konfigurasi di Dashboard Midtrans:**
    *   Login ke [dashboard.sandbox.midtrans.com](https://dashboard.sandbox.midtrans.com).
    *   Masuk ke menu **Settings** → **Configuration**.
    *   Di kolom **Payment Notification URL**, tempel URL ngrok kamu ditambah path webhook:
        ```text
        https://[URL-NGROK-KAMU]/api/v1/transactions/webhook
        ```
    *   Klik **Save**. Jika muncul error "Test failed", pastikan backend kamu sedang aktif dan coba tambahkan `?ngrok-skip-browser-warning=true` di akhir URL.

4.  **Verifikasi:**
    Lakukan test checkout di frontend. Cek terminal backend kamu; jika berhasil, akan muncul log `[Webhook] ✅ Berhasil memproses...` dan status transaksi di database akan berubah menjadi `success`.