import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { updateProfileSchema } from './users.validation';
import * as usersController from './users.controller';

const usersRouter = Router();
usersRouter.put('/me/profile', authenticate, authorize('MEMBER', 'ADMIN'), validate(updateProfileSchema), usersController.updateProfile);

export default usersRouter;
