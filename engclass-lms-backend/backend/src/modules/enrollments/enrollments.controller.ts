import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as enrollmentService from './enrollments.service';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const enrollment = await enrollmentService.enrollFreeCourse(req.user!.userId, req.body.courseId);
  return success(res, { enrollment }, 201);
});

export const mine = asyncHandler(async (req: Request, res: Response) => {
  const enrollments = await enrollmentService.listMyEnrollments(req.user!.userId);
  return success(res, enrollments);
});
