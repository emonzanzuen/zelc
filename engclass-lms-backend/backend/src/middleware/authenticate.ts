import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../lib/jwt';
import { fail } from '../utils/apiResponse';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Wajib login (Bearer token). Lihat PRD Â§20 & Â§29.14 â€” token via header, bukan cookie.
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return fail(res, 'Token tidak ditemukan, silakan login', 401);
  }

  const token = header.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return fail(res, 'Sesi tidak valid, silakan login kembali', 401);
  }
}
