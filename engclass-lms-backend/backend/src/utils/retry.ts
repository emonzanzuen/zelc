// Membungkus operasi (generate kode + create) agar otomatis mencoba ulang
// jika terjadi bentrok unique constraint (Prisma error code P2002) akibat race condition,
// contohnya dua transaksi/sertifikat dibuat nyaris bersamaan. Lihat PRD §18 & §24.
export async function retryOnUniqueConflict<T>(fn: () => Promise<T>, maxAttempts = 5): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'P2002') {
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
