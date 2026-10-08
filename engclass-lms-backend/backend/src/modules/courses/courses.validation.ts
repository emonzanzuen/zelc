import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  categoryId: z.string().uuid('categoryId tidak valid'),
  thumbnailUrl: z.string().url().optional(),
  price: z.number().int().min(0).default(0),
  isFree: z.boolean().default(false),
  level: z.string().optional(),
  published: z.boolean().default(false),
});

export const updateCourseSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  thumbnailUrl: z.string().url().optional(),
  price: z.number().int().min(0).optional(),
  isFree: z.boolean().optional(),
  level: z.string().optional(),
  published: z.boolean().optional(),
});
