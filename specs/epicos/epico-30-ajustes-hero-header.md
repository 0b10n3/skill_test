# ÉPICO 30 — Contraste do hero no escuro, proporção da foto, header sólido

**Depende de:** Épico 29 (concluído, mergeado, PR #41).

**Origem:** print anexado pelo founder após aprovar `hero-landing-pessoas` v1, três ajustes sobre
o resultado em produção:

1. Contraste ruim da imagem no tema escuro.
2. Imagem deveria ter proporção mais vertical, para se ajustar melhor à hero section.
3. Header (logo) com fundo transparente, sobrepondo texto ao rolar a página.

## Objetivo

Corrigir os três pontos sem reabrir escopo além deles — mesma foto (mesma pessoa, mesmo
conceito), mesmo header (mesma composição símbolo + wordmark), só os ajustes pedidos.

## Diagnóstico

### 1. Contraste no escuro — bug real, não ajuste de gosto

`assets/manifest.json` mostra o par de duotone publicado para a variante escura de
`hero-landing-pessoas`:

```json
"dark": { "dark": "#1B6A45", "light": "#141414" }
```

Isso está invertido e usa um hex que não é token nenhum. O padrão estabelecido no resto do
pipeline para duotone em tema escuro (`hero-landing` dark, `radar-card-textura` dark) é:

```json
"dark": { "dark": "#00120A", "light": "#2D9E67" }
```

`#00120A` é `color.theme.dark.background` (`design/tokens.json:282`) — pixels escuros da foto
mapeiam pro mesmo tom do fundo da página, então sombra "some" no fundo por design. `#2D9E67`
(Grove) é o tom claro — pixels claros da foto (luz de janela, tela do laptop) ficam visíveis por
cima do fundo escuro. `hero-landing-pessoas` dark inverteu isso: sombra virou Forest (meio-tom,
mais claro que o fundo da página) e áreas claras da foto viraram `#141414` (quase preto, mais
escuro que o próprio fundo `#00120A` da página seria se estivesse certo, e sem nenhuma relação
com token). O resultado é uma foto sem definição — as partes que deveriam ser as mais claras
(o que dá leitura à cena) ficam mais escuras que tudo ao redor.

**Fix:** reprocessar a variante escura com o par correto (`#00120A` / `#2D9E67`), mesmo raw.

### 2. Proporção vertical

O container atual (`HeroSection.tsx`) é `aspect-video` (16:9) dentro de `lg:max-w-md` — uma
caixa baixa e larga ao lado de uma coluna de texto que ocupa praticamente a altura toda da hero
section. A foto fonte também foi enquadrada em 16:9 com espaço negativo lateral pensado
(erroneamente, herdado do texto do prompt) para composição full-bleed atrás de texto — um uso
que a implementação real do Épico 29 não faz (a foto é uma caixa ao lado do texto, não um fundo).

**Fix:** nova geração em proporção vertical (4:5), enquadramento revisado para a caixa lateral
real (sem a premissa de espaço negativo para overlay de texto, que não se aplica), container
trocado de `aspect-video` para `aspect-[4/5]`.

### 3. Header sem fundo sólido

`SiteHeader` é `fixed` sem nenhuma superfície — herda o que estiver atrás dele conforme a página
rola, o que o founder viu sobrepor texto no print. O resto do sistema já resolve "elemento fixo
sobre conteúdo variável" com superfície sólida + hairline (`Card`: `bg-card border border-border
rounded-none`, `DESIGN.md` — nunca sombra). Não é um componente novo: é o mesmo padrão do `Card`
aplicado ao header.

**Fix:** envolver `<Logo />` em `bg-card border border-border rounded-none px-3 py-2` — reaproveita
o token de superfície e a regra de geometria já usados em todo o resto do app, sem inventar
variante.

## Escopo

- `assets/prompts/hero-landing-pessoas.md`: corrige a descrição de enquadramento (remove a
  premissa de overlay full-bleed, ajusta para proporção 4:5), nova entrada em `history` (v2).
- Nova geração via `agy` (mesma pessoa/cena, só proporção e enquadramento ajustados).
- `scripts/process-asset.mjs` rodado para as duas variantes do v2 aprovado — dark com o par
  corrigido (`#00120A`/`#2D9E67`), light mantém o par já correto (`#1B6A45`/`#F7F7F5`).
- `HeroSection.tsx`: container `aspect-video` → `aspect-[4/5]`.
- `site-header.tsx`: adiciona superfície sólida (`bg-card border border-border rounded-none`).
- Gate de revisão humana do founder na foto nova, mesmo padrão de todo asset (v1 aprovado não
  cobre v2 — é uma peça nova).

**Fora de escopo:** qualquer outra peça do pipeline de assets, o resto do layout do header, o
resto da composição do hero (headline, CTA, eyebrow).

## Critérios de aceite

- Dado a landing em tema escuro, quando carregada, então a foto do hero tem contraste visível
  entre sombra e luz — sombra funde com o fundo da página (`#00120A`), luz aparece em Grove.
- Dado a landing em qualquer breakpoint ≥ `sm`, quando carregada, então a imagem do hero tem
  proporção vertical (4:5), não mais 16:9.
- Dado qualquer rota do funil, quando rolada, então o header (logo) nunca deixa texto de trás
  visível através dele — superfície sólida com hairline, mesma regra de geometria do `Card`.
- Dado `npm run lint:colors`, quando rodado, então o duotone corrigido não introduz hex fora dos
  tokens.
- Dado `/quiz`, quando medido, então nada muda na regra de single-viewport (o header já existia
  desde o Épico 29 — este épico só muda a superfície dele, não a altura).

## Testes obrigatórios

- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` limpos.
- `npx playwright test` completo, com os snapshots visuais afetados (landing, hero) revisados e
  atualizados deliberadamente.
- `npm run test:lighthouse:flow` — confirmar que a nova geração não derruba o orçamento de peso.

## Gate de validação

- [x] Duotone escuro corrigido (`#00120A`/`#2D9E67`), publicado, `lint:colors` verde.
- [x] Nova foto (proporção 4:5) gerada, processada, publicada dentro do orçamento de peso.
- [x] `HeroSection` usa `aspect-[4/5]`.
- [x] `SiteHeader` com superfície sólida (`bg-card`/hairline), sem sobreposição visual ao rolar.
- [x] `lint`, `typecheck`, `test`, `build`, `e2e`, `lighthouse:flow` verdes.
- [ ] **Revisão visual manual do founder** — gate final para a foto v3, `decision: pending` até
      aprovação explícita (mesmo padrão de todo asset desde o Épico 16 — a aprovação do v1 não
      cobre a peça nova).
- [ ] PR aberto contra `main`, nenhum commit direto — aberto ao final desta implementação.

## Achados durante a implementação

- **v2 reprovada na própria sessão** — primeira geração (proporção 4:5, boa composição) tinha o
  título "Portfolio Optimization" legível na tela do laptop, violando a proibição explícita de
  texto renderizado legível em qualquer superfície da cena (`_brand-block.md`). Reprovada,
  registrada no histórico com o motivo, nunca editada à mão — v3 gerada com instrução reforçada
  de desfoque total de tela, sem título algum.
- **Duotone escuro do Épico 29 tinha o par de hex invertido e um hex fora de token** —
  `dark:#1B6A45 / light:#141414` fazia sombra da foto virar um tom mais claro que o fundo da
  página e luz da foto virar mais escura que o fundo — o oposto do que dá legibilidade a uma foto
  sobre fundo escuro. O padrão correto, já em uso por `hero-landing` dark e `radar-card-textura`
  dark (`dark:#00120A` = `color.theme.dark.background`, `light:#2D9E67` = Grove), não foi seguido
  na ocasião. Corrigido reprocessando o mesmo raw aprovado com o par certo.
