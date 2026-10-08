-- ZELC LMS Database Schema (PostgreSQL)
-- Generated from Prisma schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum: Role
CREATE TYPE "Role" AS ENUM ('MEMBER', 'ADMIN');

-- Table: User
CREATE TABLE "User" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" TEXT,
  "googleId" VARCHAR(255) UNIQUE,
  "role" "Role" NOT NULL DEFAULT 'MEMBER',
  "avatarUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: Category
CREATE TABLE "Category" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL UNIQUE
);

-- Table: Course
CREATE TABLE "Course" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "price" INTEGER NOT NULL DEFAULT 0,
  "isFree" BOOLEAN NOT NULL DEFAULT false,
  "level" VARCHAR(50),
  "published" BOOLEAN NOT NULL DEFAULT false,
  "categoryId" UUID NOT NULL,
  "authorId" UUID NOT NULL,
  "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Course_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");
CREATE INDEX "Course_published_idx" ON "Course"("published");

-- Table: Lesson
CREATE TABLE "Lesson" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "courseId" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "youtubeUrl" TEXT NOT NULL,
  "durationMinutes" INTEGER NOT NULL DEFAULT 0,
  "order" INTEGER NOT NULL,
  "isPreview" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Enrollment
CREATE TABLE "Enrollment" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "courseId" UUID NOT NULL,
  "progress" INTEGER NOT NULL DEFAULT 0,
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("userId", "courseId")
);

-- Table: Transaction
CREATE TABLE "Transaction" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "courseId" UUID NOT NULL,
  "transactionNumber" VARCHAR(100) NOT NULL UNIQUE,
  "amount" INTEGER NOT NULL,
  "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
  "snapToken" TEXT,
  "redirectUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "paidAt" TIMESTAMP(3),
  CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Transaction_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Quiz
CREATE TABLE "Quiz" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "courseId" UUID NOT NULL UNIQUE,
  "title" VARCHAR(255) NOT NULL,
  "passingGrade" INTEGER NOT NULL DEFAULT 70,
  CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: QuizQuestion
CREATE TABLE "QuizQuestion" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "quizId" UUID NOT NULL,
  "text" TEXT NOT NULL,
  "options" TEXT[] NOT NULL,
  CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: QuizAttempt
CREATE TABLE "QuizAttempt" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "quizId" UUID NOT NULL,
  "score" INTEGER NOT NULL,
  "passed" BOOLEAN NOT NULL,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Certificate
CREATE TABLE "Certificate" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "certNumber" VARCHAR(100) NOT NULL UNIQUE,
  "userId" UUID NOT NULL,
  "courseId" UUID NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "downloadUrl" TEXT,
  CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: Review
CREATE TABLE "Review" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "courseId" UUID NOT NULL,
  "rating" INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  "comment" TEXT,
  "isHidden" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Table: LessonProgress
CREATE TABLE "LessonProgress" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL,
  "lessonId" UUID NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("userId", "lessonId")
);

-- Table: Roadmap
CREATE TABLE "Roadmap" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "title" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "thumbnailUrl" TEXT,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Table: RoadmapCourse
CREATE TABLE "RoadmapCourse" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "roadmapId" UUID NOT NULL,
  "courseId" UUID NOT NULL,
  "order" INTEGER NOT NULL,
  CONSTRAINT "RoadmapCourse_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "RoadmapCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE ("roadmapId", "courseId"),
  UNIQUE ("roadmapId", "order")
);

-- ================================
-- SEED DATA DASAR
-- ================================

-- Kategori
INSERT INTO "Category" ("id", "name", "slug") VALUES
  (gen_random_uuid(), 'IELTS', 'ielts'),
  (gen_random_uuid(), 'Grammar', 'grammar'),
  (gen_random_uuid(), 'Vocabulary', 'vocabulary');

-- Roadmap
INSERT INTO "Roadmap" ("id", "title", "slug", "description", "published", "createdAt") VALUES
  (gen_random_uuid(), 'Jalur Siap IELTS Academic', 'jalur-siap-ielts-academic', 'Roadmap terstruktur untuk persiapan IELTS Academic dari level pemula hingga siap tes.', true, CURRENT_TIMESTAMP);
