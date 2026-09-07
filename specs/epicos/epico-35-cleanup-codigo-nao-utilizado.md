# ÉPICO 35 — Cleanup de código não utilizado

**Depende de:** nenhum. Independente dos Épicos 33/34 (ainda em PR aberto).

**Origem:** pedido direto do founder — varrer `apps/skill_test` inteiro por código morto e
remover.

## Método

Rodado `npx --yes knip@latest` (sem adicionar como devDependency — uso pontual) na raiz do
app. Knip cobre três categorias: dependências não usadas, exports não usados, tipos exportados
não usados. **Zero arquivos órfãos** — todo arquivo do repositório é alcançado por algum
import.

Cada achado foi verificado manualmente antes de decidir apagar — a saída bruta do knip mistura
código morto de verdade com falsos positivos estruturais (primitivos gerados pelo shadcn,
schemas usados só internamente ao próprio arquivo). Apagar sem essa checagem quebraria o
contrato de componente do shadcn e removeria lógica viva.

## Achados — apagados (4)

| # | Item | Onde | Por que é morto de verdade |
| --- | --- | --- | --- |
| 1 | `DIMENSAO_LANDING_DESCRICAO` | `content/landing.ts` | Zero consumidor — a seção de landing "o que o diagnóstico avalia" (Épico 17) que a usaria nunca foi construída. Mesmo achado do Épico 34 para `DIMENSAO_ASSET_SLUG`, registrado lá como "fora de escopo" — fechado aqui |
| 2 | `export { CAREER_IMPACT_WEIGHT } from './career-impact-weights'` | `lib/diagnostico/index.ts` | Reexport de barrel redundante — o único consumidor real (`compute-diagnostico.ts`) importa direto de `./career-impact-weights`, nunca do barrel. A constante em si continua viva; só a linha do barrel morre |
| 3 | `serializePromptFile` | `scripts/lib/prompt-frontmatter.mjs` | Zero chamador em todo o repositório (busca ampla, não só `scripts/`) e zero teste. A função irmã, `parsePromptFile`, é a única metade do par realmente usada (`process-asset.mjs`) |
| 4 | `LeadInput`, `SubmitPayload`, `ResendReportPayload` | `lib/validations.ts` | Os três são só `z.infer<typeof schema>` — nenhum é importado por nome em lugar nenhum. Os schemas em si (`leadSchema`, `submitPayloadSchema`, `resendReportSchema`) continuam exportados e usados normalmente; só o alias de tipo redundante morre |

## Achados — não apagados, com motivo (falso positivo do knip)

| Item | Onde | Por que fica |
| --- | --- | --- |
| `eslint-config-next`, `eslint-config-prettier` | `package.json` devDependencies | Usados via `FlatCompat.extends('next/core-web-vitals', 'next/typescript', 'prettier')` em `eslint.config.mjs` — resolução de string em runtime, knip não rastreia |
| `shadcn` | `package.json` devDependencies | CLI do gerador de componentes (`components.json` presente) — usado via `npx shadcn add`, nunca importado estaticamente |
| `badgeVariants`, `buttonVariants`, `CardFooter`, `CardAction`, `DialogClose`, `DialogFooter`, `DialogOverlay`, `DialogPortal`, `ProgressTrack`, `ProgressIndicator` | `components/ui/*.tsx` | Sub-partes geradas pelo shadcn — contrato completo do primitivo, não resíduo desta app. Apagar quebra `shadcn diff`/atualização futura e reduz a reusabilidade que o padrão shadcn existe para dar |
| `questionSchema`, `questionsBankSchema` | `lib/questions-schema.ts` | Usados internamente no próprio arquivo (a função exportada que os envolve é o único ponto de entrada real) — lógica viva, só a exportação individual é redundante |
| `relativeLuminance` | `scripts/lib/contrast.mjs` | Usada internamente no mesmo arquivo por outra função exportada |
| `PALETTE_TOLERANCE`, `MIN_MATCH_RATIO` | `scripts/lib/palette.mjs` | Idem — parâmetros default de funções exportadas e usadas no mesmo arquivo |
| `PatternMeshProps`, `PatternReticulaProps`, `PatternReticulaSlot`, `PatternGrowthLineProps`, `GradientAmbientProps`, `GradientAmbientTone`, `GradientAmbientCorner` | `components/patterns/*` | Tipos de prop de um conjunto de componentes de sistema de design — API pública do pacote de patterns, convenção de exportar mesmo sem consumidor externo hoje |
| `QuestionType`, `Category`, `Difficulty`, `CognitiveLevel` | `lib/types.ts` | Usados internamente no mesmo arquivo para compor `Question`/`KnowledgeCategory` (este sim, consumido em toda a app) — vocabulário de domínio, não código morto |

## Achado adicional, surgido no merge com `main`

Ao atualizar esta branch com `main` (que já trazia os Épicos 33 e 34 mergeados), `knip`
apontou um quinto item: `GeneratedImage` (`components/generated-image.tsx`) — a própria
documentação da função já dizia "asset sem variante de tema (ex.: ilustrações de dimensão)".
O Épico 34 removeu o único consumidor (`DimensionScoreCards.tsx`) ao reverter para ícone
Lucide; `ThemedGeneratedImage` (usado por `HeroSection.tsx`) é independente e não depende de
`GeneratedImage`. Removida a função; `GeneratedPicture` (helper interno que as duas
compartilhavam) continua servindo `ThemedGeneratedImage`.

## Escopo

- `content/landing.ts`
- `lib/diagnostico/index.ts`
- `scripts/lib/prompt-frontmatter.mjs`
- `lib/validations.ts`
- `components/generated-image.tsx` (achado pós-merge, ver acima)

**Fora de escopo, deliberadamente:** todo item da segunda tabela — remover exigiria uma decisão
de arquitetura (parar de seguir a convenção do shadcn, restringir a visibilidade de tipos de
domínio), não é limpeza de resíduo.

## Critérios de aceite

- `npx knip` não lista mais os 4 itens apagados (roda de novo depois da mudança para
  confirmar).
- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` (com `prebuild` inteiro)
  verdes.
