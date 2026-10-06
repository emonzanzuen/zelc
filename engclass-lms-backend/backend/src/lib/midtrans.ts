import midtransClient from 'midtrans-client';
import { env } from '../config/env';

const config = {
  isProduction: env.MIDTRANS_IS_PRODUCTION,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.MIDTRANS_CLIENT_KEY,
};

// Snap dipakai untuk membuat transaksi (checkout)
export const snap = new midtransClient.Snap(config);

// CoreApi dipakai untuk memvalidasi & membaca notifikasi webhook (signature diverifikasi otomatis oleh library)
export const coreApi = new midtransClient.CoreApi(config);

// Kanal pembayaran resmi yang diaktifkan (PRD §21.1) — dikonfigurasi di backend,
// BUKAN dipilih manual oleh member per transaksi. Member tetap memilih kanal spesifik
// (mis. bank VA mana) di dalam popup Snap itu sendiri.
// Kategori Must have untuk MVP: Kartu, VA 5 bank, GoPay, ShopeePay, QRIS.
// OVO/DANA/LinkAja TIDAK didaftarkan terpisah — diakses lewat kanal QRIS (other_qris),
// bukan integrasi langsung per-wallet (lihat PRD §21.1 & §5 Glosarium: QRIS).
export const ENABLED_PAYMENTS = [
  'credit_card',
  'bca_va',
  'bni_va',
  'bri_va',
  'echannel', // Mandiri Bill Payment
  'permata_va',
  'gopay',
  'shopeepay',
  'other_qris',
] as const;
