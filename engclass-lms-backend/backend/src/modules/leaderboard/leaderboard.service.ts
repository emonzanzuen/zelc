import { prisma } from '../../lib/prisma';

interface LeaderboardEntry {
  name: string;
  avatarUrl: string | null;
  totalLessonsCompleted: number;
  totalMinutesLearned: number;
}

// Business rule §17.17: metrik utama total menit belajar, sekunder jumlah lesson selesai,
// direset otomatis tiap bulan (dihitung dari rentang tanggal, bukan field status tersendiri).
export async function getLeaderboard(month?: string) {
  const now = new Date();
  const [year, mon] = month ? month.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 1);

  const progress = await prisma.lessonProgress.findMany({
    where: { completedAt: { gte: start, lt: end } },
    include: {
      lesson: { select: { durationMinutes: true } },
      user: { select: { id: true, name: true, avatarUrl: true } },
    },
  });

  const map = new Map<string, LeaderboardEntry>();

  for (const p of progress) {
    const key = p.user.id;
    const entry = map.get(key) ?? {
      name: p.user.name,
      avatarUrl: p.user.avatarUrl,
      totalLessonsCompleted: 0,
      totalMinutesLearned: 0,
    };
    entry.totalLessonsCompleted += 1;
    entry.totalMinutesLearned += p.lesson.durationMinutes;
    map.set(key, entry);
  }

  const rankings = Array.from(map.values())
    .sort((a, b) => b.totalMinutesLearned - a.totalMinutesLearned || b.totalLessonsCompleted - a.totalLessonsCompleted)
    .slice(0, 50)
    .map((entry, index) => ({ rank: index + 1, ...entry }));

  return { period: `${year}-${String(mon).padStart(2, '0')}`, rankings };
}
