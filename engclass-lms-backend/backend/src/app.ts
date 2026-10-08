import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { authenticate } from './middleware/authenticate';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import * as authController from './modules/auth/auth.controller';

import { publicCategoryRouter, adminCategoryRouter } from './modules/categories/categories.routes';
import { publicCourseRouter, adminCourseRouter } from './modules/courses/courses.routes';
import { memberLessonRouter, adminLessonRouter } from './modules/lessons/lessons.routes';

import enrollmentRoutes from './modules/enrollments/enrollments.routes';
import * as enrollmentController from './modules/enrollments/enrollments.controller';

import { transactionRouter } from './modules/transactions/transactions.routes';
import * as transactionController from './modules/transactions/transactions.controller';

import { memberQuizRouter, adminQuizRouter } from './modules/quiz/quiz.routes';

import { certificateRouter } from './modules/certificates/certificates.routes';
import * as certificateController from './modules/certificates/certificates.controller';

import { reviewRouter, adminReviewRouter } from './modules/reviews/reviews.routes';
import { leaderboardRouter } from './modules/leaderboard/leaderboard.routes';
import { adminRouter } from './modules/admin/admin.routes';
import { uploadRouter } from './modules/upload/upload.routes';
import { publicRoadmapRouter, adminRoadmapRouter } from './modules/roadmaps/roadmaps.routes';
import * as roadmapController from './modules/roadmaps/roadmaps.controller';
import usersRouter from './modules/users/users.routes';

const app = express();

// CORS origin frontend (PRD security requirements)
app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json());

const v1 = express.Router();
v1.use(usersRouter);

// ---- Auth ----
v1.use('/auth', authRoutes);
v1.get('/me', authenticate, authController.me);

// ---- Public catalog ----
v1.use('/categories', publicCategoryRouter);
v1.use('/admin/categories', adminCategoryRouter);

v1.use('/courses', publicCourseRouter);
v1.use('/admin/courses', adminCourseRouter);

// ---- Reviews (nested di bawah course, courseId lewat mergeParams) ----
v1.use('/courses/:courseId/reviews', reviewRouter);
v1.use('/admin/reviews', adminReviewRouter);

// ---- Lessons ----
v1.use('/lessons', memberLessonRouter);
v1.use('/admin/lessons', adminLessonRouter);

// ---- Enrollment ----
v1.use('/enrollments', enrollmentRoutes);
v1.get('/me/enrollments', authenticate, enrollmentController.mine);

// ---- Transactions ----
v1.use('/transactions', transactionRouter);
v1.get('/me/transactions', authenticate, transactionController.mine);

// ---- Quiz ----
v1.use('/quiz', memberQuizRouter);
v1.use('/admin/quiz', adminQuizRouter);

// ---- Certificates ----
v1.use('/certificates', certificateRouter);
v1.get('/me/certificates', authenticate, certificateController.mine);
v1.get('/me/certificates/:id/download', authenticate, certificateController.downloadMine);

// ---- Leaderboard ----
v1.use('/leaderboard', leaderboardRouter);

// ---- Roadmap (PRD v3.1) ----
v1.use('/roadmaps', publicRoadmapRouter);
v1.use('/admin/roadmaps', adminRoadmapRouter);
v1.get('/me/roadmap-progress/:roadmapId', authenticate, roadmapController.myProgress);

// ---- Admin dashboard & upload (mounted setelah sub-resource admin spesifik di atas) ----
v1.use('/admin', adminRouter);
v1.use('/admin/upload', uploadRouter);

app.use('/api/v1', v1);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'LMS Bahasa Inggris API berjalan' });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
