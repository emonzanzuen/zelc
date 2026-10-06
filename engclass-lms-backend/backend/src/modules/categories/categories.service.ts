import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';

interface CategoryInput {
  name: string;
  slug: string;
}

export function listCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function createCategory(data: CategoryInput) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) throw new HttpError(409, 'Slug kategori sudah dipakai');
  return prisma.category.create({ data });
}

export async function updateCategory(id: string, data: CategoryInput) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new HttpError(404, 'Kategori tidak ditemukan');
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new HttpError(404, 'Kategori tidak ditemukan');
  await prisma.category.delete({ where: { id } });
}
