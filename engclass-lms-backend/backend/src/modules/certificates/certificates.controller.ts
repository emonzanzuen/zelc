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

export const downloadMine = asyncHandler(async (req: Request, res: Response) => {
  const pdf = await certificateService.downloadMyCertificate(req.user!.userId, req.params.id);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="sertifikat.pdf"');
  res.setHeader('Content-Length', pdf.length);
  return res.send(pdf);
});
