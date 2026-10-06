import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as adminService from './admin.service';

export const stats = asyncHandler(async (_req: Request, res: Response) => {
  const result = await adminService.getStats();
  return success(res, result);
});

export const members = asyncHandler(async (_req: Request, res: Response) => {
  const result = await adminService.listMembers();
  return success(res, result);
});

export const transactions = asyncHandler(async (_req: Request, res: Response) => {
  const result = await adminService.listAllTransactions();
  return success(res, result);
});
