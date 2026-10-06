import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, googleAuthSchema } from './auth.validation';
import * as authController from './auth.controller';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/google', validate(googleAuthSchema), authController.googleLogin);

export default router;
