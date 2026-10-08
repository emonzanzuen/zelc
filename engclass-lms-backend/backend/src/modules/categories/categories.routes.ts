import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { categorySchema } from './categories.validation';
import * as categoryController from './categories.controller';

export const publicCategoryRouter = Router();
publicCategoryRouter.get('/', categoryController.list);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(authenticate, authorize('ADMIN'));
adminCategoryRouter.get('/', categoryController.list);
adminCategoryRouter.post('/', validate(categorySchema), categoryController.create);
adminCategoryRouter.put('/:id', validate(categorySchema), categoryController.update);
adminCategoryRouter.delete('/:id', categoryController.remove);
