# Design System — Syntaxis Skill Check

> Documentação viva, criada no Épico 19 para incorporar o conteúdo
> permanente de `REDESIGN.md` (spec-mestra da migração de identidade,
> Épicos 14–19, removida da raiz neste commit — ver `GOLIVE.md` §"Go-Live
> do Redesign"). Este arquivo é o ponto de entrada para "como o design
> system funciona no código"; as fontes de verdade continuam sendo
> `DESIGN.md` (regras de marca) e `design/tokens.json` (valores).

## 1. Fonte de verdade

| O que                                                                   | Onde                       |
| ----------------------------------------------------------------------- | -------------------------- |
| Regras de marca (voz, paleta, tipografia, padrões, checklist editorial) | `DESIGN.md`                |
| Valores de token (cor, tipografia, espaçamento, padrão) — formato DTCG  | `design/tokens.json`       |
| CSS gerado a partir dos tokens (gitignored, `npm run generate:tokens`)  | `app/tokens.generated.css` |
| Tokens/catálogos substituídos (nunca apagados)                          | `design/archive/`          |

Nenhuma cor, fonte ou espaçamento é escrito como literal em componente —
tudo resolve para um token. `npm run lint:colors` (parte do `prebuild` e do
CI) falha o build se encontrar um hex/rgb/hsl fora de `design/tokens.json`
ou dos próprios arquivos de definição de token.

## 2. Como regenerar os tokens

```bash
npm run generate:tokens   # lê design/tokens.json, escreve app/tokens.generated.css
npm run audit:contrast    # recalcula design/contrast-report.md, falha se algum
                           # par semântico claro/escuro cair abaixo do AA sem
                           # substituto documentado em KNOWN_SUBSTITUTES
```

Ambos rodam automaticamente no `prebuild` — nunca é preciso lembrar de
rodá-los manualmente antes de `npm run build`, mas rodar `audit:contrast`
isoladamente é o jeito rápido de checar um token novo antes de abrir PR.
Detalhe de implementação (mapeamento tema claro/escuro → `:root`/`.dark`,
hover via `color-mix`, etc.) em `README.md` §"Tokens de design e tema".

## 3. Padrões geométricos

Três componentes React na pasta `@/components/patterns`, mas só dois são
"pattern" na classificação do `DESIGN.md` v3.0 §6 — `nodeBranch` e
`reticula` (`dataGrid` até o Épico 27, quando é renomeado). `growthLine`
foi reclassificada nesta sincronização: não é mais pattern de fundo, é
**marca de dado** — sempre a 100% de opacidade, nunca decorativa, sempre
ligada a uma conquista verificável (`DESIGN.md` §6, primeiro parágrafo).
A API de cada componente já era restrita antes desta reclassificação, e
continua sendo, para que a regra de uso seja garantida pelo compilador,
não por disciplina:

| Componente                                                         | Família               | Trava de API                                                                                                      |
| ------------------------------------------------------------------ | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `<PatternNodeBranch context="onText"\|"decorative" />`             | Nó-e-galho (primário) | opacidade sempre computada em JS a partir de `pattern.nodeBranch.*` — a prop não consegue escapar o range travado |
| `<PatternDataGrid slot="margin-left"\|"margin-right"\|"header" />` | Grade de dados        | só 3 slots fixos, sem posicionamento livre                                                                        |
| `<PatternGrowthLine steps={n} />`                                  | Linha de conquista    | sem prop de opacidade — é sempre protagonista                                                                     |

`npm run lint:patterns` (`scripts/lint-one-pattern-per-file.mjs`, parte do
`prebuild`) falha se um arquivo importar mais de um desses três de
`@/components/patterns` — "um padrão por peça" (DESIGN.md §6.5) é
verificável em CI, não uma convenção de PR review. A única exceção
documentada é o certificado (`components/result/ShareRadarButton.tsx`,
Épico 18): combina nó-e-galho + linha de conquista, mas desenha via Canvas
2D reaproveitando os geradores de geometria pura (`generateNodeBranchLayout`,
`generateGrowthLineLayout`) diretamente dos arquivos de lib, não dos
componentes React — por isso o lint (que só escaneia imports de
`@/components/patterns`) não o pega, e por isso essa é a única peça do
produto com dois padrões, prevista no `DESIGN.md` §6 (certificados).

Catálogo vivo com os três componentes (dois patterns + a marca de dado)
nos dois temas: `/dev/ui` (rota não indexada, base do teste visual
`e2e/dev-ui-catalog.spec.ts`).

## 4. Pipeline de assets generativos (agy)

Imagens ilustrativas (hero da landing, ilustrações de dimensão, fundos de
OG/certificado) são geradas via Nano Banana Pro através do `agy`
(Antigravity CLI), nunca desenhadas à mão nem geradas ad-hoc:

1. Prompt versionado em `assets/prompts/<slug>.md` (+ bloco de marca
   compartilhado em `assets/prompts/_brand-block.md`).
2. Geração via a skill `.agents/skills/gerar-asset-marca/SKILL.md`, saída
   bruta versionada em `assets/generated/raw/<slug>/<data>-vN.png`.
3. Gate de revisão humana contra o checklist de marca (`DESIGN.md` §10).
4. Publicação: `npm run assets:process -- <slug> --raw <path> --dark <hex>
--light <hex> --widths <n,n,...>` — aplica correção de cor por duotone
   (aderência de paleta garantida por construção), gera variantes
   AVIF/WebP, atualiza `assets/manifest.json`.
5. `npm run assets:verify-manifest` / `assets:verify-palette` (parte do
   `prebuild`) garantem que todo asset publicado tem origem rastreável, tem
   orçamento de peso (`weightBudgetKb`) respeitado, e nenhum pixel amostrado
   escapa da tolerância de paleta do duotone registrado.

Comandos e contrato completo em `README.md` §"Pipeline de assets
generativos". **Estado atual**: os 9 assets do lote inicial (hero da
landing, 3 ilustrações de dimensão, estado vazio, fundo OG, textura de
certificado claro/escuro) estão gerados, aprovados e publicados —
consumidos pelos Épicos 17 e 18. Duas dimensões (`matematica-quant`,
`dados-programacao`) ainda não têm ilustração aprovada e caem no ícone
Lucide de fallback em `components/result/DimensionScoreCards.tsx` até
serem geradas.

## 5. Logo / wordmark

**Lacuna aberta até o Épico 25** (`specs/epicos/epico-25-simbolo-oficial.md`):
o símbolo oficial já existe — `brand/LOGO/symbol-master.svg`, geometria
medida em `DESIGN.md` §6.1 — mas ainda não foi trazido para este app.
`components/logo.tsx` renderiza um wordmark tipográfico (`Syntaxis` em
Space Grotesk bold — sem itálico, DESIGN.md v3.0 §4.2 —, cor
`--link-foreground` — Forest no claro, Grove no escuro) como placeholder
funcional; `app/icon.svg` é um favicon geométrico placeholder pela mesma
razão. Esta seção será reescrita quando o Épico 25 substituir o
placeholder pelo símbolo real.

Mapa de uso já implementado e pronto para receber o asset real quando
chegar (convenção de `REDESIGN.md` §3.1, preservada aqui):

| Contexto            | Variante esperada              |
| ------------------- | ------------------------------ |
| Header, tema claro  | Forest (`logo-forest-*`)       |
| Header, tema escuro | Grove (`logo-grove-*`)         |
| Favicon             | 48px, fallback 8px             |
| OG/social           | 96px sobre superfície da marca |

Quando o asset chegar: substituir a implementação de `components/logo.tsx`
por `<img>`/`<Image>` apontando para `public/brand/logo-{forest,grove}-*`,
sem mudar a API do componente (`<Logo className? />`) — nenhum call site
precisa mudar.

## 6. Certificado / compartilhamento

Formato final do "certificado de conclusão" segue **em aberto para o
produto de curso** (PDF, badge digital, ou ambos — decisão fora do escopo
deste app e de `brand/DESIGN.md`, que não rastreia decisões de produto). O que existe hoje, implementado no
Épico 18, é o mini-certificado compartilhável do `/resultado`
(`components/result/ShareRadarButton.tsx`): um PNG gerado em Canvas 2D no
navegador, sem PII (ver teste de tipo em
`__tests__/share-radar-button.test.tsx`), combinando nó-e-galho (moldura)
e linha de conquista (progresso), radar em Grove fixo e a classificação do
resultado — serve de referência de composição para quando o certificado de
curso completo for especificado.

## 7. Evidência de go-live

Auditoria completa (Lighthouse 4 rotas × 2 temas, axe-core, cross-device,
checklist editorial `DESIGN.md` §10, orçamento de peso de assets) documentada
em `GOLIVE.md` §"Go-Live do Redesign (Épico 19)".
