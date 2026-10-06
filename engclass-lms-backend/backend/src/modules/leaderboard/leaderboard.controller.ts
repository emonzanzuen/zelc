import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as leaderboardService from './leaderboard.service';

export const get = asyncHandler(async (req: Request, res: Response) => {
  const result = await leaderboardService.getLeaderboard(req.query.month as string | undefined);
  return success(res, result);
});
