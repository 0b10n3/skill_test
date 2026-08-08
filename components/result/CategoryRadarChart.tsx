'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import type { CategoryScore, KnowledgeCategory } from '@/lib/types';

const CATEGORY_LABEL: Record<KnowledgeCategory, string> = {
  'produtos-renda-fixa': 'Renda Fixa',
  'matematica-financeira-estatistica': 'Mat. Financeira',
  'dados-tecnologia': 'Dados & Tech',
  'ia-aplicada-financas': 'IA Aplicada',
};

const CATEGORY_LABEL_SHORT: Record<KnowledgeCategory, string> = {
  'produtos-renda-fixa': 'Renda',
  'matematica-financeira-estatistica': 'Mat.',
  'dados-tecnologia': 'Dados',
  'ia-aplicada-financas': 'IA',
};

interface CategoryRadarChartProps {
  scorePorCategoria: CategoryScore[];
}

export function CategoryRadarChart({ scorePorCategoria }: CategoryRadarChartProps) {
  const data = scorePorCategoria.map((category) => ({
    category: CATEGORY_LABEL_SHORT[category.category],
    percentage: category.percentage,
  }));

  return (
    <div className="flex w-full flex-col gap-3">
      <div aria-hidden="true" className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            outerRadius="65%"
            margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
          >
            <PolarGrid stroke="var(--color-line)" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: 'var(--color-text-medium)', fontSize: 11 }}
            />
            <Radar
              dataKey="percentage"
              stroke="var(--color-volt-500)"
              fill="var(--color-volt-500)"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Alternativa textual ao gráfico — a leitura não depende só de cor/forma. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs text-text-medium">
        {scorePorCategoria.map((category) => (
          <li key={category.category} className="flex justify-between gap-2">
            <span>{CATEGORY_LABEL[category.category]}</span>
            <span className="text-foreground">{category.percentage}%</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-text-medium">
        Leitura diagnóstica rápida (3 perguntas por categoria) — não é um teste psicometricamente
        robusto.
      </p>
    </div>
  );
}
