import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.registerMember(name, email, password);
  return success(res, result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginMember(email, password);
  return success(res, result, 200);
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body;
  const result = await authService.loginWithGoogle(credential);
  return success(res, result, 200);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getCurrentUser(req.user!.userId);
  return success(res, user, 200);
});
