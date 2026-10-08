import { z } from 'zod';

export const createRoadmapSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter'),
  slug: z
    .string().trim()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung')
    .optional(),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter'),
  thumbnailUrl: z.string().url().nullable().optional(),
  published: z.boolean().default(false),
  // urutan elemen array menentukan kolom `order` di RoadmapCourse (PRD §29.10)
  courseIds: z.array(z.string().uuid()).default([]),
});

export const updateRoadmapSchema = createRoadmapSchema.partial();
