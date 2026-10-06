import { Request, Response } from 'express';
import { UploadApiResponse } from 'cloudinary';
import { asyncHandler } from '../../utils/asyncHandler';
import { success, fail } from '../../utils/apiResponse';
import cloudinary from '../../lib/cloudinary';

// Upload selalu lewat backend (PRD §29.11) — frontend tidak pernah pegang credential Cloudinary.
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return fail(res, 'File tidak ditemukan', 400);

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'lms-english/thumbnails' }, (error, uploaded) => {
      if (error || !uploaded) return reject(error ?? new Error('Upload gagal'));
      resolve(uploaded);
    });
    stream.end(req.file!.buffer);
  });

  return success(res, { url: result.secure_url }, 201);
});
