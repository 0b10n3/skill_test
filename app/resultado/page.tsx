'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryRadarChart } from '@/components/result/CategoryRadarChart';
import { OfferBlock } from '@/components/result/OfferBlock';
import { ScoreCard } from '@/components/result/ScoreCard';
import { useQuizAnswers } from '@/lib/quiz-context';

export default function ResultadoPage() {
  const router = useRouter();
  const { result } = useQuizAnswers();
  const [copied, setCopied] = useState(false);

  // Acesso direto (URL sem ter passado pelo fluxo real, ou refresh que perdeu
  // o estado em memória) nunca mostra um resultado vazio/fictício.
  useEffect(() => {
    if (!result) {
      router.replace('/');
    }
  }, [result, router]);

  if (!result) {
    return null;
  }

  async function handleCopy() {
    if (!result) return;
    const summary = `Meu resultado no Syntaxis Skill Check: ${result.scoreGeral}% (${result.narrative.headline})`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ação secundária e não-crítica — falha aqui não afeta o fluxo principal.
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center gap-6 px-6 py-10">
      <ScoreCard scoreGeral={result.scoreGeral} classification={result.classification} />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-lg text-foreground">
            {result.narrative.headline}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text-medium">{result.narrative.body}</p>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-lg text-foreground">
            Desempenho por categoria
          </CardTitle>
          <CardDescription>Radar com o percentual de acerto em cada área</CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryRadarChart scorePorCategoria={result.scorePorCategoria} />
        </CardContent>
      </Card>

      <OfferBlock classification={result.classification} />

      <Button variant="ghost" onClick={handleCopy}>
        {copied ? 'Copiado!' : 'Copiar resultado'}
      </Button>
    </main>
  );
}
