import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import * as adminController from './admin.controller';

export const adminRouter = Router();
adminRouter.use(authenticate, authorize('ADMIN'));
adminRouter.get('/stats', adminController.stats);
adminRouter.get('/members', adminController.members);
adminRouter.get('/transactions', adminController.transactions);
