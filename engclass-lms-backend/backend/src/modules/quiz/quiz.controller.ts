import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as quizService from './quiz.service';

export const getByCourse = asyncHandler(async (req: Request, res: Response) => {
  console.log('Quiz By Course ID:', req.params.courseId);
  const quiz = await quizService.getQuizByCourse(req.params.courseId, req.user!.userId);
  return success(res, quiz);
});

export const submit = asyncHandler(async (req: Request, res: Response) => {
  const result = await quizService.submitQuiz(req.user!.userId, req.params.id, req.body.answers);
  return success(res, result);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.createQuiz(req.body);
  return success(res, quiz, 201);
});

export const getForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.getQuizForAdmin(req.params.courseId);
  return success(res, quiz);
});

export const createQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await quizService.createQuestion(req.body);
  return success(res, question, 201);
});

export const updateQuestion = asyncHandler(async (req: Request, res: Response) => {
  const question = await quizService.updateQuestion(req.params.questionId, req.body);
  return success(res, question);
});

export const deleteQuestion = asyncHandler(async (req: Request, res: Response) => {
  await quizService.deleteQuestion(req.params.questionId);
  return success(res, { deleted: true });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const quiz = await quizService.updateQuiz(req.params.id, req.body);
  return success(res, quiz);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await quizService.deleteQuiz(req.params.id);
  return success(res, { deleted: true });
});
