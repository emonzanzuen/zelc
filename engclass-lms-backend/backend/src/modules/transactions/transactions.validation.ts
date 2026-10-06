import { z } from 'zod';

export const checkoutSchema = z.object({
  courseId: z.string().uuid(),
});
