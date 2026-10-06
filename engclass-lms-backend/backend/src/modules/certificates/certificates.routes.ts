import { Router } from 'express';
import * as certificateController from './certificates.controller';

export const certificateRouter = Router();
certificateRouter.get('/verify/:certNumber', certificateController.verify);
