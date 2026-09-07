# ÉPICO 34 — Padronização de ícones em "Desempenho por dimensão" e remoção do padrão de escada em "Prioridades"

**Depende de:** nenhum épico específico. Independente do Épico 33 (`check-brand-sync.mjs`),
em paralelo com ele.

**Origem:** dois achados visuais reportados diretamente pelo founder na página de resultado
(`/resultado`).

## Problema 1 — ícones de "Desempenho por dimensão" não padronizados

`DimensionScoreCards.tsx` misturava dois tratamentos de ícone no cabeçalho do card: 3 das 5
dimensões (`mercados-produtos`, `ia-aplicada`, `risco-regulacao`) mostravam uma ilustração
gerada de 24px (`GeneratedImage` + `DIMENSAO_ASSET_SLUG`); as outras 2
(`matematica-quant`, `dados-programacao`) caíam para um ícone Lucide de linha (`Sigma`,
`Database`), porque nunca tiveram uma ilustração aprovada.

**Investigação:** as duas ilustrações faltantes têm uma geração v1 de 11/08/2026
(`assets/generated/raw/dimensao-{matematica-quant,dados-programacao}/2026-08-11-v1.png`),
travada em `decision: pending` havia quase um mês. Inspecionadas nesta sessão: as duas têm
pontos de acento laranja/lime fora de contexto (o "achado de cor de conquista", PR #20 citado
no código) e, mais importante, usam a gramática livre de ângulo do pattern nó-e-galho antigo
(nós circulares, ramos em ângulo livre) — a mesma gramática que o Épico 31 já revogou no
sistema de patterns (H9, `pattern.nodeBranch` → `pattern.mesh`). Completá-las exigiria gerar
peças novas do zero, não aprovar as pendentes.

**Decisão do founder:** reverter as 5 dimensões para ícone Lucide — tratamento único, sem
depender de geração de imagem. `DIMENSAO_ASSET_SLUG` (`content/landing.ts`) ficou sem
consumidor em todo o app — a "landing (seção 'o que avaliamos')" citada no frontmatter dos
prompts nunca foi construída — e o founder confirmou apagar em vez de reaproveitar: os 5
conjuntos completos (3 aprovados + 2 pendentes) foram removidos num commit à parte — prompts,
gerações raw, arquivos publicados e as 3 entradas correspondentes em `assets/manifest.json`.
`assets:verify-manifest`/`assets:verify-palette` seguem verdes (8 assets restantes, nenhum
órfão).
Decisão sobre reaproveitar os 3 assets ali (ou apagá-los) é separada, fora deste épico.

## Problema 2 — padrão de escada (`PatternGrowthLine`) na seção "Prioridades"

`PriorityCareerSkills.tsx` renderizava `<PatternGrowthLine steps={3} />` logo abaixo do título
da seção — um elemento gráfico em forma de escada (a "linha de conquista"). O código
justificava isso como "protagonista, nunca decoração" (`DESIGN.md` §5.2/§5.4), mas o founder
identificou visualmente como um padrão indesejado na composição e pediu a remoção.

**Consequência para `brand/DESIGN.md`:** o documento (§6) citava `PriorityCareerSkills.tsx`
como "o uso real em produção" de `growthLine`. Isso deixa de ser verdade com este épico. A
citação foi corrigida no monorepo para `ShareRadarButton.tsx` (card compartilhável, canvas) —
usuário real e já existente do mesmo primitivo (`generateGrowthLineLayout`), que é de fato a
peça que a linha "Certificado" da matriz §6.4 descreve. `PatternGrowthLine.tsx` (o componente
React) não foi apagado — continua em `app/dev/ui/page.tsx` (vitrine de componentes) e coberto
por `__tests__/pattern-components.test.tsx`.

## Escopo

- `components/result/DimensionScoreCards.tsx`: remove a ramificação `illustrationSlug ? … : …`,
  sempre renderiza `Icon`. Remove imports agora não usados (`GeneratedImage`,
  `DIMENSAO_ASSET_SLUG`). Comentário reescrito para não citar mais o Épico 16 como pendência —
  a decisão agora é definitiva, não um estado transitório.
- `components/result/PriorityCareerSkills.tsx`: remove `<PatternGrowthLine>` e o comentário que
  a justificava. Remove o import de `PatternGrowthLine`.
- `brand/DESIGN.md` §6 (monorepo): corrige a citação de uso real de `growthLine`.

**Fora de escopo, deliberadamente:**

- Qualquer mudança em `PatternGrowthLine.tsx`, `ShareRadarButton.tsx` ou o gerador de layout —
  o primitivo continua igual, só um consumidor a menos.
- `DIMENSAO_LANDING_DESCRICAO` (`content/landing.ts`) — achado colateral, também sem consumidor
  (a mesma seção de landing nunca construída), mas não citado na decisão do founder; fica como
  achado registrado, não apagado nesta rodada.
- Regenerar `matematica-quant`/`dados-programacao` — descartado explicitamente pelo founder
  nesta decisão.

## Critérios de aceite

- `/resultado`: as 5 dimensões mostram o mesmo tratamento visual de ícone (Lucide, `size-4`,
  `text-muted-foreground`) — nenhuma mostra ilustração.
- `/resultado`, seção Prioridades: nenhum elemento gráfico de escada/linha de conquista abaixo
  do título — só o texto e os cards.
- `npm test`, `npm run lint`, `npm run typecheck` limpos.
- `brand/DESIGN.md` §6 não cita mais `PriorityCareerSkills.tsx` como consumidor de `growthLine`.

## Verificação visual

Confirmado via Playwright (`chromium`, headless) dirigindo o fluxo real `/quiz` → `/lead` →
`/resultado` e capturando as duas seções — antes (achado) e depois (correção) da mudança.
