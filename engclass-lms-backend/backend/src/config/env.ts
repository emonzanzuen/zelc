import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL wajib diisi'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET wajib diisi'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID wajib diisi'),
  MIDTRANS_SERVER_KEY: z.string().min(1, 'MIDTRANS_SERVER_KEY wajib diisi'),
  MIDTRANS_CLIENT_KEY: z.string().min(1, 'MIDTRANS_CLIENT_KEY wajib diisi'),
  MIDTRANS_IS_PRODUCTION: z.string().default('false'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME wajib diisi'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY wajib diisi'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET wajib diisi'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment variable tidak valid / belum lengkap:');
  console.error(parsed.error.flatten().fieldErrors);
  console.error('\n👉 Salin .env.example menjadi .env lalu isi semua nilainya. Lihat README.md untuk cara mendapatkan tiap nilai.');
  process.exit(1);
}

export const env = {
  ...parsed.data,
  PORT: Number(parsed.data.PORT),
  MIDTRANS_IS_PRODUCTION: parsed.data.MIDTRANS_IS_PRODUCTION === 'true',
};
