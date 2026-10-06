import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as roadmapService from './roadmap.service';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  const roadmaps = await roadmapService.listRoadmaps();
  return success(res, roadmaps);
});

export const detail = asyncHandler(async (req: Request, res: Response) => {
  const roadmap = await roadmapService.getRoadmapDetail(req.params.slug);
  return success(res, roadmap);
});

export const myProgress = asyncHandler(async (req: Request, res: Response) => {
  const result = await roadmapService.getRoadmapProgress(req.params.roadmapId, req.user!.userId);
  return success(res, result);
});

export const listForAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const roadmaps = await roadmapService.listRoadmapsForAdmin();
  return success(res, roadmaps);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const roadmap = await roadmapService.createRoadmap(req.body);
  return success(res, roadmap, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const roadmap = await roadmapService.updateRoadmap(req.params.id, req.body);
  return success(res, roadmap);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await roadmapService.deleteRoadmap(req.params.id);
  return success(res, { deleted: true });
});
