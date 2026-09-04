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

- [ ] Linter de ângulo/módulo verde contra o layout gerado.
- [ ] Zero `<circle>` de nó no SVG renderizado.
- [ ] Snapshot de `pattern-layouts.test.ts` revisado e aceito deliberadamente.
- [ ] `lint`, `typecheck`, `test`, `build` verdes.
- [ ] Revisão visual do padrão em `/dev/ui` e nos dois usos de produção — confirmar que não
      lê como ornamento estranho numa malha densa (risco 5.3 nomeado na autocrítica da rodada 2
      de marca: "o quarto de arco repetido pode ler como ornamento — nenhum render de
      densidade em página cheia foi feito". Este épico é o primeiro render real; se o risco se
      confirmar, registrar achado antes de prosseguir, não ignorar).
- [ ] PR aberto contra `main`, nenhum commit direto.
