import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Classification } from '@/lib/types';

const CLASSIFICATION_LABEL: Record<Classification, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
};

const CLASSIFICATION_BADGE_VARIANT: Record<Classification, 'outline' | 'secondary' | 'default'> = {
  baixo: 'outline',
  medio: 'secondary',
  alto: 'default',
};

interface ScoreCardProps {
  scoreGeral: number;
  classification: Classification;
}

export function ScoreCard({ scoreGeral, classification }: ScoreCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-display text-lg text-foreground">Seu resultado</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <p data-testid="score-geral" className="font-mono text-5xl font-bold text-volt-500">
          {scoreGeral}%
        </p>
        <Badge
          data-testid="score-classificacao"
          variant={CLASSIFICATION_BADGE_VARIANT[classification]}
          className="text-sm"
        >
          {CLASSIFICATION_LABEL[classification]}
        </Badge>
      </CardContent>
    </Card>
  );
}
