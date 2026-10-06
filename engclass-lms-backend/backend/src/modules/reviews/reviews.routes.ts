import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createReviewSchema } from './reviews.validation';
import * as reviewController from './reviews.controller';

// mergeParams: true -> bisa baca req.params.courseId dari parent mount /courses/:courseId/reviews
export const reviewRouter = Router({ mergeParams: true });
reviewRouter.get('/', reviewController.list);
reviewRouter.post('/', authenticate, validate(createReviewSchema), reviewController.create);

export const adminReviewRouter = Router();
adminReviewRouter.use(authenticate, authorize('ADMIN'));
adminReviewRouter.patch('/:id/hide', reviewController.hide);
adminReviewRouter.delete('/:id', reviewController.remove);
