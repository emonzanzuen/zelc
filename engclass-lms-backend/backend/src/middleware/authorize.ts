import { Request, Response, NextFunction } from 'express';
import { fail } from '../utils/apiResponse';

// Dipakai setelah authenticate. Contoh: authorize('ADMIN')
export function authorize(...roles: Array<'MEMBER' | 'ADMIN'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return fail(res, 'Kamu tidak punya akses ke resource ini', 403);
    }
    next();
  };
}
