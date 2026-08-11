import {
  BrainCircuit,
  Database,
  Landmark,
  ShieldAlert,
  Sigma,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CATEGORY_LABEL, SCORE_CARD_COPY } from '@/content/relatorio';
import type { DimensaoDiagnostico, DimensionEtiqueta } from '@/lib/diagnostico';
import type { KnowledgeCategory } from '@/lib/types';

const CATEGORY_ICON: Record<KnowledgeCategory, LucideIcon> = {
  'mercados-produtos': Landmark,
  'matematica-quant': Sigma,
  'dados-programacao': Database,
  'ia-aplicada': BrainCircuit,
  'risco-regulacao': ShieldAlert,
};

const ETIQUETA_LABEL: Record<DimensionEtiqueta, string> = {
  forte: 'Ponto forte',
  neutro: 'Em desenvolvimento',
  atencao: 'Ponto de atenção',
};

const ETIQUETA_BADGE_VARIANT: Record<DimensionEtiqueta, 'default' | 'secondary' | 'outline'> = {
  forte: 'default',
  neutro: 'secondary',
  atencao: 'outline',
};

interface DimensionScoreCardsProps {
  dimensoes: DimensaoDiagnostico[];
}

export function DimensionScoreCards({ dimensoes }: DimensionScoreCardsProps) {
  return (
    <section aria-labelledby="score-cards-heading" className="flex w-full max-w-4xl flex-col gap-3">
      <h2 id="score-cards-heading" className="font-display text-lg text-foreground">
        Desempenho por dimensão
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {dimensoes.map((dimensao) => {
          const Icon = CATEGORY_ICON[dimensao.category];
          return (
            <Card key={dimensao.category} size="sm" className="flex flex-col gap-2">
              <CardHeader className="flex flex-row items-center gap-2">
                <Icon aria-hidden className="size-4 text-muted-foreground" />
                <CardTitle className="font-display text-sm text-foreground">
                  {CATEGORY_LABEL[dimensao.category]}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-bold text-foreground">
                    {dimensao.acertos}/{dimensao.total}
                  </span>
                  <Badge variant={ETIQUETA_BADGE_VARIANT[dimensao.etiqueta]}>
                    {ETIQUETA_LABEL[dimensao.etiqueta]}
                  </Badge>
                </div>
                <Progress
                  value={dimensao.score * 100}
                  aria-label={`Progresso em ${CATEGORY_LABEL[dimensao.category]}`}
                />
                <p className="text-xs text-muted-foreground">
                  {SCORE_CARD_COPY[dimensao.category][dimensao.etiqueta]}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
