import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as reviewService from './reviews.service';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(
    req.user!.userId,
    req.params.courseId,
    req.body.rating,
    req.body.comment
  );
  return success(res, review, 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const result = await reviewService.listReviews(req.params.courseId, page, 10);
  return success(res, result);
});

export const listForAdmin = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await reviewService.listAdminReviews(req.params.courseId);
  return success(res, reviews);
});

export const setVisibility = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.setReviewVisibility(req.params.id, req.body.isHidden);
  return success(res, review);
});

export const hide = asyncHandler(async (req: Request, res: Response) => {
  await reviewService.setReviewVisibility(req.params.id, true);
  return success(res, { hidden: true });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await reviewService.deleteReview(req.params.id);
  return success(res, { deleted: true });
});
