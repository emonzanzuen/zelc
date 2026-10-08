import { prisma } from '../../lib/prisma';
import { HttpError } from '../../utils/httpError';

export async function updateProfile(userId: string, name: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, name: true, email: true, role: true, avatarUrl: true },
  }).catch((error: { code?: string }) => {
    if (error.code === 'P2025') throw new HttpError(404, 'User tidak ditemukan');
    throw error;
  });
  return user;
}
