import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { upload } from '../../middleware/upload';
import * as uploadController from './upload.controller';

export const uploadRouter = Router();
uploadRouter.post('/', authenticate, authorize('ADMIN'), upload.single('file'), uploadController.uploadImage);
