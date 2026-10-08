import { z } from 'zod';

const questionFields = z.object({
  text: z.string().min(3),
  options: z.array(z.string().min(1)).length(4, 'Harus ada tepat 4 opsi jawaban'),
  correctOption: z.string().min(1),
});

export const questionInputSchema = questionFields.refine((question) => question.options.includes(question.correctOption), {
  message: 'Jawaban benar harus sama dengan salah satu opsi',
  path: ['correctOption'],
});

export const createQuestionSchema = questionFields.extend({ quizId: z.string().uuid() }).refine((question) => question.options.includes(question.correctOption), {
  message: 'Jawaban benar harus sama dengan salah satu opsi',
  path: ['correctOption'],
});
export const updateQuestionSchema = questionFields.partial();

export const createQuizSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(3),
  passingGrade: z.number().int().min(0).max(100).default(70),
  questions: z.array(questionInputSchema).min(1, 'Minimal 1 soal'),
});

export const updateQuizSchema = z.object({
  title: z.string().min(3).optional(),
  passingGrade: z.number().int().min(0).max(100).optional(),
});

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid(),
        selectedOption: z.string(),
      })
    )
    .min(1, 'Jawaban tidak boleh kosong'),
});
