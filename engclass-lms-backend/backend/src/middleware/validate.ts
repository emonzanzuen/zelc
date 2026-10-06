import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { fail } from '../utils/apiResponse';

// Validasi wajib di sisi server (PRD §17.13), bukan hanya di frontend.
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return fail(res, 'Input tidak valid', 400, result.error.flatten().fieldErrors);
    }
    req.body = result.data;
    next();
  };
}
