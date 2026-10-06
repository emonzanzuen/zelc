import { Response } from 'express';

export function success(res: Response, data: unknown, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function fail(res: Response, message: string, statusCode = 400, errors?: unknown) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}
