import { z } from 'zod';

/**
 * Schema compartilhado entre o formulário client de /lead e a revalidação
 * server-side em app/api/submit/route.ts — a mesma regra dos dois lados,
 * sem duplicar (e sem risco de divergir) a definição de "e-mail válido" ou
 * "opt-in precisa estar marcado".
 */
export const leadSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z.string().trim().email('E-mail inválido'),
  optIn: z.literal(true, {
    message: 'É necessário aceitar receber comunicações da Syntaxis para prosseguir',
  }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const submitPayloadSchema = z.object({
  answers: z
    .record(z.string(), z.string())
    .refine((answers) => Object.keys(answers).length > 0, 'Nenhuma resposta enviada'),
  lead: leadSchema,
});

export type SubmitPayload = z.infer<typeof submitPayloadSchema>;

/**
 * Payload do botão "Receber este relatório por e-mail" (S7) — re-sincroniza
 * o subscriber já opt-in na MailerLite (não é uma nova coleta de opt-in).
 */
export const resendReportSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  email: z.string().trim().email('E-mail inválido'),
  seniority: z.enum(['aspirante', 'estagiario', 'junior', 'pleno', 'senior']),
  scoreGeral: z.number().min(0).max(100),
  classification: z.enum(['baixo', 'medio', 'alto']),
});

export type ResendReportPayload = z.infer<typeof resendReportSchema>;
