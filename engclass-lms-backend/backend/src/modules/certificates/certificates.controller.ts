import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success, fail } from '../../utils/apiResponse';
import * as certificateService from './certificates.service';

export const verify = asyncHandler(async (req: Request, res: Response) => {
  const result = await certificateService.verifyCertificate(req.params.certNumber);
  if (!result.valid) return fail(res, 'Sertifikat tidak ditemukan', 404);
  return success(res, result);
});

export const mine = asyncHandler(async (req: Request, res: Response) => {
  const certificates = await certificateService.listMyCertificates(req.user!.userId);
  return success(res, certificates);
});
