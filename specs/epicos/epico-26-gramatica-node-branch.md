# ÉPICO 26 — `pattern.nodeBranch` reconstruído sobre a gramática do símbolo

**Depende de:** Épico 25 (símbolo oficial presente no app — a reconstrução do pattern cita a
mesma geometria).

**Origem:** medição direta de `brand/LOGO/symbol-master.svg`, feita na rodada 3 da revisão de
marca (`brand/DESIGN.md` §6.1): módulo M≈40,24u, três primitivas — diagonal a exatamente
±45,00°, segmento ortogonal de comprimento M, quarto de arco de raio M. `node-branch-layout.ts`
em produção hoje não compartilha nenhum desses elementos: ângulos livres com ruído
pseudoaleatório (±25° sobre raízes em −70°/−20°/−60°, leque de 35°), nó como círculo,
terminação em ponta livre, comprimento decaindo por fator 0,72 sem relação com o módulo. É a
tensão E4 do ledger de marca: "o conceito unificador foi derivado da palavra 'Syntaxis', não do
desenho que a marca de fato tem."

## Objetivo

Reescrever `generateNodeBranchLayout` para que todo segmento seja 0°, 90° ou ±45°, todo
comprimento seja múltiplo inteiro do módulo, o nó seja a dobra (vértice, não círculo), e a
terminação de cada galho seja um quarto de arco de raio igual ao módulo — a única curva
permitida.

## Escopo

- Reescrever `components/patterns/lib/node-branch-layout.ts`:
  - Direção de cada galho sorteada **entre as quatro permitidas** (0°, 90°, +45°, −45°) a
    partir da direção do pai, não mais ângulo contínuo com ruído — mantém
    `mulberry32(42)` como PRNG determinístico (mesma seed, mesmo critério de teste de
    snapshot que o Épico 15 já exigia), só muda o espaço de escolha.
  - Comprimento de cada galho é um múltiplo inteiro do módulo (`module = 40` nas mesmas
    unidades do `viewBox` 200×200 atual — ajustar `WIDTH`/`HEIGHT` se o módulo não couber
    limpo, mantendo o viewBox atual como padrão preferencial).
  - Nó deixa de ser renderizado como círculo (`PatternNodeBranch.tsx` desenha um `<circle>`
    por nó hoje — remover) — o nó é só o vértice onde dois segmentos se encontram.
  - Cada galho terminal (sem filhos) ganha um `<path>` de quarto de arco de raio igual ao
    módulo, na direção de continuação do galho — mesma construção geométrica de
    `brand/PATTERNS/node-branch.svg` (corda do arco = módulo·√2, a condição exata de um arco
    de 90°).
- Atualizar `PatternNodeBranch.tsx` para renderizar arestas como `<path>` (reta ou reta+arco no
  terminal) em vez de `<line>` + `<circle>` por nó.
- Atualizar `__tests__/pattern-layouts.test.ts` e seu snapshot deliberadamente — a geometria
  muda de propósito, então o snapshot antigo **deve** ser substituído, não é regressão.
- Escrever (ou estender, se já existir) um linter simples que verifica, sobre o layout gerado,
  que todo ângulo de segmento reto é 0°/90°/±45° dentro de tolerância de ponto flutuante —
  candidato a `scripts/lint-patterns.mjs`, rodando no `prebuild` junto de `lint:patterns`.

**Fora de escopo, deliberadamente:**
- Mudar `PatternDataGrid`/renomear para `reticula` — Épico 27.
- Mudar onde `nodeBranch` é usado (`HeroSection.tsx`, `CredibilityBand.tsx`) — só a geometria
  interna muda, os dois usos continuam chamando a mesma API pública
  (`generateNodeBranchLayout(density, anchor)`).
- `nodeRadius` como prop: já é `$deprecated` no token; a prop correspondente no componente,
  se existir, fica marcada como não-usada e é candidata a remoção numa limpeza futura, não
  neste épico (não remover API pública sem o mesmo cuidado de depreciação que os tokens têm).

## Critérios de aceite

- Dado qualquer layout gerado por `generateNodeBranchLayout`, quando cada segmento reto é
  medido, então o ângulo é 0°, 90°, 45° ou −45° (tolerância < 0,01°).
- Dado qualquer segmento, quando o comprimento é medido, então é um múltiplo inteiro do
  módulo (tolerância de arredondamento de ponto flutuante).
- Dado qualquer nó, quando renderizado, então não existe `<circle>` de nó no SVG — só arestas e
  arcos terminais.
- Dado `HeroSection.tsx` e `CredibilityBand.tsx`, quando renderizados, então o padrão continua
  visualmente presente (decorativo, banda/campo), só com a gramática nova.

## Testes obrigatórios

- `npm run test __tests__/pattern-layouts.test.ts` — snapshot novo, revisado manualmente antes
  de aceitar (não só "atualizar e seguir").
- `npm run test __tests__/pattern-components.test.tsx`.
- `npm run lint`, `npm run typecheck` limpos.
- `npm run build` completo, incluindo o linter de ângulo novo no `prebuild`.
- `npx playwright test e2e/dev-ui-catalog.spec.ts` — snapshot visual do padrão em
  `HeroSection`/`CredibilityBand`, revisado (a mudança de gramática É uma mudança visual
  esperada, então o snapshot antigo não serve de baseline).

## Gate de validação

- [x] Ângulo/módulo/arco verificados por teste dedicado (`pattern-layouts.test.ts`, dois casos
      novos: todo segmento reto tem ângulo 0/45/90/135° mod 180° e comprimento = módulo; toda
      terminação em arco tem corda = módulo·√2) — não escrevi um script `lint-patterns.mjs`
      separado porque o teste já cobre exatamente essa garantia, e um segundo mecanismo
      checando a mesma coisa seria duplicação, não robustez.
- [x] Zero `<circle>`/`<line>` de nó no SVG renderizado — teste dedicado confirma.
- [x] Snapshot de `pattern-layouts.test.ts` revisado e aceito deliberadamente (dois casos:
      `default/field` e `default/corner`) — geometria inspecionada linha a linha antes de
      aceitar, não só regenerada às cegas.
- [x] `lint`, `typecheck`, `test` (191/191, +2 novos), `build` (prebuild completo),
      `format:check` verdes.
- [x] `npx playwright test e2e/dev-ui-catalog.spec.ts` — 7/7 verdes, incluindo os quatro
      snapshots visuais (a mudança de gramática não estourou a tolerância de diff do teste).
- [x] Revisão visual real via screenshot Playwright em `/dev/ui`, elemento por elemento —
      confirmado: o padrão lê como estrutura de galhos com terminação em curva, não como
      ornamento estranho. **O risco 5.3 da autocrítica da rodada 2 de marca não se confirmou**
      nesta densidade/escala — registrado aqui como o primeiro render real que responde a essa
      dúvida.
- [x] PR aberto contra `main`, empilhado sobre os Épicos 24/25.

## Decisões de implementação não fechadas pela spec original

A spec original deixava em aberto *como exatamente* direções e comprimentos seriam sorteados.
Decisões tomadas, documentadas para quem for mexer depois:

- **Comprimento constante = módulo** (não decaindo por densidade como o gerador antigo) — mais
  simples, e "múltiplo inteiro do módulo" fica trivialmente verdadeiro sem precisar validar uma
  progressão.
- **Direção do galho-filho = direção do pai + turno em {−45°, 0°, +45°}** (ou só {−45°,+45°}
  para densidade 2) — ecoa o próprio chevron do símbolo (duas diagonais a partir de um ponto),
  em vez de turnos maiores como ±90°, que dispersariam a malha rápido demais no canvas de
  200×200.
- **Arco terminal com lado (`sweep`) sorteado pelo PRNG**, não fixo — evita que toda folha da
  árvore curve para o mesmo lado, o que leria como padrão mecânico repetido em vez de orgânico.
- **Poda ocasional (15% de chance por galho candidato)** — sem isso a malha "dense" fica densa
  demais e compete com o texto mesmo na opacidade mínima; poda é mais simples que recalibrar
  profundidade por densidade.
