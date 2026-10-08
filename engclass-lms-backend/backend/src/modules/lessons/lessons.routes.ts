import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createLessonSchema, updateLessonSchema } from './lessons.validation';
import * as lessonController from './lessons.controller';

export const memberLessonRouter = Router();
memberLessonRouter.patch('/:id/complete', authenticate, lessonController.complete);

export const adminLessonRouter = Router();
adminLessonRouter.use(authenticate, authorize('ADMIN'));
adminLessonRouter.get('/course/:courseId', lessonController.list);
adminLessonRouter.post('/', validate(createLessonSchema), lessonController.create);
adminLessonRouter.put('/:id', validate(updateLessonSchema), lessonController.update);
adminLessonRouter.delete('/:id', lessonController.remove);
