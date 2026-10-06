import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { createEnrollmentSchema } from './enrollments.validation';
import * as enrollmentController from './enrollments.controller';

const router = Router();
router.use(authenticate);
router.post('/', validate(createEnrollmentSchema), enrollmentController.create);

export default router;
