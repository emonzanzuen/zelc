import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as lessonService from './lessons.service';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await lessonService.createLesson(req.body);
  return success(res, lesson, 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const lessons = await lessonService.listLessons(req.params.courseId);
  return success(res, lessons);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const lesson = await lessonService.updateLesson(req.params.id, req.body);
  return success(res, lesson);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await lessonService.deleteLesson(req.params.id);
  return success(res, { deleted: true });
});

export const complete = asyncHandler(async (req: Request, res: Response) => {
  const result = await lessonService.completeLesson(req.user!.userId, req.params.id);
  return success(res, result);
});
