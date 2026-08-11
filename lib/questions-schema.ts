import { z } from 'zod';

const seniorityLevelSchema = z.enum(['aspirante', 'estagiario', 'junior', 'pleno', 'senior']);

const categorySchema = z.enum([
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
  'perfil-senioridade',
]);

const difficultySchema = z.enum(['easy', 'medium', 'hard']);

const cognitiveLevelSchema = z.enum(['compreender', 'aplicar', 'analisar']);

const optionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  profileTag: z.string().min(1).optional(),
});

const baseQuestionSchema = z.object({
  id: z.string().min(1),
  category: categorySchema,
  difficultyLevel: difficultySchema.optional(),
  cognitiveLevel: cognitiveLevelSchema.optional(),
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

export const questionSchema = z.discriminatedUnion('type', [
  seniorityQuestionSchema,
  knowledgeQuestionSchema,
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
