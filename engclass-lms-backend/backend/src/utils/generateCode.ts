import crypto from 'crypto';
import { prisma } from '../lib/prisma';

function randomDigits(length: number): string {
  const max = 10 ** length;
  return crypto.randomInt(0, max).toString().padStart(length, '0');
}

// Format: TRX-YYYYMMDD-XXXXXX (PRD §18)
export function generateTransactionNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `TRX-${y}${m}${d}-${randomDigits(6)}`;
}

// Format: CERT-YYYY-XXXXX (PRD §18)
export async function generateCertificateNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.certificate.count({
    where: { certNumber: { startsWith: `CERT-${year}-` } },
  });
  const seq = String(count + 1).padStart(5, '0');
  return `CERT-${year}-${seq}`;
}
