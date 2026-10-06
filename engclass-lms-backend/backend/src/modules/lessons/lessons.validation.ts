import { z } from 'zod';

export const createLessonSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(3),
  youtubeUrl: z.string().url(),
  durationMinutes: z.number().int().min(0).default(0),
  order: z.number().int().min(1),
  isPreview: z.boolean().default(false),
});

export const updateLessonSchema = z.object({
  title: z.string().min(3).optional(),
  youtubeUrl: z.string().url().optional(),
  durationMinutes: z.number().int().min(0).optional(),
  order: z.number().int().min(1).optional(),
  isPreview: z.boolean().optional(),
});
