# Go-Live Checklist — Syntaxis Skill Check

Este documento é o critério de go-live definido no Épico 9. Ele não substitui
os gates individuais de cada épico (documentados nos respectivos PRs) — é a
validação final, de ponta a ponta, de que nada regrediu.

## Status geral

| Épico                   | Status                                               |
| ----------------------- | ---------------------------------------------------- |
| 1 — Fundação            | ✅ Validado                                          |
| 2 — Design System       | ✅ Validado                                          |
| 3 — Motor de Seleção    | ✅ Validado                                          |
| 4 — Landing Page        | ✅ Validado                                          |
| 5 — Fluxo do Quiz       | ✅ Validado                                          |
| 6 — API de Scoring      | ✅ Validado                                          |
| 7 — MailerLite          | ✅ Validado (subscriber real confirmado em produção) |
| 8 — Página de Resultado | ✅ Validado                                          |
| 9 — QA e Go-Live        | Em andamento — ver checklist abaixo                  |

## 1. Suíte de testes completa (todos os épicos, sem regressão)

```bash
npm run test        # Vitest — unitário/integração
npm run test:e2e    # Playwright — E2E, acessibilidade, visual
```

Última execução: **55 testes Vitest** + **39 testes Playwright**, todos verdes.
Cobrem: seleção adaptativa e scoring (Épico 3), design system e contraste
(Épico 2), landing (Épico 4), fluxo do quiz completo + teclado + reduced-motion
(Épico 5), API de submissão e segurança (Épico 6), MailerLite mockado (Épico 7),
fluxo completo até `/resultado` nos 3 cenários de classificação (Épico 8),
acessibilidade e cross-device nas 4 rotas públicas (Épico 9).

## 2. Lighthouse — as 4 rotas públicas

`/quiz`, `/lead` e `/resultado` só existem com conteúdo real depois de
interação (guardas client-side redirecionam para `/` em acesso direto) — um
`lighthouse <url>` comum nunca veria o conteúdo real dessas páginas. Por isso
usamos a User Flow API do Lighthouse, dirigindo um navegador real pelo fluxo
completo:

```bash
npm run build && npm run start   # em um terminal
npm run lighthouse:flow          # em outro, contra http://localhost:3000
```

Resultado da última execução (todas as categorias aplicáveis a cada tipo de
medição — navegação completa vs. transição client-side vs. snapshot de DOM):

| Rota                                                 | Performance | Acessibilidade | Boas práticas | SEO  |
| ---------------------------------------------------- | ----------- | -------------- | ------------- | ---- |
| `/` (navegação completa)                             | 95–99       | 100            | 100           | 100  |
| `/quiz` (navegação completa)                         | 98–100      | 100            | 100           | 100  |
| transição → `/lead`                                  | 92–100      | n/a¹           | 100           | n/a¹ |
| `/lead` (snapshot)                                   | n/a¹        | 100            | 100           | 100  |
| transição → `/resultado` (inclui `POST /api/submit`) | 92–100      | n/a¹           | 100           | n/a¹ |
| `/resultado` (snapshot)                              | n/a¹        | 100            | 100           | 100  |

¹ Cada modo de coleta do Lighthouse só produz um subconjunto de categorias
(timespan não audita accessibility/SEO; snapshot não audita performance) —
não é uma lacuna, é como a ferramenta funciona. Juntas, as duas medições por
rota cobrem as 4 categorias.

**Todas as categorias aplicáveis ficaram ≥ 90** em múltiplas execuções.

## 3. Acessibilidade (axe-core + teclado + leitor de tela)

- **axe-core (WCAG2AA)**: 0 violações em `/`, `/quiz`, `/lead`, `/resultado` e
  `/dev/design-system` (`e2e/a11y-all-routes.spec.ts`, `e2e/design-system.spec.ts`,
  `e2e/resultado-a11y.spec.ts`).
- **Teclado**: quiz inteiro (14 perguntas), formulário de `/lead` e CTA da
  landing são 100% operáveis só com Tab/Space/Enter, sem mouse
  (`e2e/quiz-flow.spec.ts`, `e2e/a11y-all-routes.spec.ts`).
- **Leitor de tela**: ⚠️ **pendente de validação humana** — não é possível
  operar um leitor de tela real (VoiceOver/NVDA) a partir deste agente de
  terminal. Ver seção "Pendências humanas" abaixo.

## 4. Cross-device (375 / 768 / 1440px)

`e2e/cross-device.spec.ts` confirma zero scroll horizontal nas 4 rotas
públicas, nos 3 breakpoints (mobile/tablet/desktop) — 12 combinações, todas
verdes. Inspeção visual manual em screenshots de tablet/desktop não encontrou
problema de layout.

## 5. Variáveis de ambiente em produção (Vercel)

Confirmado via `vercel env ls production`:

| Variável              | Ambientes                       | Exposta ao client?        |
| --------------------- | ------------------------------- | ------------------------- |
| `MAILERLITE_API_KEY`  | Preview, Production (Sensitive) | Não — só em Route Handler |
| `MAILERLITE_GROUP_ID` | Preview, Production (Sensitive) | Não — só em Route Handler |

Confirmado por grep no bundle de produção (`.next/static/`): nenhum vestígio
de `MAILERLITE_API_KEY`, do SDK da MailerLite, nem de `correctOptionId` em
nenhum momento do projeto (checado a cada épico desde o Épico 3).

## 6. MailerLite em produção

Grupo real da conta (`SYNTAXIS_SKILL_APP`, id `195227265630471749`) e os 4
Campos customizados (`seniority`, `score_geral`, `classificacao`,
`perfil_tecnico`) já existiam antes deste épico (confirmados no Épico 7 com
uma submissão de ponta a ponta real, subscriber de teste deletado em
seguida). Não há grupos/campos "de teste" a limpar — a configuração já é a
de produção.

## Pendências que exigem uma pessoa

- [ ] **Leitor de tela real** (VoiceOver ou NVDA) em pelo menos uma rota
      crítica — recomendado `/quiz` (fluxo de pergunta única, mais representativo).
- [ ] **Fluxo completo em pelo menos 1 dispositivo mobile real** (Landing →
      Quiz → Lead → Resultado), confirmando que nenhuma tela quebra o
      single-viewport do design system.

Depois desses dois itens confirmados, os gates dos Épicos 1–9 estarão
100% fechados e o produto pronto para tráfego real.
