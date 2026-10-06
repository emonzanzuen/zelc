import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env';
import { HttpError } from '../utils/httpError';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

// Verifikasi id_token dari Google Identity Services di sisi server (wajib, lihat PRD §20)
export async function verifyGoogleToken(idToken: string): Promise<GoogleProfile> {
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
  } catch (err) {
    // Sebelumnya alasan penolakan asli dari Google dibuang — sulit didiagnosis.
    // Log detail aslinya di server (jangan di-expose ke client demi keamanan),
    // penyebab tersering: audience (GOOGLE_CLIENT_ID backend) tidak sama persis
    // dengan Client ID yang dipakai frontend saat membuat token.
    console.error('[Google OAuth] Verifikasi id_token gagal:', {
      reason: err instanceof Error ? err.message : err,
      audienceDipakaiBackend: env.GOOGLE_CLIENT_ID,
    });
    throw new HttpError(401, 'Token Google tidak valid atau kadaluarsa');
  }

  const payload = ticket.getPayload();
  if (!payload || !payload.email || !payload.sub) {
    throw new HttpError(401, 'Token Google tidak valid');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    avatarUrl: payload.picture ?? null,
  };
}
