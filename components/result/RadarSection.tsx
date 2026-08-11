'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CATEGORY_LABEL,
  CATEGORY_LABEL_SHORT,
  EXPECTATIVA_DO_NIVEL,
  RADAR_SUMMARY,
} from '@/content/relatorio';
import type { DimensaoDiagnostico } from '@/lib/diagnostico';
import type { KnowledgeCategory } from '@/lib/types';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

interface RadarSectionProps {
  dimensoes: DimensaoDiagnostico[];
  /** Dimensão dominante (`diagnostico.fortes[0]`) — ancora a frase-resumo do formato do radar. */
  dimensaoDominante: KnowledgeCategory;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    const listener = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

export function RadarSection({ dimensoes, dimensaoDominante }: RadarSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const data = dimensoes.map((d) => ({
    dimensao: CATEGORY_LABEL_SHORT[d.category],
    seuPerfil: Math.round(d.score * 100),
    expectativa: Math.round(EXPECTATIVA_DO_NIVEL * 100),
  }));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-display text-lg text-foreground">
          Radar de competências
        </CardTitle>
        <CardDescription>Seu perfil comparado à expectativa do seu nível</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/*
          inert (não só aria-hidden): o SVG do Recharts inclui elementos
          focáveis por padrão — inert remove tanto da árvore de
          acessibilidade quanto da ordem de tab. A leitura real acontece
          pela tabela visually-hidden logo abaixo.
        */}
        <div
          inert
          className="h-64 w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={data}
              outerRadius="65%"
              margin={{ top: 16, right: 24, bottom: 16, left: 24 }}
            >
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="dimensao"
                tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
              />
              <Radar
                name="Expectativa do nível"
                dataKey="expectativa"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                fill="transparent"
                dot={false}
                isAnimationActive={false}
              />
              <Radar
                name="Seu perfil"
                dataKey="seuPerfil"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.35}
                isAnimationActive={!prefersReducedMotion}
                animationDuration={600}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, color: 'var(--muted-foreground)' }}
                iconType="line"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-sm text-foreground">{RADAR_SUMMARY[dimensaoDominante]}</p>

        {/*
          Alternativa textual acessível — mesmos dados do gráfico, sempre
          presente para leitor de tela. sr-only precisa ficar num <div>
          envolvendo a tabela, não na própria <table>: a legenda (<caption>)
          herda o white-space: nowrap do sr-only e tem regra própria de
          dimensionamento que ignora table-layout: fixed, escapando da caixa
          de 1px e vazando como overflow horizontal do documento.
        */}
        <div className="sr-only">
          <table>
            <caption>
              Comparação entre seu perfil e a expectativa do seu nível, por dimensão
            </caption>
            <thead>
              <tr>
                <th scope="col">Dimensão</th>
                <th scope="col">Seu perfil</th>
                <th scope="col">Expectativa do nível</th>
              </tr>
            </thead>
            <tbody>
              {dimensoes.map((d) => (
                <tr key={d.category}>
                  <th scope="row">{CATEGORY_LABEL[d.category]}</th>
                  <td>{Math.round(d.score * 100)}%</td>
                  <td>{Math.round(EXPECTATIVA_DO_NIVEL * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
