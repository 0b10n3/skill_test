# ÉPICO 32 — Troca de trio tipográfico

**Depende de:** Épico 31 (concluído, mergeado).

**Origem:** pedido direto do founder — ao configurar o Brand Kit nativo do Canva (paleta e
logos), não encontrou Space Grotesk, Hanken Grotesk nem Space Mono na biblioteca de fontes
dessa conta. Pediu um trio alternativo disponível no Canva **e** compatível com LaTeX
(pdfLaTeX), primeiro formalizado em `brand/` (`DESIGN.md` §4.2, `tokens.json` v2.6.0,
`REVOGACOES.md` H10) num commit anterior deste mesmo trabalho.

## Objetivo

Sincronizar `apps/skill_test` com a revogação já formalizada em `brand/`: o trio Space
Grotesk/Hanken Grotesk/Space Mono sai, Montserrat/Source Sans 3/IBM Plex Mono entra no lugar,
nos mesmos papéis (display/corpo/dados).

## Pesquisa prévia (antes de implementar)

Trio novo verificado em duas frentes, não escolhido por preferência estética:

- **Disponibilidade no Canva** — confirmada pelo founder ao configurar o Brand Kit.
- **Compatibilidade pdfLaTeX** — via pacotes CTAN reais: `montserrat` (OTF + Type1),
  `sourcesanspro`/`SourceSans` (Type1 + OTF), `plex` (não `plex-otf`, que é Xe/LuaLaTeX-only).
- **Cobertura de peso** — `typography.fontWeight` (light 300/regular 400/medium 500/bold 700)
  não muda; as três fontes novas cobrem essa escala sem reestruturação. Lato foi cogitado para
  o papel de corpo e descartado por faltar os pesos 500/600 que `heading2`/`heading3`/`label`
  exigem — verificado no `font-data.json` local do Next.js
  (`node_modules/next/dist/compiled/@next/font/dist/google/font-data.json`), não em memória.
- **Identificadores de export do `next/font/google`** confirmados por leitura direta de
  `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts`: `Montserrat`,
  `Source_Sans_3`, `IBM_Plex_Mono` — todos aceitam `subsets: ['latin']` e os pesos usados aqui
  como literais válidos do tipo.

## Escopo

- `app/layout.tsx`: `Space_Grotesk`/`Hanken_Grotesk`/`Space_Mono` → `Montserrat`/
  `Source_Sans_3`/`IBM_Plex_Mono` (mesma estrutura de `variable`/`subsets`/`weight`/`display`/
  `fallback` por papel).
- `app/globals.css`: mapeamento `--font-display`/`--font-heading`/`--font-sans`/`--font-mono`/
  `--font-data` para as novas variáveis CSS.
- `app/opengraph-image.tsx`: `loadGoogleFont` (mecanismo independente do `next/font`, próprio
  do `next/og`) chamado com `'Montserrat'`/`'Source Sans 3'`; `fontFamily` inline e array
  `fonts:` atualizados.
- `components/result/ShareRadarButton.tsx`: 3 strings `ctx.font` (Canvas 2D) atualizadas.
- `scripts/check-tokens-breaking.mjs`: `typography.fontFamily.data` adicionado à allowlist de
  troca permitida — Space Mono tinha sido **mantida** na v2.0.0 (única fonte do trio antigo que
  sobreviveu àquele bump maior), então essa é a primeira vez que o campo `data` muda de valor
  desde o baseline v1.2.0 contra o qual o script compara.
  `DESIGN.md`/`design/tokens.json` sincronizados byte a byte com `brand/` (v2.6.0).
- Comentários stale corrigidos (`components/logo.tsx`, `components/landing/
  DimensionsSection.tsx`, `docs/design-system.md`) — a nota "sem itálico porque Space Grotesk
  não tem variante itálica" deixa de ser verdade como fato de fonte (Montserrat tem itálico);
  reescrita como regra de marca (sem itálico como ênfase, DESIGN.md §4.2), não como limitação
  técnica.
- Passe de consistência em menções de comentário/teste sem lógica associada (`components/ui/
  eyebrow.tsx`, `content/landing.ts`, `components/landing/StatsStripSection.tsx`,
  `components/result/AnswerReview.tsx`, `__tests__/cn-typography-scale.test.ts`, `__tests__/
  dimension-score-cards.test.tsx`, `__tests__/answer-review.test.tsx`, `app/dev/ui/page.tsx`).

Fora de escopo, deliberado: `specs/epicos/epico-02-design-system.md`, `specs/epicos/
epico-24-sincronizacao-marca-v3.md`, `specs/prompt-syntaxis-skill-check.md`, `GOLIVE.md`,
`design/archive/README.md` (registro histórico) e `specs/tokens.json` (artefato de spec antigo,
schema próprio e já divergente do SSOT vivo antes deste épico — `body: Inter`, `mono:
JetBrains Mono` — desconectado de `design/tokens.json`).

## Achados durante a implementação

- **`check-tokens-breaking.mjs` falhou genuinamente** na primeira rodada de `npm run test`: o
  script compara `design/archive/tokens-v1.2.0.json` (baseline congelado pré-Épico-22) contra o
  `design/tokens.json` atual, e só permite que um valor pré-existente mude se o path constar
  numa allowlist documentada. `typography.fontFamily.data` nunca tinha mudado de valor desde
  aquele baseline (Space Mono sobreviveu ao bump maior da v2.0.0 intacta), então não estava na
  lista — o script pegou isso como esperado ("é exatamente o mecanismo que pegou... o
  tokens.json v2.0.0 bruto do founder"). Corrigido adicionando o path à allowlist, com
  referência ao changelog v2.6.0/REVOGACOES.md H10 que documenta a mudança como legítima.
- **15 snapshots visuais do Playwright quebraram** (`dev-ui-catalog`, `funnel-visual`,
  `resultado-visual`, em ambos os temas e larguras) — esperado: troca de família muda métricas
  de fonte (largura/altura de linha) em quase toda tela, alterando a altura total da página em
  `fullPage: true`. Cada diff foi inspecionado (screenshot "actual" isolado, não só o overlay de
  diff, que é ilegível por natureza numa troca de fonte) antes de `--update-snapshots` — layout,
  wrapping e legibilidade confirmados corretos com o trio novo, nenhuma quebra real.

## Critérios de aceite

- Dado `apps/skill_test/DESIGN.md`/`design/tokens.json`, quando comparados a `brand/`, então
  são byte a byte idênticos (v2.6.0).
- Dado qualquer tela do funil (`/`, `/quiz`, `/lead`, `/resultado`, `/dev/ui`), quando
  carregada, então título/heading renderiza em Montserrat, corpo em Source Sans 3, dado/código
  em IBM Plex Mono — sem fallback (verificado visualmente, não só por token).
- Dado `/opengraph-image`, quando gerada, então usa Montserrat (bold) e Source Sans 3
  (regular).
- Dado o card compartilhável de resultado (`ShareRadarButton`), quando gerado, então o Canvas
  2D usa os três nomes de família novos.
- Dado `node scripts/check-tokens-breaking.mjs`, quando rodado, então passa com o novo diff de
  `typography.fontFamily.data` explicitamente documentado na allowlist.

## Testes obrigatórios

- `npm run format`, `npm run lint`, `npm run typecheck`, `npm run test` limpos.
- `npm run build` limpo (inclui geração estática de `/opengraph-image`, que depende de fetch
  real ao Google Fonts em build time).
- `npx playwright test` completo, com snapshots atualizados e revisados individualmente antes
  do `--update-snapshots` — não aceitos em massa sem inspeção.
- `npm run test:lighthouse:flow` nos dois temas.

## Gate de validação

- [x] Trio novo aplicado em `app/layout.tsx`, `app/globals.css`, `app/opengraph-image.tsx`,
      `ShareRadarButton.tsx`.
- [x] `DESIGN.md`/`tokens.json` sincronizados byte a byte com `brand/` v2.6.0.
- [x] `scripts/check-tokens-breaking.mjs` atualizado e verde.
- [x] `lint`, `typecheck`, `test` (192/192), `build`, `e2e` (81/81), `lighthouse:flow` verdes.
- [x] Verificação visual manual dos diffs de screenshot antes de aceitar (não só o gate
      automatizado).
- [ ] PR aberto contra `main`, nenhum commit direto.

## Pendências fora deste épico

- O Brand Template do Canva (`Syntaxis — Brand Reference Board`, seção "TIPOGRAFIA") ainda cita
  o trio antigo — atualizar exige recriar o template (`create-brand-template-draft` → editar →
  `publish-brand-template`), decisão separada a confirmar com o founder.
- O founder precisa adicionar Montserrat/Source Sans 3/IBM Plex Mono no painel de fontes do
  Brand Kit nativo do Canva manualmente — não existe ferramenta de escrita para isso via MCP.
