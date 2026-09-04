# ÉPICO 24 — Sincronização com `brand/DESIGN.md` v3.0 e tokens v2.3.0

**Depende de:** Épico 23 (concluído). Independente da reconstrução de marca em `brand/`
(rodada 3, `Syntaxis/brand/revisao-2026/`) — este épico é a propagação dessa reconstrução para
o app, primeira etapa da Fase 4 do prompt mestre de marca.

**Origem:** `brand/DESIGN.md` foi reescrito do zero duas vezes desde que este app sincronizou
pela última vez (v2.0, Épico 22). A cópia local (`DESIGN.md`, `design/tokens.json`) está
divergente do SSOT — `check-brand-sync.mjs` reprovaria hoje se `brand/` estivesse acessível no
build (hoje só avisa e sai verde, porque o script sai verde quando `brand/` não está no disco
do ambiente de build da Vercel).

## Objetivo

Trazer `apps/skill_test/DESIGN.md` e `apps/skill_test/design/tokens.json` para o estado exato
de `Syntaxis/brand/DESIGN.md` v3.0 e `Syntaxis/brand/tokens/syntaxis.tokens.json` v2.3.0 —
cópia byte a byte, não reinterpretação.

## Escopo

- Copiar `brand/DESIGN.md` → `apps/skill_test/DESIGN.md`.
- Copiar `brand/tokens/syntaxis.tokens.json` → `apps/skill_test/design/tokens.json`.
- Rodar `npm run generate:tokens` para regenerar o CSS derivado.
- Rodar `npm run check:tokens-breaking` contra o snapshot anterior — confirma que nenhum
  `$value` de token existente mudou (só adição/depreciação, coerente com o changelog do
  arquivo).
- Atualizar `docs/design-system.md` se ele citar versão ou contagem de patterns desatualizada
  (era "três padrões" antes da reclassificação de `growthLine`, feita no Épico 22 — confirmar
  se já está correto ou se precisa de ajuste).

**Fora de escopo, deliberadamente:**
- Reconstruir a geometria do pattern `nodeBranch` — é o Épico 26.
- Renomear `PatternDataGrid` — é o Épico 27.
- Trazer o SVG do símbolo — é o Épico 25.
- Nenhuma mudança de cor, tipografia ou radius: v2.0 (Épico 22) já implementou Lime, cantos
  retos e a tríade Space Grotesk/Hanken Grotesk/Space Mono — a v3.0 não muda nenhum desses
  valores, só a regra de patterns e o escopo da camada de ilustração (que este app nunca
  consumiu).

## Critérios de aceite

- Dado `apps/skill_test/DESIGN.md`, quando comparado a `brand/DESIGN.md`, então são idênticos
  byte a byte.
- Dado `apps/skill_test/design/tokens.json`, quando comparado a
  `brand/tokens/syntaxis.tokens.json`, então são idênticos byte a byte.
- Dado `npm run check:tokens-breaking`, quando rodado contra o snapshot anterior, então
  confirma zero `$value` alterado — só adição (`illustration.*`) e depreciação
  (`pattern.reticula.coarse`, os quatro `shadow.*`, `pattern.nodeBranch.nodeRadius`,
  `pattern.dataGrid`).
- Dado o CSS gerado, quando o app é buildado, então nenhuma classe/variável CSS que o código
  já usa desaparece (as depreciações não removem `$value`, então nada quebra ainda).

## Testes obrigatórios

- `npm run generate:tokens` sem erro.
- `npm run check:tokens-breaking` verde.
- `npm run lint`, `npm run typecheck` limpos.
- `npm run test` (Vitest) — suíte completa, sem regressão (nenhum teste deveria depender de
  texto específico do `DESIGN.md`; se algum depender, é achado a corrigir dentro deste épico).
- `npm run build` completo, incluindo `prebuild`.

## Gate de validação

- [x] `diff` byte a byte zero entre as duas cópias de `DESIGN.md` e de `tokens.json`.
- [x] `check:tokens-breaking` verde (diff v1.2.0→v2.3.0 continua só dentro da allowlist da
      v2.0.0 — nenhum `$value` mudou desde então, então nenhuma entrada nova foi necessária).
- [x] `lint`, `typecheck`, `test` (189/189), `build` (com `prebuild` inteiro) verdes.
- [x] PR aberto contra `main`, nenhum commit direto.

## Achados durante a implementação (não previstos na spec original)

1. **`docs/design-system.md` citava "três padrões"** — a reclassificação de `growthLine` como
   marca de dado é nova nesta sincronização (não aconteceu no Épico 22, como a spec original
   assumia). Corrigido para refletir dois patterns + a marca de dado.
2. **Regra "um pattern por peça" não sobreviveu à reescrita de `brand/DESIGN.md`** — existia
   como §5.4 na v2.0, sumiu na reconstrução do zero (rodadas 2 e 3), mas o linter que a aplica
   (`lint-one-pattern-per-file.mjs`) continua rodando. Corrigido na fonte: adicionado
   `brand/DESIGN.md` §6.5 com a regra, e re-sincronizado.
3. **Cinco citações de "`DESIGN.md` §7" quebradas** — na v2.0 do app, §7 era "Checklist
   Rápido"; na v3.0, §7 é "Camada de ilustração" (collage, escopo `hemingway` apenas). As cinco
   citações (`GOLIVE.md` ×2, `_batch-runner-prompt.md`, `docs/design-system.md` ×2,
   `.agents/skills/gerar-asset-marca/SKILL.md`) eram todas sobre o checklist, corrigidas para
   §10.
4. **Duas citações de "`DESIGN.md` §8" (lacunas de logo/certificado) não têm mais
   correspondente** — a v3.0 não rastreia lacunas específicas de app, só de marca. Reescritas
   para apontar ao Épico 25 (logo) e removida a citação de seção para o certificado (é decisão
   de produto, nunca foi conteúdo de `DESIGN.md`).
5. **CI reprovou em `Format check` (Prettier) depois do primeiro push** — testado local só com
   `lint`/`typecheck`/`test`/`build`; `npm run format:check` não está no `prebuild`, só no
   workflow do GitHub (exatamente a armadilha T8 do ledger de marca: "build, testes, e2e,
   typecheck e dez gates de marca podem passar e o CI reprovar em 40s"). `DESIGN.md` e
   `tokens.json` tinham formatação diferente do Prettier deste app (largura de coluna de
   tabela markdown, arrays JSON em uma linha) — conteúdo idêntico, só forma. Corrigido com
   `npm run format`, e a mesma formatação propagada de volta para `brand/` para que "cópia
   byte a byte" continue passando depois de qualquer sincronização futura.
