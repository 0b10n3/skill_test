# ÉPICO 28 — QA final e go-live da sincronização v3.0

**Depende de:** Épicos 24–27 concluídos.

**Origem:** Fase 4 do prompt mestre de marca — "app em produção refletindo o novo kit, sem
regressão nos eventos de GA4/Meta Pixel já configurados." Nenhum dos épicos 24–27 toca
`lib/analytics/track.ts` ou qualquer componente que dispare `track()` — o risco de regressão de
analytics é estrutural baixo, mas o critério pede prova, não suposição.

## Objetivo

Confirmar, com a mesma prova automatizada que os go-lives anteriores (Épicos 13, 19, 22) já
produziram, que a sincronização de marca v3.0 não regrediu nada — visual, funcional ou de
telemetria — e publicar em produção.

## Escopo

- Suíte completa: Vitest + Playwright (incluindo axe-core WCAG2AA nas rotas existentes), sem
  `--update-snapshots` cego — qualquer diff de screenshot revisado um a um antes de aceitar
  (mudança esperada: símbolo agora visível, pattern com gramática nova; mudança inesperada:
  qualquer coisa fora dessas duas).
- `analytics-consent.test.ts` e `analytics-track.test.ts` verdes sem alteração — confirma que
  nenhum épico anterior tocou o pipeline de eventos.
- `npm run test:lighthouse:flow` (ou equivalente já existente) — Performance/Accessibility/SEO
  dentro do mesmo piso que o Épico 22 estabeleceu (≥ 95, conforme `GOLIVE.md`).
- Deploy em preview da Vercel primeiro; produção só depois da revisão visual humana (mesmo
  padrão de gate que o Épico 22 já usa — "nenhuma verificação automatizada substitui a
  aprovação de que o resultado bate com a referência visual aprovada").
- Atualizar `GOLIVE.md` com a seção desta rodada, mesmo formato das anteriores.
- Atualizar `specs/epicos/00-indice.md` com os épicos 24–28.

**Fora de escopo, deliberadamente:**
- Qualquer nova feature de produto — este épico é go-live de sincronização de marca, não de
  funcionalidade nova.
- Configuração de domínio/DNS — já resolvida em rodadas anteriores (`GOLIVE.md`).

## Critérios de aceite

- Dado a suíte completa, quando rodada, então 100% verde, incluindo os testes de analytics
  sem nenhuma alteração de código.
- Dado o preview da Vercel, quando comparado com produção atual, então símbolo aparece,
  pattern tem a gramática nova, e nada mais muda visualmente fora do declarado nos épicos
  24–27.
- Dado GA4 DebugView e Meta Events Manager, quando o preview é navegado manualmente, então os
  mesmos eventos do fluxo atual (`quiz_started`, `report_viewed`, etc. — conferir lista exata
  em `lib/analytics/track.ts`) continuam disparando sem mudança de payload.

## Testes obrigatórios

- `npm run lint`, `npm run typecheck`, `npm run test` (Vitest completo), `npm run build`
  (com `prebuild` inteiro).
- `npx playwright test` — suíte e2e completa, incluindo axe-core.
- `npm run test:lighthouse:flow` (se existir; senão, Lighthouse manual nas 4 rotas × 2 temas).
- Validação manual de eventos em GA4 DebugView / Meta Test Events no preview deployado.

## Gate de validação

- [ ] 100% dos testes automatizados verdes, incluindo os de analytics sem alteração.
- [ ] Lighthouse dentro do piso do Épico 22 (Performance ≥ 90, Accessibility 100, SEO ≥ 95).
- [ ] Deploy em preview da Vercel, revisado visualmente antes de promover a produção.
- [ ] **Revisão visual manual do founder** — gate final, humano por natureza, mesmo padrão dos
      épicos anteriores.
- [ ] Eventos de GA4/Meta Pixel confirmados sem regressão no preview.
- [ ] `GOLIVE.md` e `specs/epicos/00-indice.md` atualizados.
- [ ] PR aberto contra `main` por épico (24, 25, 26, 27 já mergeados antes deste); promoção a
      produção só depois da aprovação humana.
