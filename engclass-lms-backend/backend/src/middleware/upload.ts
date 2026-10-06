import multer from 'multer';

// Simpan di memory (buffer), lalu diteruskan ke Cloudinary di controller.
// Validasi tipe & ukuran di sisi server (PRD §20), bukan cuma di frontend.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar (jpg/png/webp) maksimal 2MB'));
    }
  },
});
