import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { signToken } from '../../lib/jwt';
import { verifyGoogleToken } from '../../lib/googleAuth';
import { HttpError } from '../../utils/httpError';

const SALT_ROUNDS = 10;

function sanitize(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
  };
}

export async function registerMember(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, 'Email sudah terdaftar');

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({ data: { name, email, password: hashed } });
  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitize(user), token };
}

export async function loginMember(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('[Login] Gagal — email tidak terdaftar:', email);
    throw new HttpError(401, 'Email atau password salah');
  }
  if (!user.password) {
    console.error('[Login] Gagal — akun ini daftar via Google, belum punya password:', email);
    throw new HttpError(401, 'Email atau password salah');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.error('[Login] Gagal — password tidak cocok untuk:', email);
    throw new HttpError(401, 'Email atau password salah');
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitize(user), token };
}

// Business rule §17.18: jika email Google sudah terdaftar manual, tautkan akun (bukan bikin baru)
export async function loginWithGoogle(credential: string) {
  const g = await verifyGoogleToken(credential);

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: g.googleId }, { email: g.email }] },
  });

  if (user) {
    if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId: g.googleId } });
    }
  } else {
    user = await prisma.user.create({
      data: { name: g.name, email: g.email, googleId: g.googleId, avatarUrl: g.avatarUrl },
    });
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { user: sanitize(user), token };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, 'User tidak ditemukan');
  return sanitize(user);
}
