import {
  BrainCircuit,
  Database,
  Landmark,
  ShieldAlert,
  Sigma,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Progress } from '@/components/ui/progress';
import { CATEGORY_LABEL, SCORE_CARD_COPY } from '@/content/relatorio';
import type { DimensaoDiagnostico, DimensionEtiqueta } from '@/lib/diagnostico';
import type { KnowledgeCategory } from '@/lib/types';

// Ícone Lucide para as 5 dimensões — tratamento uniforme (Épico 34). Só 3
// das 5 tinham ilustração gerada aprovada (Épico 16); as outras 2
// (dimensao-matematica-quant, dimensao-dados-programacao) ficaram travadas
// em "decision: pending" desde 11/08 por um achado de cor fora de contexto
// (PR #20) e nunca foram completadas — resultado visual inconsistente: 3
// cards com ícone-foto, 2 com ícone de linha. Revertido para ícone em
// todos os 5; os 3 assets aprovados (assets/prompts/dimensao-*.md,
// public/img/dimensao-*) não foram apagados — ficam sem consumidor aqui,
// decisão do founder sobre reaproveitá-los (ex.: na landing) é separada.
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

// forte → secondary (família Grove/ação, DESIGN.md §4.1); neutro → outline
// (neutro, sem cor de marca); atencao → attention (Lime-700/300 como
// texto de alerta construtivo — nunca destructive: um resultado baixo é
// mapa de desenvolvimento, não erro de sistema, ver DESIGN.md §18 "boas
// práticas aplicadas").
const ETIQUETA_BADGE_VARIANT: Record<DimensionEtiqueta, 'secondary' | 'outline' | 'attention'> = {
  forte: 'secondary',
  neutro: 'outline',
  atencao: 'attention',
};

interface DimensionScoreCardsProps {
  dimensoes: DimensaoDiagnostico[];
}

export function DimensionScoreCards({ dimensoes }: DimensionScoreCardsProps) {
  return (
    <section aria-labelledby="score-cards-heading" className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Eyebrow>Por dimensão</Eyebrow>
        <h2 id="score-cards-heading" className="font-display text-lg text-foreground">
          Desempenho por dimensão
        </h2>
      </div>
      {/* Épico 43: até lg, uma lista única com hairline entre as linhas (cinco cartões
          empilhados ocupavam ~700 px no celular); a partir de lg, cinco colunas. */}
      <ul className="grid grid-cols-1 divide-y divide-border border border-border bg-card lg:grid-cols-5 lg:gap-3 lg:divide-y-0 lg:border-0 lg:bg-transparent">
        {dimensoes.map((dimensao) => {
          const Icon = CATEGORY_ICON[dimensao.category];
          return (
            <li
              key={dimensao.category}
              className="flex flex-col gap-2 p-4 lg:border lg:border-border lg:bg-card"
            >
              <div className="flex items-center gap-2">
                <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                <h3 className="font-display text-sm text-foreground">
                  {CATEGORY_LABEL[dimensao.category]}
                </h3>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-data-xl text-foreground">
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
              <p className="text-sm text-muted-foreground">
                {SCORE_CARD_COPY[dimensao.category][dimensao.etiqueta]}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
