import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { success } from '../../utils/apiResponse';
import * as courseService from './courses.service';
import { CourseSort } from './courses.service';
import { HttpError } from '../../utils/httpError';

const VALID_SORTS: CourseSort[] = ['terbaru', 'populer', 'harga-rendah', 'harga-tinggi'];

export const list = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const sortParam = req.query.sort as string | undefined;
  const sort = VALID_SORTS.includes(sortParam as CourseSort) ? (sortParam as CourseSort) : undefined;
  const enrolledOnly = req.query.enrolledOnly === 'true';
  if (enrolledOnly && (!req.user || req.user.role !== 'MEMBER')) {
    throw new HttpError(403, 'Filter Kelas Saya hanya tersedia untuk member yang sudah login');
  }

  const result = await courseService.listCourses({
    category: req.query.category as string | undefined,
    level: req.query.level as string | undefined,
    isFree: req.query.isFree === 'true' ? true : req.query.isFree === 'false' ? false : undefined,
    search: req.query.search as string | undefined,
    sort,
    enrolledByUserId: enrolledOnly ? req.user!.userId : undefined,
    page,
    limit,
  });
  return success(res, result);
});

export const detail = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseDetail(req.params.slug, req.user?.userId);
  return success(res, course);
});

export const detailById = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseDetailById(req.params.id, req.user?.userId);
  return success(res, course);
});

export const listForAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const courses = await courseService.listCoursesForAdmin();
  return success(res, courses);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.createCourse(req.user!.userId, req.body);
  return success(res, course, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  return success(res, course);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await courseService.deleteCourse(req.params.id);
  return success(res, { deleted: true });
});
