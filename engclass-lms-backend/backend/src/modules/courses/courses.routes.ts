import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { optionalAuthenticate } from '../../middleware/optionalAuthenticate';
import { validate } from '../../middleware/validate';
import { createCourseSchema, updateCourseSchema } from './courses.validation';
import * as courseController from './courses.controller';

export const publicCourseRouter = Router();
publicCourseRouter.get('/', courseController.list);
publicCourseRouter.get('/by-id/:id', optionalAuthenticate, courseController.detailById);
publicCourseRouter.get('/:slug', optionalAuthenticate, courseController.detail);

export const adminCourseRouter = Router();
adminCourseRouter.use(authenticate, authorize('ADMIN'));
adminCourseRouter.get('/', courseController.listForAdmin);
adminCourseRouter.post('/', validate(createCourseSchema), courseController.create);
adminCourseRouter.put('/:id', validate(updateCourseSchema), courseController.update);
adminCourseRouter.delete('/:id', courseController.remove);
