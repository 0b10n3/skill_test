# ÉPICO 23 — Transições explícitas em `components/ui/*`

**Depende de:** Épico 22 (Design v2.0) concluído — este épico corrige um achado de craft de
interação sobre o sistema visual já entregue, não muda nenhum token de cor/tipografia/radius.

**Origem:** achado da skill `emil-design-eng` (instalada em `brand/.claude/skills/`),
aplicada em `brand/BRAND_REVIEW.md` §4 a `components/ui/button.tsx`. Escopo ampliado nesta
especificação depois de confirmar, por `grep`, que o mesmo padrão existe em mais três
primitivos de UI (`progress.tsx`, `badge.tsx`, `accordion.tsx`).

## Objetivo

Eliminar `transition-all` dos componentes primitivos de UI, substituindo por listas
explícitas de propriedade — o erro nº 1 da checklist de revisão da skill `emil-design-eng`:
`transition: all` anima propriedades que não deveriam mudar junto (ex.: `border-color`
mudando durante uma transição pensada só para `background-color`), e é mais caro para o
navegador computar sem nenhum ganho perceptível.

## Escopo

Nos quatro arquivos onde `transition-all` aparece hoje em `components/ui/`:

- `button.tsx` — anima `background-color` (hover de variantes) e `transform` (feedback de
  `:active`). Passa a `transition-[background-color,transform]`.
- `progress.tsx` — anima `width` (preenchimento da barra). Passa a `transition-[width]`.
- `badge.tsx` — só muda aparência em `focus-visible` (borda/ring). Passa a
  `transition-colors` (utilitário Tailwind, cobre `color`/`background-color`/`border-color`).
- `accordion.tsx` — trigger com `hover:underline` e mudanças de borda/ring em
  `focus-visible`. Passa a `transition-colors`.

**Fora de escopo, deliberadamente:**
- Trocar `translate-y-px` por `scale(0.97)` no `:active` do botão — a
  `BRAND_REVIEW.md` §4 registra isso como "vale um teste A/B visual", não uma correção
  obrigatória. Não faz parte deste épico.
- Declarar a curva de easing customizada (`motion.easing.standard` do `tokens.json`) nos
  quatro componentes — é uma melhoria de acabamento adicional, não a correção do anti-padrão
  em si. Fica como recomendação separada, não bloqueia este épico.
- Qualquer componente fora de `components/ui/` (nenhuma outra ocorrência de `transition-all`
  foi encontrada em `components/`, `app/` ou `lib/` no momento desta especificação).

## Critérios de aceite

- Dado qualquer arquivo em `components/ui/`, quando eu busco por `transition-all`, então
  nenhuma ocorrência é encontrada.
- Dado o botão primário/secundário, quando o mouse passa por cima ou o elemento recebe
  `:active`, então a transição visual (cor de fundo, escala/posição) continua idêntica ao
  comportamento atual — a correção troca a declaração de propriedades, não o efeito visível.
- Dado o catálogo `/dev/ui` (light e dark, 375px e 1440px), quando comparado ao snapshot
  anterior a este épico, então nenhuma diferença visual é introduzida (a mudança é de
  `transition-property`, não de valor final renderizado em estado estático).

## Testes obrigatórios

- `npm run lint` e `npm run typecheck` limpos.
- `npm run test` (Vitest) — suíte completa, sem regressão.
- `npm run build` — build de produção completo, incluindo os gates de `prebuild`
  (`lint:colors`, `audit:contrast`, `lint:patterns`, `check:tokens-additive`,
  `assets:verify-manifest`, `assets:verify-palette`).
- `npx playwright test e2e/dev-ui-catalog.spec.ts` (screenshots de `/dev/ui` + axe-core) —
  confirma visualmente que nenhuma renderização estática mudou.

## Gate de validação

- [x] Zero ocorrências de `transition-all` em `components/ui/` (confirmado por `grep`).
- [x] `lint`, `typecheck`, `test` (189/189), `build` (com todos os gates de `prebuild`) verdes.
- [x] `e2e/dev-ui-catalog.spec.ts` verde — 7/7 testes, incluindo os 4 snapshots visuais
      (light/dark × 375px/1440px) sem diff e as 2 checagens axe-core sem violação crítica.
- [x] PR aberto contra `main` (`epico-23-transicao-explicita`), nenhum commit direto.

## Boas práticas aplicadas

Escopo da correção verificado por `grep` antes de escrever a especificação, não assumido —
encontrou 3 ocorrências além da que motivou o épico, e todas entraram no escopo em vez de
ficarem como "lacuna conhecida" não endereçada. Nenhuma mudança de comportamento visual é
esperada; os testes de screenshot existentes (`dev-ui-catalog`) servem como a evidência disso,
não uma alegação sem verificação.
