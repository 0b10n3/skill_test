import { Eyebrow } from '@/components/ui/eyebrow';
import { MiniRadarTile } from '@/components/landing/evidence/MiniRadarTile';
import { CATEGORY_LABEL } from '@/content/relatorio';
import {
  countBankItemsByCategory,
  getEvidenceExplanation,
  getEvidenceQuestion,
} from '@/lib/landing-evidence';

const quantQuestion = getEvidenceQuestion('q16');
const dadosQuestion = getEvidenceQuestion('q25');
const iaExplanation = getEvidenceExplanation('q34');
const riscoBankCount = countBankItemsByCategory('risco-regulacao');

function TileShell({
  category,
  className,
  children,
}: {
  category: keyof typeof CATEGORY_LABEL;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-none border border-border bg-card p-5 sm:p-6 ${className ?? ''}`}
    >
      <p className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
        {CATEGORY_LABEL[category]}
      </p>
      {children}
    </div>
  );
}

/**
 * Seção "o que o diagnóstico avalia" (Épico 17, redesign Épico 20 —
 * DESIGN.md v1.1 §4.4.6): grid bento assimétrico onde cada dimensão mostra
 * prova real do produto — mini-radar renderizado, uma questão real do banco
 * (com alternativas, sem gabarito), um trecho real de `explanation`, e um
 * número real do blueprint do banco — nunca ícone+título+parágrafo
 * uniforme (anti-padrão §4.5). O grid de 4 colunas com um tile em
 * col-span-2/row-span-2 e os demais col-span-2/row-span-1 produz o
 * escalonamento assimétrico só com a ordem natural do CSS grid
 * (auto-flow), sem posicionamento manual por breakpoint.
 */
export function DimensionsSection() {
  return (
    <section className="relative flex w-full flex-col gap-6 px-6 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
        <Eyebrow>O que avaliamos</Eyebrow>
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">
          O que o diagnóstico avalia
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          15 questões, 3 por dimensão, calibradas para a expectativa do seu nível declarado — a
          prova é o próprio conteúdo do banco, não uma promessa em prosa.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-4 sm:[grid-auto-rows:minmax(200px,auto)]">
        <TileShell
          category="mercados-produtos"
          className="items-center sm:col-span-2 sm:row-span-2"
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <MiniRadarTile highlight="mercados-produtos" />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            O radar de competências que você recebe no relatório final — formato ilustrativo, o seu
            vem das suas respostas.
          </p>
        </TileShell>

        <TileShell category="matematica-quant" className="sm:col-span-2">
          <p className="font-display text-sm text-foreground">{quantQuestion.question}</p>
          <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            {quantQuestion.options.map((option) => (
              <li key={option.id} className="flex gap-2">
                <span className="font-data text-grove-700 dark:text-grove-300">{option.id})</span>
                <span>{option.text}</span>
              </li>
            ))}
          </ul>
        </TileShell>

        <TileShell category="dados-programacao" className="sm:col-span-2">
          <p className="text-sm text-foreground">{dadosQuestion.question}</p>
          <ul className="flex flex-col gap-1.5 font-data text-xs text-muted-foreground">
            {dadosQuestion.options.map((option) => (
              <li key={option.id} className="rounded-sm bg-muted px-2 py-1 text-foreground">
                {option.text}
              </li>
            ))}
          </ul>
        </TileShell>

        <TileShell category="ia-aplicada" className="sm:col-span-2">
          {/* v2.0.0: sem itálico como ênfase (regra de marca, ver DESIGN.md
              §4.2) — a citação se marca por uma hairline lateral (assinatura
              §4.4.3), não por estilo de fonte. */}
          <p className="border-l-2 border-border pl-3 font-display text-sm text-pretty text-foreground">
            &ldquo;{iaExplanation}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">
            Trecho real do gabarito comentado que acompanha o seu resultado.
          </p>
        </TileShell>

        <TileShell category="risco-regulacao" className="items-center justify-center sm:col-span-2">
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="text-stat-number text-foreground">{riscoBankCount}</span>
            <p className="text-center text-xs text-muted-foreground">
              questões no banco de risco &amp; regulação — 3 caem no seu diagnóstico
            </p>
          </div>
        </TileShell>
      </div>
    </section>
  );
}
