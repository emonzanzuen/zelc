import { prisma } from '../../lib/prisma';

// `monthlyRevenue` adalah PENAMBAHAN field baru (tidak ada di §29 PRD semula) —
// ditambahkan untuk mendukung chart revenue per bulan di §12.2 (should have).
async function getMonthlyRevenue(months = 12) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const transactions = await prisma.transaction.findMany({
    where: { status: 'success', paidAt: { gte: start } },
    select: { amount: true, paidAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1) + i, 1);
    buckets.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, 0);
  }

  for (const t of transactions) {
    if (!t.paidAt) continue;
    const key = `${t.paidAt.getFullYear()}-${String(t.paidAt.getMonth() + 1).padStart(2, '0')}`;
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + t.amount);
  }

  return Array.from(buckets.entries()).map(([month, revenue]) => ({ month, revenue }));
}

export async function getStats() {
  const [totalRevenueAgg, totalTransactions, totalMembers, totalPublishedCourses, topCoursesRaw, monthlyRevenue] =
    await Promise.all([
      prisma.transaction.aggregate({ where: { status: 'success' }, _sum: { amount: true } }),
      prisma.transaction.count({ where: { status: 'success' } }),
      prisma.user.count({ where: { role: 'MEMBER' } }),
      prisma.course.count({ where: { published: true } }),
      prisma.course.findMany({
        select: { title: true, _count: { select: { enrollments: true } } },
        orderBy: { enrollments: { _count: 'desc' } },
        take: 5,
      }),
      getMonthlyRevenue(12),
    ]);

  return {
    totalRevenue: totalRevenueAgg._sum.amount ?? 0,
    totalTransactions,
    totalMembers,
    totalPublishedCourses,
    topCourses: topCoursesRaw.map((c) => ({ title: c.title, enrollmentCount: c._count.enrollments })),
    monthlyRevenue,
  };
}

export function listMembers() {
  return prisma.user.findMany({
    where: { role: 'MEMBER' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      googleId: true,
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export function listAllTransactions() {
  return prisma.transaction.findMany({
    include: { user: { select: { name: true } }, course: { select: { title: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
