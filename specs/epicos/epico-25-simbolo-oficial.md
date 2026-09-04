# ÉPICO 25 — Símbolo oficial substitui o wordmark placeholder

**Depende de:** Épico 24 (tokens/DESIGN.md sincronizados).

**Origem:** `components/logo.tsx` é, desde o Épico 14, um placeholder textual explícito —
"nenhum arquivo de imagem da marca foi recebido nesta sessão" (comentário no próprio arquivo,
citando `DESIGN.md` §8 lacuna #1). O arquivo existe agora: `brand/LOGO/symbol-master.svg`,
com geometria medida (módulo M≈40,24u, diagonal 45,00°, quarto de arco raio 38,92u —
`brand/DESIGN.md` §6.1).

## Objetivo

Trazer o símbolo oficial para o app e substituir o wordmark tipográfico por ele, fechando a
lacuna aberta desde o Épico 14.

## Escopo

- Copiar `brand/LOGO/symbol-master.svg` (variante Forest) e `symbol-master-lime.svg` para
  `public/brand/` do app, seguindo a convenção de nomes que `docs/design-system.md` §5 já
  declara.
- Reescrever `components/logo.tsx`: renderiza o símbolo inline (SVG importado como componente,
  não `<img>`, para permitir recolorir por CSS/`fill` sem duplicar arquivo por tema) mais o
  wordmark "Syntaxis" ao lado, mantendo a variante por tema já resolvida em CSS puro
  (`text-link-foreground` → Forest-500 no light, Grove-500 no dark) — a cor do wordmark não
  muda; o que muda é o símbolo deixar de ser ausente.
- Cor do símbolo por tema: Forest no light, Lime no dark — mesma lógica de contraste que
  `brand/syntaxis-brand-kit.html` usa nos dois cards de variação (Forest sobre Ivory/claro,
  Lime sobre Ink/escuro).
- Favicon: gerar a partir do mesmo master, nos tamanhos que `app/` já espera
  (`app/icon.*`/`app/favicon.ico`, conforme a convenção do Next.js App Router usada neste
  projeto).

**Fora de escopo, deliberadamente:**
- Qualquer variação de logo além do símbolo + wordmark simples (banner, lockup horizontal) —
  não há consumidor no app hoje.
- Animação ou interação no símbolo — é elemento de identidade estático.

## Critérios de aceite

- Dado qualquer página do app, quando o `Logo` é renderizado, então o símbolo aparece ao lado
  do wordmark, na cor correta para o tema ativo.
- Dado o favicon do navegador, quando a aba é aberta, então mostra o símbolo, não o ícone
  default do Next.js (achado T10 do ledger de marca: "o favicon.ico default do Next em
  produção desde o scaffold" já foi um erro real numa rodada anterior — confirmar que não se
  repete aqui).
- Dado `npm run lint:colors`, quando rodado, então nenhuma cor fora do token entra pelo SVG
  novo (o `fill` do símbolo precisa ser um `$value` de `tokens.json`, mesma regra de
  `check-palette.mjs` em `brand/`).

## Testes obrigatórios

- `npm run lint`, `npm run typecheck` limpos.
- `npm run test` — suíte completa; se existir teste de snapshot do `Logo`, atualizar
  deliberadamente (não regenerar às cegas).
- `npm run build` completo, incluindo `prebuild` (`lint:colors` cobre o SVG novo).
- `npx playwright test e2e/dev-ui-catalog.spec.ts` — confirma visualmente logo + favicon nos
  dois temas.

## Gate de validação

- [x] Símbolo visível em toda página que renderiza `Logo` (`ReportHeader.tsx`, o único
      consumidor), cor correta por tema — confirmado por screenshot real via Playwright, nos
      dois temas, contra `/resultado` com dados reais de quiz.
- [x] Favicon é o símbolo, não o placeholder do Next.js — `app/favicon.ico` regenerado
      (rasterizado de `app/icon.svg` via Chromium headless + Pillow, 16px/32px), confirmado
      visualmente.
- [x] `lint:colors` verde com o SVG novo (usa `currentColor`, não hex — nem precisa entrar no
      escopo do linter).
- [x] `lint`, `typecheck`, `test` (189/189), `build` (prebuild completo) verdes.
- [x] `npx playwright test e2e/dev-ui-catalog.spec.ts` — 7/7 verdes, incluindo os dois
      snapshots visuais por tema e as duas checagens axe-core.
- [x] PR aberto contra `main`, empilhado sobre o Épico 24.

## Achado fora do escopo deste épico, registrado para não se perder

`npx playwright test e2e/resultado-visual.spec.ts` (não listado nos testes obrigatórios deste
épico — só citei `dev-ui-catalog.spec.ts`, e por isso corri o primeiro por precaução extra,
não por exigência) reprovou em 2 dos 6 casos, e a causa **não é o símbolo novo**: as baselines
de `resultado-baixo-{light,dark}.png` estão capturadas com tipografia serifada (DM Serif
Display) e cantos arredondados — o sistema visual de **antes do Épico 22** (Design v2.0,
cantos retos + Space Grotesk). O app ao vivo já renderiza corretamente o sistema atual (confirmado
visualmente); é a *baseline salva* que nunca foi regenerada desde então. Como as demais
4 combinações passaram, a suíte não está travando builds — mas a cobertura de regressão visual
de `/resultado` está cega para qualquer mudança de marca há pelo menos três épicos. Não
corrigido aqui (fora do escopo declarado de `epico-25`, e mexer nas baselines de um teste que
não é meu para arrumar é o tipo de correção "de passagem" que merece o próprio épico, com
revisão deliberada de cada snapshot novo — não um `--update-snapshots` cego). Recomendo um
épico dedicado, antes do Épico 28 (QA/go-live), para não deixar a lacuna se acumular mais.
