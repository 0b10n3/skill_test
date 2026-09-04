# ÉPICO 27 — `pattern.dataGrid` → `pattern.reticula`

**Depende de:** Épico 24 (tokens sincronizados — `pattern.reticula.fine` já existe no token,
`pattern.dataGrid` já está `$deprecated` apontando para ele).

**Origem:** `brand/DESIGN.md` v3.0 §6.3 — `dataGrid` substituído por `reticula`, um primitivo
com escala de ponto como parâmetro. A escala `coarse` (matéria de ilustração compartilhada,
proposta na rodada 2) foi depreciada na rodada 3 (A6, separação estrita) — só `fine` tem
consumidor real, e é o mesmo desenho que `dataGrid` já tinha (valores idênticos, só o nome do
token muda).

## Objetivo

Renomear o componente e as variáveis CSS de `dataGrid` para `reticula.fine`, sem mudar nenhum
valor visual — é rename, não redesign.

## Escopo

- Renomear `components/patterns/PatternDataGrid.tsx` → `PatternReticula.tsx`, componente
  exportado como `PatternReticula`, prop `slot` inalterada.
- Atualizar `style` do componente para ler as variáveis CSS geradas a partir de
  `pattern.reticula.fine.*` em vez de `pattern.dataGrid.*` (o gerador de tokens já produz as
  variáveis novas a partir do Épico 24; confirmar que `--pattern-reticula-fine-*` existe e
  `--pattern-data-grid-*` não é mais gerado, exceto como alias se `check:tokens-breaking`
  exigir transição suave — decisão: **não** manter alias de CSS, só o token JSON tem
  `$deprecated`; CSS gerado reflete só o estado atual).
- Atualizar o único consumidor (`app/dev/ui/page.tsx`) para importar `PatternReticula`.
- Atualizar `components/patterns/index.ts` (barrel export).
- Renomear o teste correspondente em `__tests__/pattern-components.test.tsx` se ele testar o
  componente por nome.

**Fora de escopo, deliberadamente:**
- Criar uma versão "coarse" do componente — não tem consumidor (Bloco A2/A6 da rodada 3 de
  marca: a escala grossa não existe mais como token compartilhado).
- Qualquer novo uso de `PatternReticula` em página que não já usa `PatternDataGrid` hoje — não
  há pedido de produto para isso neste épico.

## Critérios de aceite

- Dado o código do app, quando buscado por `PatternDataGrid` ou `dataGrid`, então nenhuma
  ocorrência sobrevive fora de comentário histórico/changelog.
- Dado `/dev/ui`, quando renderizado, então o padrão de retícula aparece visualmente idêntico
  ao que `PatternDataGrid` renderizava antes (é rename, o valor de `spacing`/`dotRadius`/`color`
  não mudou).
- Dado `npm run generate:tokens`, quando rodado, então o CSS gerado usa o prefixo
  `--pattern-reticula-fine-*`.

## Testes obrigatórios

- `npm run lint`, `npm run typecheck` limpos.
- `npm run test` — suíte completa.
- `npm run build` completo, incluindo `prebuild`.
- `npx playwright test e2e/dev-ui-catalog.spec.ts` — confirma que `/dev/ui` não muda
  visualmente (rename puro).

## Gate de validação

- [ ] Zero ocorrência de `PatternDataGrid`/`dataGrid` fora de histórico.
- [ ] `/dev/ui` visualmente idêntico ao snapshot anterior a este épico.
- [ ] `lint`, `typecheck`, `test`, `build`, `e2e` verdes.
- [ ] PR aberto contra `main`, nenhum commit direto.
