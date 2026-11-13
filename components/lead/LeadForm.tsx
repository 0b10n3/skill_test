'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { track } from '@/lib/analytics/track';
import { useQuizAnswers } from '@/lib/quiz-context';
import { leadSchema } from '@/lib/validations';
import type { SubmitResult } from '@/lib/types';

interface LeadFormProps {
  seniorityLabel: string;
}

export function LeadForm({ seniorityLabel }: LeadFormProps) {
  const router = useRouter();
  const { answers, setResult } = useQuizAnswers();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const parsed = leadSchema.safeParse({ name, email, optIn });
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[String(issue.path[0])] = issue.message;
      }
      setFieldErrors(errors);
      // No celular os erros podem empurrar o formulário para fora da tela: o foco leva ao primeiro.
      const primeiro = parsed.error.issues[0]?.path[0];
      document
        .getElementById(primeiro === 'optIn' ? 'lead-optin' : `lead-${String(primeiro)}`)
        ?.focus();
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ answers, lead: parsed.data }),
      });

      if (!response.ok) {
        setSubmitError('Não foi possível enviar suas respostas. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      const result: SubmitResult = await response.json();
      setResult(result, parsed.data.email);
      track('lead_submitted', { nivel: result.seniority });
      router.push('/resultado');
    } catch {
      setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.');
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md shrink-0">
      <CardHeader>
        {/* h1 real, não a CardTitle padrão (<div>) — /lead é a única "página"
            desse passo do funil (Épico 21, higiene técnica: 1 h1 por rota).
            data-slot="card-title" preservado: é o seletor de teste usado
            em vários specs E2E para "a página do card carregou". */}
        <h1 data-slot="card-title" className="font-display text-xl text-foreground">
          Seu diagnóstico está pronto.
        </h1>
        <p className="text-sm text-muted-foreground">
          Informe seu nome e e-mail para ver o relatório: radar das 5 dimensões, suas 2 prioridades
          e o gabarito comentado.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-muted-foreground">Seu momento no mercado</span>
            <p className="font-mono text-sm text-foreground">{seniorityLabel}</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-name" className="text-sm text-muted-foreground">
              Nome
            </label>
            <Input
              id="lead-name"
              name="name"
              autoComplete="name"
              className="h-11"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'lead-name-error' : undefined}
            />
            {fieldErrors.name && (
              <p id="lead-name-error" className="text-sm text-error-text">
                {fieldErrors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lead-email" className="text-sm text-muted-foreground">
              E-mail
            </label>
            <Input
              id="lead-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              className="h-11"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'lead-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="lead-email-error" className="text-sm text-error-text">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm text-foreground">
            <Checkbox
              id="lead-optin"
              checked={optIn}
              onCheckedChange={setOptIn}
              aria-invalid={Boolean(fieldErrors.optIn)}
              aria-describedby={fieldErrors.optIn ? 'lead-optin-error' : undefined}
            />
            Quero receber por e-mail novidades de cursos e conteúdo técnico da Syntaxis
          </label>
          {fieldErrors.optIn && (
            <p id="lead-optin-error" className="text-sm text-error-text">
              {fieldErrors.optIn}
            </p>
          )}

          {submitError && (
            <p role="alert" className="text-sm text-error-text">
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:self-end"
          >
            {isSubmitting ? 'Enviando…' : 'Ver meu resultado'}
          </Button>
          <p className="text-xs text-muted-foreground sm:text-right">
            Seus dados são tratados conforme a{' '}
            <a
              href="/privacidade"
              target="_blank"
              rel="noopener"
              className="text-link-foreground underline underline-offset-2"
            >
              política de privacidade
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            .
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
