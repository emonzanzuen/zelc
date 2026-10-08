import { createHash, timingSafeEqual } from 'crypto';
import midtransClient from 'midtrans-client';
import { env } from '../config/env';

const snap = new midtransClient.Snap({
  isProduction: env.MIDTRANS_IS_PRODUCTION,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
});

export const ENABLED_PAYMENTS = [
  'credit_card',
  'gopay',
  'shopeepay',
  'bca_va',
  'other_qris',
] as const;

export function createTransaction(payload: Record<string, unknown>) {
  return snap.createTransaction(payload);
}

export function verifyNotificationSignature(payload: Record<string, unknown>): boolean {
  const orderId = payload.order_id;
  const statusCode = payload.status_code;
  const grossAmount = payload.gross_amount;
  const signature = payload.signature_key;
  if (
    typeof orderId !== 'string' ||
    (typeof statusCode !== 'string' && typeof statusCode !== 'number') ||
    (typeof grossAmount !== 'string' && typeof grossAmount !== 'number') ||
    typeof signature !== 'string'
  ) return false;

  const expected = createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${env.MIDTRANS_SERVER_KEY}`)
    .digest();
  const received = Buffer.from(signature, 'hex');
  return received.length === expected.length && timingSafeEqual(received, expected);
}
