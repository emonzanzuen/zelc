import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createRoadmapSchema, updateRoadmapSchema } from './roadmaps.validation';
import * as roadmapController from './roadmaps.controller';

export const publicRoadmapRouter = Router();
publicRoadmapRouter.get('/', roadmapController.list);
publicRoadmapRouter.get('/:slug', roadmapController.detail);

export const adminRoadmapRouter = Router();
adminRoadmapRouter.use(authenticate, authorize('ADMIN'));
adminRoadmapRouter.get('/', roadmapController.listForAdmin);
adminRoadmapRouter.post('/', roadmapController.logCreateBody, validate(createRoadmapSchema), roadmapController.create);
adminRoadmapRouter.put('/:id', validate(updateRoadmapSchema), roadmapController.update);
adminRoadmapRouter.delete('/:id', roadmapController.remove);
