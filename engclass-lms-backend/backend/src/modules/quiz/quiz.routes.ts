import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createQuizSchema, updateQuizSchema, submitQuizSchema, createQuestionSchema, updateQuestionSchema } from './quiz.validation';
import * as quizController from './quiz.controller';

export const memberQuizRouter = Router();
memberQuizRouter.use(authenticate);
memberQuizRouter.get('/by-course/:courseId', quizController.getByCourse);
memberQuizRouter.post('/:id/submit', validate(submitQuizSchema), quizController.submit);

export const adminQuizRouter = Router();
adminQuizRouter.use(authenticate, authorize('ADMIN'));
adminQuizRouter.get('/course/:courseId', quizController.getForAdmin);
adminQuizRouter.post('/', validate(createQuizSchema), quizController.create);
adminQuizRouter.post('/questions', validate(createQuestionSchema), quizController.createQuestion);
adminQuizRouter.put('/questions/:questionId', validate(updateQuestionSchema), quizController.updateQuestion);
adminQuizRouter.delete('/questions/:questionId', quizController.deleteQuestion);
adminQuizRouter.put('/:id', validate(updateQuizSchema), quizController.update);
adminQuizRouter.delete('/:id', quizController.remove);
