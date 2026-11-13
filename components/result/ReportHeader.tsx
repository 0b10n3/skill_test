import { Badge } from '@/components/ui/badge';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Logo } from '@/components/logo';
import { CLASSIFICATION_LABEL_LONGO, SENIORITY_LABEL, VEREDITO_TITULO } from '@/content/relatorio';
import type { Classification, SeniorityLevel } from '@/lib/types';

const CLASSIFICATION_BADGE_VARIANT: Record<
  Classification,
  'outline' | 'secondary' | 'achievement'
> = {
  baixo: 'outline',
  medio: 'secondary',
  alto: 'achievement',
};

const PRIMEIRO_NOME_MAX = 24;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/** Primeira palavra do nome, no máximo 24 caracteres — o título precisa caber em 375 px. */
export function primeiroNome(nomeCompleto: string): string {
  return nomeCompleto.trim().split(/\s+/)[0].slice(0, PRIMEIRO_NOME_MAX);
}

interface ReportHeaderProps {
  participantName: string;
  seniority: SeniorityLevel;
  submittedAt: string;
  classificacao: Classification;
  scoreGlobal: number;
  acertos: number;
  totalQuestoes: number;
}

/**
 * Veredito do relatório (S1, Épico 43): alinhado à esquerda, ao lado do radar
 * no desktop. O logo só aparece na impressão — na tela, o cabeçalho fixo já
 * mostra a marca.
 */
export function ReportHeader({
  participantName,
  seniority,
  submittedAt,
  classificacao,
  scoreGlobal,
  acertos,
  totalQuestoes,
}: ReportHeaderProps) {
  const seniorityLabel = SENIORITY_LABEL[seniority];

  return (
    <header className="flex flex-col gap-4">
      <Logo className="hidden print:inline-flex" />
      <Eyebrow>
        Diagnóstico · {seniorityLabel} · {formatDate(submittedAt)}
      </Eyebrow>
      <h1 className="font-display text-[28px] leading-tight text-balance text-foreground sm:text-4xl">
        <span data-testid="report-participant-name">{primeiroNome(participantName)}</span>,{' '}
        {VEREDITO_TITULO[classificacao](seniorityLabel)}
      </h1>

      <p data-testid="score-geral" className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-stat-number text-foreground">
          {acertos}/{totalQuestoes}
        </span>
        <span className="text-sm text-muted-foreground">
          questões certas · {Math.round(scoreGlobal * 100)}% de acerto
        </span>
      </p>

      <Badge
        data-testid="score-classificacao"
        variant={CLASSIFICATION_BADGE_VARIANT[classificacao]}
        // Lime (variante achievement) é exclusivo do selo "Acima da expectativa" —
        // DESIGN.md §4.1: conquista real. Sem sombra (tokens v3.0.0).
        className="h-auto px-2.5 py-1 text-sm"
      >
        {CLASSIFICATION_LABEL_LONGO[classificacao]}
      </Badge>
    </header>
  );
}
