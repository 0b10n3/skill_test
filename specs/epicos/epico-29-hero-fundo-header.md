# ÉPICO 29 — Hero com pessoas, fundo sem pattern geométrico, header universal

**Depende de:** Épicos 24–28 (concluídos, mergeados).

**Origem:** pedido direto do founder, três ajustes visuais independentes sobre o app já
sincronizado com a marca v3.0:

1. Substituir a imagem abstrata do hero por fotografia de pessoas aprendendo/estudando
   finanças/finanças quantitativas.
2. Remover `PatternNodeBranch` decorativo do fundo (hero e banda de metodologia); trabalhar
   ideias de reticulado/partículas e nuances de gradiente inspiradas em `design_stitch.md`.
3. Header com logo + "Syntaxis" em toda tela do funil — hoje só existe em `/resultado`.

**Decisão de marca que precedeu este épico** (`brand/DESIGN.md` §4.5, `REVOGACOES.md` H8):
gradiente/glow no sistema, proibidos desde a v2.0, ganham exceção nomeada — só como camada de
ambiente de fundo, nunca em componente, nunca atrás de texto direto, radial, cor de token,
opacidade máxima declarada (`gradient.ambient.forest`/`gradient.ambient.lime`, tokens v2.4.0).
`assets/prompts/_brand-block.md` também revisado: "pessoas fotorrealistas" deixa de ser
proibição geral, com regra de contexto (estudo/aprendizado, nunca decoração genérica).

## Objetivo

Entregar os três ajustes com a mesma disciplina dos épicos anteriores — sem reabrir nenhum
invariante além dos dois já revogados formalmente em `brand/`, e sem violar o resto do
contrato de camadas (a foto de pessoas é produto/sistema, nunca collage).

## Escopo

### 1. Imagem do hero — fotografia de pessoas

- Novo prompt `assets/prompts/hero-landing-pessoas.md`, seguindo o formato existente
  (frontmatter `slug`/`usage`/`aspectRatio`/`variants`/`history`), descrevendo: pessoa(s)
  estudando/em ambiente de aprendizado de finanças — anotações, laptop com dado real e ilegível
  na tela, mesa de trabalho ou biblioteca, registro editorial/documental, nunca "banco de
  imagens corporativo". Duas variantes (light/dark) como o asset anterior.
- Geração via `agy` (Nano Banana Pro), mesma skill (`.agents/skills/gerar-asset-marca/`).
- Publicação via `npm run assets:process` — duotone obrigatório (mesma garantia de aderência à
  paleta que todo asset já usa, `scripts/lib/duotone.mjs`): a foto entra bruta, sai mapeada
  para dois tons de token por luminância. Isto é o que resolve, por construção, a preocupação
  de "foto real convivendo com paleta fechada" — não é overlay por cima, é o pixel remapeado.
- `HeroSection.tsx` passa a consumir o novo slug (`hero-landing-pessoas` ou substituindo
  `hero-landing` no lugar, a decidir na implementação conforme o resultado da geração).
- Gate de revisão humana antes de publicar (mesmo padrão do resto do pipeline de assets) —
  **a geração em si roda nesta sessão, mas a aprovação final da peça é do founder**, exatamente
  como todo asset anterior do Épico 16 em diante.

**Fora de escopo:** gerar peça para `/quiz`, `/lead` ou `/resultado` — só o hero da landing foi
pedido.

### 2. Fundo — remove pattern, adiciona reticulado/gradiente

- `HeroSection.tsx`: remove `<PatternNodeBranch>` decorativo do canto.
- `CredibilityBand.tsx`: remove `<PatternNodeBranch>` full-bleed atrás do texto.
- Substituto, nos dois: `gradient.ambient` (forest, canto oposto ao conteúdo — mecanismo de
  `design_stitch.md` §"glow ambient lights", já escopado em `DESIGN.md` §4.5) mais, onde fizer
  sentido de composição, `pattern.reticula.fine` em opacidade baixa como textura de sistema —
  a retícula **não** é o pattern removido (`nodeBranch`), continua permitida como já era antes
  deste épico (`DESIGN.md` §6.4, "respiro em conteúdo denso").
- Regra dura herdada da própria exceção: gradiente nunca atrás de texto direto — `HeroSection`
  já separa texto (coluna esquerda, fundo sólido `background`) da imagem (coluna direita); o
  gradiente ambiente entra atrás da composição inteira, na camada mais baixa, não atrás da
  coluna de texto especificamente. `CredibilityBand` tem fundo Deep Forest sólido sob o texto
  hoje — o gradiente ambiente entra como um glow radial no canto, não substituindo o sólido.

**Fora de escopo:** qualquer outro lugar do app que hoje não usa `PatternNodeBranch` decorativo
— não é uma varredura geral de "remover todo pattern", é especificamente hero + banda.

### 3. Header universal

- Novo componente `components/site-header.tsx` (ou reaproveitar o de `ReportHeader.tsx` se a
  API já servir sem inchar o componente de resultado com responsabilidade de layout genérico):
  `<Logo />` fixo/sticky no topo, mesma altura e comportamento em `/`, `/quiz`, `/lead` e
  `/resultado`.
- `/resultado` já tem cabeçalho com logo (`ReportHeader.tsx`) — decidir na implementação se o
  novo header substitui o dele ou se convivem (o de `/resultado` pode ter elementos próprios,
  como o toggle de tema, que o header genérico também deveria ter, evitando duplicar).
- Sticky/fixo não pode interferir na regra "single-viewport por seção" do `/quiz` (Épico 4) —
  medir a altura do header no orçamento de viewport da tela de pergunta.

**Fora de escopo:** qualquer mudança de navegação/rota — o header é só identidade visual, sem
menu.

## Critérios de aceite

- Dado a landing, quando carregada, então mostra uma fotografia de pessoas em contexto de
  estudo/aprendizado, tratada em duotone dentro da paleta, sem `PatternNodeBranch` decorativo.
- Dado o hero e a banda de metodologia, quando renderizados, então nenhum `<PatternNodeBranch>`
  aparece como decoração de fundo; o glow ambiente (gradiente) aparece em pelo menos um canto,
  nunca atrás de texto direto sem superfície sólida entre os dois.
- Dado `/`, `/quiz`, `/lead` e `/resultado`, quando carregados, então todos mostram o mesmo
  header com símbolo + "Syntaxis".
- Dado `npm run lint:colors`, quando rodado, então o gradiente novo não introduz hex fora dos
  tokens (`gradient.ambient.*` são alias).
- Dado `/quiz`, quando medido com o header novo, então a tela de pergunta continua cabendo num
  viewport de 667px sem scroll (regra desde o Épico 4).

## Testes obrigatórios

- `npm run lint`, `npm run typecheck` limpos.
- `npm run test` — suíte completa; testes novos para o header universal (presente nas 4 rotas).
- `npm run build` completo, incluindo `prebuild` (`lint:colors`, `assets:verify-manifest`,
  `assets:verify-palette` cobrindo o asset novo).
- `npx playwright test` — suíte completa, com os snapshots visuais afetados (landing, hero,
  banda de metodologia, e as 4 rotas com header novo) revisados e atualizados deliberadamente.
- `npm run test:lighthouse:flow` — confirmar que a foto nova não derruba Performance (orçamento
  de peso do asset, mesmo gate de sempre).

## Gate de validação

- [x] Prompt do hero com pessoas escrito e versionado.
- [x] Peça gerada, processada (duotone) e publicada, dentro do orçamento de peso.
- [x] Zero `PatternNodeBranch` decorativo em `HeroSection`/`CredibilityBand`.
- [x] `gradient.ambient` presente, nunca atrás de texto direto, `lint:colors` verde.
- [x] Header com logo presente nas 4 rotas do funil.
- [x] `/quiz` continua sem scroll em 375×667 com o header novo.
- [x] `lint`, `typecheck`, `test`, `build`, `e2e`, `lighthouse:flow` verdes.
- [ ] **Revisão visual manual do founder** — gate final para a foto de pessoas especificamente,
      antes de considerar o asset definitivo (mesmo padrão de todo asset gerado desde o Épico 16).
      `decision: pending` mantido em `hero-landing-pessoas.md` até essa aprovação.
- [ ] PR aberto contra `main`, nenhum commit direto — aberto ao final desta implementação, merge
      depende do mesmo fluxo humano dos épicos anteriores.

## Achados durante a implementação

- **`PATTERN_NAMES` desatualizado em `lint-one-pattern-per-file.mjs`**: a lista ainda continha
  `PatternDataGrid`, renomeado para `PatternReticula` no Épico 27 — o lint de "um pattern por
  arquivo" estava silenciosamente inoperante para o novo nome desde então. Corrigido.
- **Variável CSS de `GradientAmbient` some do build**: a primeira versão montava o nome da
  variável via template literal (`` `--gradient-ambient-${tone}-color` ``); o Tailwind
  v4/Lightning CSS elimina do `:root` gerado qualquer variável de `@theme` que não apareça como
  string literal em algum arquivo fonte — o glow renderizava com dimensão 0×0, sem erro. Corrigido
  trocando para uma tabela estática `Record<Tone, CSSProperties>` com os nomes escritos por
  extenso. Lição geral para o resto do app: nunca montar nome de variável CSS por interpolação.
- **Ordem de tab quebrada em `a11y-all-routes.spec.ts`**: o novo `SiteHeader` insere um link
  focável antes do CTA da landing. A primeira correção presumiu 1 Tab extra e continuou falhando;
  diagnosticada a ordem real com um script Playwright dedicado (header → `ThemeToggle` → CTA, 3
  Tabs), teste corrigido de acordo.
- **Reincidência do padrão "servidor solto na porta 3000"**: a suíte Playwright completa falhou
  com 12 testes quebrados até matar um `next-server` remanescente de teste manual anterior — o
  `reuseExistingServer` do Playwright reaproveitou esse servidor mal-configurado em vez de subir
  o seu próprio. Mesma classe de falha já documentada no Épico 25/28; suíte completa após matar o
  processo: 81/81.
