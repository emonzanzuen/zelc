import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin12345', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lmsenglish.test' },
    update: {},
    create: {
      name: 'Admin LMS',
      email: 'admin@lmsenglish.test',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const [grammar, speaking, toefl] = await Promise.all(
    [
      { name: 'Grammar', slug: 'grammar' },
      { name: 'Speaking', slug: 'speaking' },
      { name: 'Persiapan TOEFL', slug: 'toefl' },
    ].map((c) => prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c }))
  );

  const grammarCourse = await prisma.course.upsert({
    where: { slug: 'grammar-dasar-untuk-pemula' },
    update: {},
    create: {
      title: 'Grammar Dasar untuk Pemula',
      slug: 'grammar-dasar-untuk-pemula',
      description:
        'Kuasai fondasi grammar Bahasa Inggris dari nol: tenses, parts of speech, dan struktur kalimat dasar.',
      price: 0,
      isFree: true,
      level: 'Pemula',
      published: true,
      categoryId: grammar.id,
      authorId: admin.id,
      lessons: {
        create: [
          {
            title: 'Pengenalan Parts of Speech',
            youtubeUrl: 'https://www.youtube.com/watch?v=example1',
            durationMinutes: 10,
            order: 1,
            isPreview: true,
          },
          {
            title: 'Simple Present Tense',
            youtubeUrl: 'https://www.youtube.com/watch?v=example2',
            durationMinutes: 12,
            order: 2,
            isPreview: false,
          },
          {
            title: 'Simple Past Tense',
            youtubeUrl: 'https://www.youtube.com/watch?v=example3',
            durationMinutes: 14,
            order: 3,
            isPreview: false,
          },
        ],
      },
    },
  });

  await prisma.quiz.upsert({
    where: { courseId: grammarCourse.id },
    update: {},
    create: {
      courseId: grammarCourse.id,
      title: 'Quiz Grammar Dasar',
      passingGrade: 70,
      questions: {
        create: [
          {
            text: 'Choose the correct form: She ___ to school every day.',
            options: ['go', 'goes', 'going', 'gone'],
            correctOption: 'goes',
          },
          {
            text: 'Which one is a noun?',
            options: ['Run', 'Beautiful', 'Table', 'Quickly'],
            correctOption: 'Table',
          },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: 'persiapan-toefl-itp' },
    update: {},
    create: {
      title: 'Persiapan TOEFL ITP',
      slug: 'persiapan-toefl-itp',
      description:
        'Strategi & latihan intensif untuk menghadapi tes TOEFL ITP, mencakup Listening, Structure, dan Reading.',
      price: 150000,
      isFree: false,
      level: 'Menengah',
      published: true,
      categoryId: toefl.id,
      authorId: admin.id,
      lessons: {
        create: [
          {
            title: 'Pengenalan Structure & Written Expression',
            youtubeUrl: 'https://www.youtube.com/watch?v=example4',
            durationMinutes: 15,
            order: 1,
            isPreview: true,
          },
          {
            title: 'Strategi Reading Comprehension',
            youtubeUrl: 'https://www.youtube.com/watch?v=example5',
            durationMinutes: 20,
            order: 2,
            isPreview: false,
          },
        ],
      },
    },
  });

  await prisma.course.upsert({
    where: { slug: 'speaking-percaya-diri' },
    update: {},
    create: {
      title: 'Speaking dengan Percaya Diri',
      slug: 'speaking-percaya-diri',
      description: 'Latihan speaking sehari-hari untuk percakapan kerja & sosial.',
      price: 99000,
      isFree: false,
      level: 'Pemula',
      published: true,
      categoryId: speaking.id,
      authorId: admin.id,
      lessons: {
        create: [
          {
            title: 'Basic Greetings & Introductions',
            youtubeUrl: 'https://www.youtube.com/watch?v=example6',
            durationMinutes: 8,
            order: 1,
            isPreview: true,
          },
        ],
      },
    },
  });

  const speakingCourse = await prisma.course.findUnique({ where: { slug: 'speaking-percaya-diri' } });
  const toeflCourse = await prisma.course.findUnique({ where: { slug: 'persiapan-toefl-itp' } });

  // Contoh Roadmap (PRD §27.5) — disusun manual dari course yang sudah ada
  await prisma.roadmap.upsert({
    where: { slug: 'jalur-siap-toefl' },
    update: {},
    create: {
      title: 'Jalur Siap TOEFL',
      slug: 'jalur-siap-toefl',
      description: 'Mulai dari fondasi Grammar sampai siap menghadapi tes TOEFL ITP, disusun bertahap.',
      published: true,
      courses: {
        create: [
          { courseId: grammarCourse.id, order: 1 },
          ...(toeflCourse ? [{ courseId: toeflCourse.id, order: 2 }] : []),
        ],
      },
    },
  });

  await prisma.roadmap.upsert({
    where: { slug: 'jalur-karier-business-english' },
    update: {},
    create: {
      title: 'Jalur Karier: Business English',
      slug: 'jalur-karier-business-english',
      description: 'Bangun kepercayaan diri berbicara Bahasa Inggris untuk kebutuhan kerja & karier.',
      published: true,
      courses: {
        create: [
          { courseId: grammarCourse.id, order: 1 },
          ...(speakingCourse ? [{ courseId: speakingCourse.id, order: 2 }] : []),
        ],
      },
    },
  });

  console.log('✅ Seed selesai.');
  console.log('   Login admin: admin@lmsenglish.test / admin12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
