import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as transactionService from './transactions.service';

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const result = await transactionService.checkout(req.user!.userId, req.body.courseId);
  return success(res, result, 201);
});

export const webhook = asyncHandler(async (req: Request, res: Response) => {
  await transactionService.handleWebhook(req.body);
  // selalu balas cepat ke Midtrans (PRD §29.5)
  return success(res, { received: true });
});

export const mine = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await transactionService.listMyTransactions(req.user!.userId);
  return success(res, transactions);
});
