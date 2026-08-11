import { Badge } from '@/components/ui/badge';
import { CLASSIFICATION_CONTEXT, CLASSIFICATION_LABEL, SENIORITY_LABEL } from '@/content/relatorio';
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
      <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
        Syntaxis Skill Check
      </p>
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
          className="text-sm"
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
