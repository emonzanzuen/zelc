// Utilitas kecil: cetak semua course (id, title, slug, published) dari database aktif.
// Dipakai saat butuh ID asli untuk testing payload (mis. courseIds di POST /admin/roadmaps),
// tanpa harus buka Prisma Studio atau tulis query manual tiap kali.
//
// Jalankan: npm run list:courses

import { prisma } from '../src/lib/prisma';

async function main() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, slug: true, published: true },
    orderBy: { createdAt: 'asc' },
  });

  if (courses.length === 0) {
    console.log('Belum ada course di database. Jalankan "npm run seed" dulu.');
    return;
  }

  console.log('\nDaftar Course:\n');
  for (const c of courses) {
    const status = c.published ? 'published' : 'draft';
    console.log(`[${status}] ${c.title}`);
    console.log(`  id:   ${c.id}`);
    console.log(`  slug: ${c.slug}\n`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
