import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createQuizSchema, updateQuizSchema, submitQuizSchema } from './quiz.validation';
import * as quizController from './quiz.controller';

export const memberQuizRouter = Router();
memberQuizRouter.use(authenticate);
memberQuizRouter.get('/:courseId', quizController.getByCourse);
memberQuizRouter.post('/:id/submit', validate(submitQuizSchema), quizController.submit);

export const adminQuizRouter = Router();
adminQuizRouter.use(authenticate, authorize('ADMIN'));
adminQuizRouter.post('/', validate(createQuizSchema), quizController.create);
adminQuizRouter.put('/:id', validate(updateQuizSchema), quizController.update);
adminQuizRouter.delete('/:id', quizController.remove);
