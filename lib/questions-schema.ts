import { z } from 'zod';

const seniorityLevelSchema = z.enum(['aspirante', 'estagiario', 'junior', 'pleno', 'senior']);

const categorySchema = z.enum([
  'produtos-renda-fixa',
  'matematica-financeira-estatistica',
  'dados-tecnologia',
  'ia-aplicada-financas',
  'perfil-senioridade',
  'perfil-tecnico',
]);

const difficultySchema = z.enum(['easy', 'medium', 'hard']);

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  profileTag: z.string().min(1).optional(),
});

const baseQuestionSchema = z.object({
  id: z.string().min(1),
  category: categorySchema,
  difficultyLevel: difficultySchema.optional(),
  targetSeniority: z.array(seniorityLevelSchema).optional(),
  question: z.string().min(1),
  options: z.array(optionSchema).min(2),
  correctOptionId: z.string().min(1).optional(),
  explanation: z.string().min(1).optional(),
});

const seniorityQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('seniority'),
});

const knowledgeQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('knowledge'),
  targetSeniority: z.array(seniorityLevelSchema).min(1),
  correctOptionId: z.string().min(1),
  explanation: z.string().min(1),
});

const selfAssessmentQuestionSchema = baseQuestionSchema.extend({
  type: z.literal('self_assessment'),
});

export const questionSchema = z.discriminatedUnion('type', [
  seniorityQuestionSchema,
  knowledgeQuestionSchema,
  selfAssessmentQuestionSchema,
]);

export const questionsBankSchema = z.array(questionSchema).superRefine((questions, ctx) => {
  for (const question of questions) {
    const optionIds = question.options.map((option) => option.id);
    if (question.correctOptionId && !optionIds.includes(question.correctOptionId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `correctOptionId "${question.correctOptionId}" não existe entre as options de "${question.id}"`,
      });
    }
  }
});

export type ParsedQuestion = z.infer<typeof questionSchema>;

export function parseQuestionsBank(data: unknown): ParsedQuestion[] {
  return questionsBankSchema.parse(data);
}
