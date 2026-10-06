import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { fail } from '../utils/apiResponse';
import { HttpError } from '../utils/httpError';

export function notFoundHandler(_req: Request, res: Response) {
  return fail(res, 'Endpoint tidak ditemukan', 404);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof HttpError) {
    return fail(res, err.message, err.statusCode);
  }

  if (err instanceof multer.MulterError) {
    return fail(res, err.message, 400);
  }

  // Prisma unique constraint yang lolos dari retry helper (jarang terjadi)
  if ((err as { code?: string })?.code === 'P2002') {
    return fail(res, 'Data duplikat, silakan coba lagi', 409);
  }

  if (err instanceof Error) {
    // Error validasi multer fileFilter juga masuk sini
    if (err.message.toLowerCase().includes('gambar')) {
      return fail(res, err.message, 400);
    }
    return fail(res, err.message || 'Terjadi kesalahan pada server', 500);
  }

  return fail(res, 'Terjadi kesalahan pada server', 500);
}
