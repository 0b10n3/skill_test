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

- [ ] Símbolo visível em toda página que renderiza `Logo`, cor correta por tema.
- [ ] Favicon é o símbolo, não o placeholder do Next.js.
- [ ] `lint:colors` verde com o SVG novo.
- [ ] `lint`, `typecheck`, `test`, `build`, `e2e` verdes.
- [ ] PR aberto contra `main`, nenhum commit direto.
