import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/logo';
import { CLASSIFICATION_CONTEXT, CLASSIFICATION_LABEL, SENIORITY_LABEL } from '@/content/relatorio';
import { cn } from '@/lib/utils';
import type { Classification, SeniorityLevel } from '@/lib/types';

const CLASSIFICATION_BADGE_VARIANT: Record<
  Classification,
  'outline' | 'secondary' | 'achievement'
> = {
  baixo: 'outline',
  medio: 'secondary',
  alto: 'achievement',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

interface ReportHeaderProps {
  participantName: string;
  seniority: SeniorityLevel;
  submittedAt: string;
  classificacao: Classification;
  scoreGlobal: number;
}

export function ReportHeader({
  participantName,
  seniority,
  submittedAt,
  classificacao,
  scoreGlobal,
}: ReportHeaderProps) {
  const seniorityLabel = SENIORITY_LABEL[seniority];

  return (
    <header className="flex w-full max-w-md flex-col items-center gap-3 text-center">
      <Logo />
      <h1 className="font-display text-2xl text-foreground">Diagnóstico de Competências</h1>

      <dl className="flex flex-col gap-0.5 text-sm text-muted-foreground">
        <div>
          <dt className="sr-only">Participante</dt>
          <dd data-testid="report-participant-name" className="text-foreground">
            {participantName}
          </dd>
        </div>
        <div>
          <dt className="sr-only">Nível declarado</dt>
          <dd>{seniorityLabel}</dd>
        </div>
        <div>
          <dt className="sr-only">Data</dt>
          <dd>{formatDate(submittedAt)}</dd>
        </div>
      </dl>

      <div className="flex flex-col items-center gap-1">
        <Badge
          data-testid="score-classificacao"
          variant={CLASSIFICATION_BADGE_VARIANT[classificacao]}
          // shadow.amber é exclusivo do selo ALTO (DESIGN.md §5.4: Amber é
          // conquista real) — única aparição de sombra colorida fora do
          // Card padrão (shadow.syntaxis).
          className={cn('text-sm', classificacao === 'alto' && 'shadow-amber')}
        >
          {CLASSIFICATION_LABEL[classificacao]}
        </Badge>
        <p className="text-sm text-muted-foreground">
          {CLASSIFICATION_CONTEXT[classificacao](seniorityLabel)}
        </p>
        <p data-testid="score-geral" className="font-mono text-xs text-muted-foreground">
          {Math.round(scoreGlobal * 100)}% de acerto geral
        </p>
      </div>
    </header>
  );
}
