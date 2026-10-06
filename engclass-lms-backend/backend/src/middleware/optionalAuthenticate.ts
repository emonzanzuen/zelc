import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

// Tidak mewajibkan login, tapi mengisi req.user jika token valid dikirim.
// Dipakai di GET /courses/:slug agar bisa hitung isEnrolled/locked dengan akurat
// untuk pengguna yang sudah login, tanpa memblokir pengunjung publik.
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // token tidak valid/kadaluarsa -> abaikan saja, tetap perlakukan sebagai publik
    }
  }
  next();
}
