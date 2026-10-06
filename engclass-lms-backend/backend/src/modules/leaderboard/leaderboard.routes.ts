import { Router } from 'express';
import * as leaderboardController from './leaderboard.controller';

export const leaderboardRouter = Router();
leaderboardRouter.get('/', leaderboardController.get);
