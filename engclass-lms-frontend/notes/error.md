🔴 Error #1 (Google OAuth) — ini BUKAN bug backend

Lihat baris ini baik-baik:

reason: 'Wrong number of segments in token: mock-google-id-token'

Token asli dari Google selalu berbentuk JWT (3 bagian dipisah titik, seperti eyJhbG...xyz.eyJzdWI...abc.SflKxw...). Yang dikirim ke backend di sini literal string "mock-google-id-token" — bukan token sungguhan sama sekali, tidak ada titik pemisahnya.

Artinya: tombol "Login dengan Google" di frontend belum benar-benar memanggil Google Identity Services — ada kode placeholder/mock yang masih hardcode string itu, bukan hasil login Google beneran. Backend sudah benar menolaknya karena memang bukan token valid. Ini perlu diperbaiki di sisi frontend (cari di mana string "mock-google-id-token" di-hardcode, kemungkinan di handler tombol Google atau di lib/mockData.ts/lib/api.ts saat VITE_USE_MOCK masih true untuk flow Google).

🟡 Error #2 (Login password) — perlu info tambahan

Ini berulang terus tapi log saya saat ini tidak menunjukkan email apa yang dicoba, jadi saya tidak bisa pastikan apakah ini karena user belum ada atau password salah. Saya perbaiki loggingnya dulu biar sama-sama bisa didiagnosis seperti kasus Google tadi (tanpa menampilkan password, demi keamanan):

Langkah selanjutnya untuk kamu:

Soal Google OAuth — ini pesan yang bisa diteruskan ke Claude frontend: "Tombol Login Google masih kirim string placeholder 'mock-google-id-token' ke backend, bukan token JWT asli dari Google Identity Services. Tolong cek implementasi handler-nya — kemungkinan masih pakai mock/stub dan belum benar-benar terhubung ke SDK Google."
Soal login password — replace file auth.service.ts dengan yang baru di zip ini, jalankan ulang npm run dev, coba login lagi, lalu kirim saya log terbarunya. Sekarang akan jelas persis email yang dicoba dan kenapa gagal (user tidak ada / akun Google tanpa password / password salah) — dari situ saya bisa pastikan apakah ini cuma salah ketik, lupa npm run seed, atau ada hal lain.