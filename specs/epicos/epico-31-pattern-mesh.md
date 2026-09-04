# ÉPICO 31 — `PatternNodeBranch` → `PatternMesh`

**Depende de:** Épico 30 (concluído, mergeado, PR #42).

**Origem:** pedido direto do founder — revisão do brand kit e substituição do pattern
`nodeBranch` por textura de malha quadriculada, confirmado explicitamente como mudança de
**sistema inteiro** (não só apresentação), primeiro formalizada em `brand/` (`DESIGN.md` §6,
`tokens.json` v2.5.0, `REVOGACOES.md` H9) num commit anterior deste mesmo trabalho.

## Objetivo

Sincronizar `apps/skill_test` com a revogação já formalizada em `brand/`: `pattern.nodeBranch`
sai como pattern decorativo primário do sistema, `pattern.mesh` entra no lugar.

## Diagnóstico prévio (antes de implementar)

Auditoria encontrou que `<PatternNodeBranch/>` **não tinha nenhum uso decorativo real em
produção** — o Épico 29 já tinha removido as duas únicas ocorrências (Hero, `CredibilityBand`).
A única presença funcional real era `ShareRadarButton.tsx` (moldura do card compartilhável de
resultado, via `generateNodeBranchLayout('sparse', 'corner')`/Canvas Path2D). Fora isso, só
catálogo (`app/dev/ui/page.tsx`) e testes. Isso reduziu bastante o raio de impacto real da
troca — não foi reversão de nenhuma página, foi trocar o gerador de geometria e seu único
consumidor funcional.

## Escopo

- `components/patterns/lib/mesh-layout.ts` novo — `generateMeshLayout(density, anchor)`,
  mesma forma de retorno (`{d, viewBox}`) de `node-branch-layout.ts`, que foi removido. Malha é
  regular por natureza — **sem PRNG**, mais simples que o gerador anterior (que precisava de um
  `mulberry32` determinístico pra escolher galho/turno/arco).
- `components/patterns/PatternMesh.tsx` substitui `PatternNodeBranch.tsx` (arquivo novo,
  antigo removido — mesmo padrão de rename do Épico 27).
- `components/patterns/index.ts`, `scripts/lint-one-pattern-per-file.mjs` (`PATTERN_NAMES`),
  `app/dev/ui/page.tsx` (catálogo) atualizados.
- `components/result/ShareRadarButton.tsx`: `drawNodeBranchCorner` → `drawMeshCorner`,
  `--pattern-node-branch-color` → `--pattern-mesh-color`. Transform de posicionamento por canto
  (`FRAME_SCALE`/`FRAME_INSET`) reaproveitado sem alteração — é genérico, não específico da
  geometria antiga.
- `__tests__/pattern-layouts.test.ts`, `pattern-components.test.tsx`, `generate-tokens.test.ts`
  reescritos para a geometria/nome novos.
- `DESIGN.md` + `design/tokens.json`: sincronizados byte a byte com `brand/` (v2.5.0).

## Achados durante a implementação

- **`density` não tinha efeito nenhum em `anchor="field"`** — a primeira versão de
  `generateMeshLayout` só variava a região desenhada (maior/menor) no modo `corner`; no modo
  `field` a região era sempre o canvas inteiro, então `sparse`/`default`/`dense` geravam
  exatamente a mesma malha. Pego pelo teste `density maior produz mais linhas`, que falhou
  genuinamente (`231` não é menor que `231`). Corrigido com um modelo de **passo** (stride):
  `dense` desenha toda linha da grade, `default` uma sim uma não, `sparse` uma a cada três —
  density deixa de mudar a *região*, muda quanta da mesma grade de 32px é desenhada. Região do
  `anchor="corner"` também deixou de depender de `density` (fixa em 5 células), o que é o que
  de fato garante `corner < field` em qualquer densidade, não só nos casos testados.
- **Cor do pattern**: `grove.500` (mesma de `nodeBranch`) confirmada por preview visual real
  nesta sessão — é a única cor que lê com contraste sobre Chalk *e* Deep Forest sem token por
  tema. `Mist` (cor da retícula) foi testada e descartada: quase invisível sobre Chalk.
- **`lint-hardcoded-colors.mjs` quebrou com `ENOENT`** ao rodar `npm run build` antes de o
  `git add` acontecer — o script lista arquivos via `git ls-files`, que ainda apontava para
  `PatternNodeBranch.tsx` (deletado do disco, não do índice do git) até a deleção ser staged.
  Não é um bug do script — é ordem de operação (`git add -A` antes do `build`, não depois).

## Critérios de aceite

- Dado o catálogo `/dev/ui`, quando carregado, então mostra `PatternMesh` (não
  `PatternNodeBranch`) nas duas variantes (decorativo/atrás de texto).
- Dado o card compartilhável de resultado, quando gerado, então a moldura dos 4 cantos é a
  malha nova — verificado visualmente (screenshot real do download, não só teste automatizado).
- Dado `npm run lint:patterns`, quando rodado, então continua detectando composição com mais
  de um pattern (lista atualizada, não regrediu ao mesmo bug do Épico 29).
- Dado `apps/skill_test/DESIGN.md`/`design/tokens.json`, quando comparados a `brand/`, então
  são byte a byte idênticos.

## Testes obrigatórios

- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` limpos.
- `npx playwright test` completo.
- `npm run test:lighthouse:flow`.
- Verificação visual manual (fora da suíte automatizada): catálogo `/dev/ui` e o card
  compartilhável de `/resultado`, nos dois temas.

## Gate de validação

- [x] `pattern.mesh` implementado, `PatternNodeBranch` removido (não só depreciado — o
      componente React não tem consumidor nenhum a preservar, diferente do token em `brand/`,
      que fica `$deprecated` por política de versionamento).
- [x] `ShareRadarButton` migrado, moldura verificada visualmente (screenshot real).
- [x] `lint`, `typecheck`, `test` (192/192), `build`, `e2e` (81/81), `lighthouse:flow` verdes.
- [x] `DESIGN.md`/`tokens.json` sincronizados byte a byte com `brand/` v2.5.0.
- [ ] PR aberto contra `main`, nenhum commit direto.
