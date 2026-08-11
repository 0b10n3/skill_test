import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_LABEL, POR_QUE_IMPORTA } from '@/content/relatorio';
import type { Diagnostico } from '@/lib/diagnostico';
import type { SeniorityLevel } from '@/lib/types';

interface StrengthsAndFocusProps {
  diagnostico: Diagnostico;
  seniority: SeniorityLevel;
}

export function StrengthsAndFocus({ diagnostico, seniority }: StrengthsAndFocusProps) {
  return (
    <section
      aria-labelledby="strengths-focus-heading"
      className="grid w-full max-w-4xl grid-cols-1 gap-3 md:grid-cols-2"
    >
      <h2 id="strengths-focus-heading" className="sr-only">
        Pontos fortes e pontos de atenção
      </h2>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base text-foreground">O que te destaca</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {diagnostico.fortes.map((category) => (
            <div key={category} className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{CATEGORY_LABEL[category]}</p>
              <p className="text-sm text-muted-foreground">
                {POR_QUE_IMPORTA[category][seniority]}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base text-foreground">
            O que pode te travar
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {diagnostico.atencao.map((category) => (
            <div key={category} className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">{CATEGORY_LABEL[category]}</p>
              <p className="text-sm text-muted-foreground">
                {POR_QUE_IMPORTA[category][seniority]}
              </p>
            </div>
          ))}

          {diagnostico.topicosParaRevisar.length > 0 && (
            <div className="flex flex-col gap-1 border-t border-border pt-3">
              <p className="text-xs font-medium text-muted-foreground">Vale revisitar</p>
              <p className="text-sm text-foreground">
                {diagnostico.topicosParaRevisar.join('; ')}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
