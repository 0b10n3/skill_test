import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { ATENCAO_VAZIO, CATEGORY_LABEL, FORTES_VAZIO, POR_QUE_IMPORTA } from '@/content/relatorio';
import type { Diagnostico, DimensionEtiqueta } from '@/lib/diagnostico';
import type { KnowledgeCategory, SeniorityLevel } from '@/lib/types';

interface StrengthsAndFocusProps {
  diagnostico: Diagnostico;
  seniority: SeniorityLevel;
}

/**
 * O motor sempre devolve ao menos uma dimensão em `fortes` e em `atencao`, mesmo quando
 * nenhuma cruza o limiar (cai no topo do ranking). Aqui só entra quem tem a etiqueta de
 * fato — senão 0/3 aparecia como destaque e 3/3 como o que trava (Épico 43).
 */
function comEtiqueta(
  diagnostico: Diagnostico,
  categorias: KnowledgeCategory[],
  etiqueta: DimensionEtiqueta,
): KnowledgeCategory[] {
  return categorias.filter(
    (category) => diagnostico.dimensoes.find((d) => d.category === category)?.etiqueta === etiqueta,
  );
}

function ListaDimensoes({
  categorias,
  seniority,
  vazio,
}: {
  categorias: KnowledgeCategory[];
  seniority: SeniorityLevel;
  vazio: string;
}) {
  if (categorias.length === 0) {
    return <p className="text-sm text-muted-foreground">{vazio}</p>;
  }
  return (
    <>
      {categorias.map((category) => (
        <div key={category} className="flex flex-col gap-1">
          <p className="text-sm font-medium text-foreground">{CATEGORY_LABEL[category]}</p>
          <p className="text-sm text-muted-foreground">{POR_QUE_IMPORTA[category][seniority]}</p>
        </div>
      ))}
    </>
  );
}

export function StrengthsAndFocus({ diagnostico, seniority }: StrengthsAndFocusProps) {
  const fortes = comEtiqueta(diagnostico, diagnostico.fortes, 'forte');
  const atencao = comEtiqueta(diagnostico, diagnostico.atencao, 'atencao');

  return (
    <section aria-labelledby="strengths-focus-heading" className="flex w-full flex-col gap-3">
      <h2 id="strengths-focus-heading" className="sr-only">
        Pontos fortes e pontos de atenção
      </h2>
      <Eyebrow>Fortes e atenção</Eyebrow>

      <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground">
              O que te destaca
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ListaDimensoes categorias={fortes} seniority={seniority} vazio={FORTES_VAZIO} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base text-foreground">
              O que pode te travar
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ListaDimensoes categorias={atencao} seniority={seniority} vazio={ATENCAO_VAZIO} />

            {diagnostico.topicosParaRevisar.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                <p className="text-xs font-medium text-muted-foreground">Vale revisitar</p>
                <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-foreground">
                  {diagnostico.topicosParaRevisar.map((topico) => (
                    <li key={topico}>{topico}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
