'use client';

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatternGrowthLine } from '@/components/patterns';
import {
  CATEGORY_LABEL,
  CATEGORY_LABEL_SHORT,
  NEXT_LEVEL_LABEL,
  POR_QUE_IMPORTA,
  PRIMEIRO_PASSO,
} from '@/content/relatorio';
import type { PrioridadeDimensao } from '@/lib/diagnostico';
import type { SeniorityLevel } from '@/lib/types';

const TOP_PRIORITY_COUNT = 2;

interface PriorityCareerSkillsProps {
  prioridades: PrioridadeDimensao[];
  seniority: SeniorityLevel;
}

export function PriorityCareerSkills({ prioridades, seniority }: PriorityCareerSkillsProps) {
  const topPriorities = prioridades.slice(0, TOP_PRIORITY_COUNT);
  const chartData = prioridades.map((p) => ({
    dimensao: CATEGORY_LABEL_SHORT[p.category],
    prioridade: p.prioridade,
    destaque: topPriorities.some((top) => top.category === p.category),
  }));

  return (
    <section
      aria-labelledby="priority-skills-heading"
      className="flex w-full max-w-4xl flex-col gap-3"
    >
      <div className="flex flex-col gap-2">
        <h2 id="priority-skills-heading" className="font-display text-lg text-foreground">
          Onde investir primeiro para chegar a {NEXT_LEVEL_LABEL[seniority]}
        </h2>
        {/* Linha de conquista como protagonista (DESIGN.md §5.2/§5.4) —
            os degraus ilustram "onde você está" → "próximo nível", nunca
            decoração de fundo atrás de texto. */}
        <PatternGrowthLine steps={3} className="h-12 w-40" />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {topPriorities.map((priority, index) => (
          <Card key={priority.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-base text-foreground">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-data text-achievement-foreground dark:bg-accent/20"
                >
                  {index + 1}
                </span>
                {CATEGORY_LABEL[priority.category]}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Por que agora</p>
                <p className="text-foreground">{POR_QUE_IMPORTA[priority.category][seniority]}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Primeiro passo</p>
                <p className="text-foreground">{PRIMEIRO_PASSO[priority.category][seniority]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-sm text-foreground">
            Impacto no próximo degrau, por dimensão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 32 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="dimensao"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  width={64}
                />
                <Bar dataKey="prioridade" radius={4}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.dimensao}
                      fill={entry.destaque ? 'var(--color-semantic-progress-bar)' : 'var(--border)'}
                    />
                  ))}
                  <LabelList
                    dataKey="prioridade"
                    position="right"
                    style={{
                      fontFamily: 'var(--font-data)',
                      fontSize: 11,
                      fill: 'var(--muted-foreground)',
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
