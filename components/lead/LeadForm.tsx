'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
      router.push('/resultado');
    } catch {
      setSubmitError('Erro de conexão. Verifique sua internet e tente novamente.');
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-display text-xl text-foreground">Quase lá</CardTitle>
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
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
            />
            {fieldErrors.name && <p className="text-xs text-error-text">{fieldErrors.name}</p>}
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <p className="text-xs text-error-text">{fieldErrors.email}</p>}
          </div>

          <label className="flex items-start gap-2 text-sm text-foreground">
            <Checkbox
              checked={optIn}
              onCheckedChange={setOptIn}
              aria-invalid={Boolean(fieldErrors.optIn)}
            />
            Quero receber por e-mail novidades de cursos e conteúdo técnico da Syntaxis
          </label>
          {fieldErrors.optIn && <p className="text-xs text-error-text">{fieldErrors.optIn}</p>}

          {submitError && <p className="text-sm text-error-text">{submitError}</p>}

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={isSubmitting}
            className="self-end"
          >
            {isSubmitting ? 'Enviando…' : 'Ver meu resultado'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
