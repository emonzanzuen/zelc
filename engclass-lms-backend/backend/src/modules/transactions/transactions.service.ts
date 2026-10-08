import { prisma } from '../../lib/prisma';
import * as paymentService from '../../lib/payment.service';
import { HttpError } from '../../utils/httpError';
import { generateTransactionNumber } from '../../utils/generateCode';
import { retryOnUniqueConflict } from '../../utils/retry';

// Business rule §17.4 & §17.10: hanya untuk course berbayar, amount snapshot saat checkout
export async function checkout(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || !course.published) throw new HttpError(404, 'Kelas tidak ditemukan');
  if (course.isFree) throw new HttpError(400, 'Kelas ini gratis, gunakan endpoint /enrollments');

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existingEnrollment) throw new HttpError(409, 'Kamu sudah memiliki akses ke kelas ini');

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(404, 'User tidak ditemukan');

  const transaction = await retryOnUniqueConflict(() =>
    prisma.transaction.create({
      data: {
        transactionNumber: generateTransactionNumber(),
        userId,
        courseId,
        amount: course.price,
        status: 'pending',
      },
    })
  );

  const midtransResponse = await paymentService.createTransaction({
    transaction_details: {
      order_id: transaction.transactionNumber,
      gross_amount: transaction.amount,
    },
    customer_details: {
      first_name: user.name,
      email: user.email,
    },
    item_details: [
      {
        id: course.id,
        price: course.price,
        quantity: 1,
        name: course.title.slice(0, 50),
      },
    ],
    // Kanal pembayaran resmi sesuai PRD §21.1 (bukan seluruh kanal yang didukung Midtrans)
    enabled_payments: [...paymentService.ENABLED_PAYMENTS],
  });

  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { midtransOrderId: transaction.transactionNumber },
  });

  return {
    transactionNumber: transaction.transactionNumber,
    snapToken: midtransResponse.token,
    redirectUrl: midtransResponse.redirect_url,
  };
}

// Business rule §17.12 & §24: verifikasi signature + idempotency
export async function handleWebhook(payload: Record<string, unknown>) {
  if (!paymentService.verifyNotificationSignature(payload)) {
    throw new HttpError(401, 'Signature notifikasi Midtrans tidak valid');
  }

  try {
    const orderId = payload.order_id as string;
    const transactionStatus = payload.transaction_status as string;

    // Dicari lewat KEDUA kolom (transactionNumber ATAU midtransOrderId), bukan cuma salah satu:
    // - transactionNumber SELALU terisi sejak baris dibuat (sebelum Snap token diminta),
    //   jadi tidak ada celah waktu kosong — order_id yang dikirim ke Midtrans memang nilai ini.
    // - midtransOrderId baru terisi SETELAH respons Snap diterima (lihat checkout() di atas);
    //   ada celah singkat di mana kolom ini masih null jika webhook datang sangat cepat.
    // Mencari lewat keduanya sekaligus membuat lookup ini kebal terhadap celah waktu itu,
    // apa pun kolom yang kebetulan sudah terisi saat webhook tiba.
    const transaction = await prisma.transaction.findFirst({
      where: { OR: [{ transactionNumber: orderId }, { midtransOrderId: orderId }] },
    });

    if (!transaction) {
      console.log(`[Webhook] ℹ️ Order ${orderId} tidak ditemukan di database, diabaikan.`);
      return;
    }

    // Idempotency: abaikan jika status sudah bukan pending (sudah diproses sebelumnya)
    if (transaction.status !== 'pending') {
      console.log(`[Webhook] ℹ️ Order ${orderId} sudah berstatus ${transaction.status}, diabaikan.`);
      return;
    }

    let newStatus = transaction.status;
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      newStatus = 'success';
    } else if (['deny', 'cancel'].includes(transactionStatus)) {
      newStatus = 'failed';
    } else if (transactionStatus === 'expire') {
      newStatus = 'expired';
    }

    // Jika status tidak berubah, tidak perlu update database
    if (newStatus === transaction.status) return;

    await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id: transaction.id },
        data: {
          status: newStatus,
          paidAt: newStatus === 'success' ? new Date() : null,
        },
      });

      if (newStatus === 'success') {
        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: transaction.userId,
              courseId: transaction.courseId,
            },
          },
          update: {}, // Sudah ada enrollment, biarkan saja
          create: {
            userId: transaction.userId,
            courseId: transaction.courseId,
            progress: 0,
          },
        });
      }
    });

    console.log(`[Webhook] ✅ Berhasil memproses ${orderId} → ${newStatus}`);
  } catch (error) {
    console.error('[Webhook] Transaction processing failed:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Response diratakan (courseTitle flat, bukan nested course.title) — harus cocok persis
// dengan tipe `Transaction` di frontend (src/types/index.ts), bukan bentuk mentah Prisma.
export async function listMyTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return transactions.map((t) => ({
    id: t.id,
    transactionNumber: t.transactionNumber,
    userId: t.userId,
    courseId: t.courseId,
    courseTitle: t.course.title,
    amount: t.amount,
    status: t.status,
    paidAt: t.paidAt,
    createdAt: t.createdAt,
  }));
}
