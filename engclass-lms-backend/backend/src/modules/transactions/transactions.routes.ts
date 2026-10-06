import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { checkoutSchema } from './transactions.validation';
import * as transactionController from './transactions.controller';

export const transactionRouter = Router();
transactionRouter.post('/checkout', authenticate, validate(checkoutSchema), transactionController.checkout);
// publik dari sisi HTTP (dipanggil server Midtrans), keamanan lewat verifikasi signature di service
transactionRouter.post('/webhook', transactionController.webhook);
