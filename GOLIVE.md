# Go-Live Checklist — Syntaxis Skill Check

Este documento é o critério de go-live definido no Épico 9. Ele não substitui
os gates individuais de cada épico (documentados nos respectivos PRs) — é a
validação final, de ponta a ponta, de que nada regrediu.

## Status geral

| Épico                                             | Status                                                                                                                |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1 — Fundação                                      | ✅ Validado                                                                                                           |
| 2 — Design System                                 | ✅ Validado                                                                                                           |
| 3 — Motor de Seleção                              | ✅ Validado                                                                                                           |
| 4 — Landing Page                                  | ✅ Validado                                                                                                           |
| 5 — Fluxo do Quiz                                 | ✅ Validado                                                                                                           |
| 6 — API de Scoring                                | ✅ Validado                                                                                                           |
| 7 — MailerLite                                    | ✅ Validado (subscriber real confirmado em produção)                                                                  |
| 8 — Página de Resultado                           | ✅ Validado                                                                                                           |
| 9 — QA e Go-Live                                  | ✅ Validado                                                                                                           |
| 10 — Banco de questões v2                         | ✅ Validado                                                                                                           |
| 11 — Motor de diagnóstico                         | ✅ Validado                                                                                                           |
| 12 — Relatório de resultados v2                   | ✅ Validado                                                                                                           |
| 13 — QA de regressão e go-live v2                 | ✅ Validado                                                                                                           |
| 14 — Fundação tokens Syntaxis                     | ✅ Validado                                                                                                           |
| 15 — Padrões geométricos                          | ✅ Validado                                                                                                           |
| 16 — Pipeline assets generativos                  | ✅ Validado                                                                                                           |
| 17 — Redesign páginas do fluxo                    | ✅ Validado                                                                                                           |
| 18 — Redesign do relatório                        | ✅ Validado                                                                                                           |
| 19 — QA visual e go-live redesign                 | Ver [Go-Live do Redesign](#go-live-do-redesign-épico-19) abaixo                                                       |
| 20 — Refinamento anti-genérico                    | Ver [Go-Live do Refinamento + SEO/Analytics](#go-live-do-refinamento-anti-genérico--seoanalytics-épicos-20-21) abaixo |
| 21 — SEO, analytics e pixel                       | Ver [Go-Live do Refinamento + SEO/Analytics](#go-live-do-refinamento-anti-genérico--seoanalytics-épicos-20-21) abaixo |
| 22 — Design v2.0 (Lime, cantos retos, tipografia) | Ver [Go-Live do Design v2.0](#go-live-do-design-v20-épico-22) abaixo                                                  |

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

**A suíte Playwright completa (39/39) também rodou verde contra um
deployment de preview real da Vercel** (não só `localhost`), como o Épico 9
exige ("rodando verde... contra o ambiente de preview"):

```bash
PLAYWRIGHT_BASE_URL="https://<preview-url>.vercel.app" \
VERCEL_AUTOMATION_BYPASS_SECRET="<secret>" \
npm run test:e2e
```

A proteção SSO padrão de previews da Vercel bloqueava acesso direto; foi
habilitado o "Protection Bypass for Automation" nativo da plataforma
(`vercel project protection enable --protection-bypass`), que gera um
secret dedicado para scripts automatizados sem desativar a proteção para
mais ninguém. Achado incidental: a própria toolbar de preview da Vercel
grava algumas chaves em `sessionStorage` (`vc-*`, `__vtkb-*`) — não são
respostas do quiz, são infraestrutura da plataforma que só existe em
preview; os testes de storage foram ajustados para filtrar essas chaves
especificamente, sem afrouxar a checagem real (nenhum dado do app em
storage).

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
- **Leitor de tela**: ✅ validado por uma pessoa (VoiceOver/TalkBack) em
  `/quiz` — não é algo que este agente de terminal conseguisse operar
  sozinho; confirmado que a leitura faz sentido.

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

## Pendências que exigem uma pessoa — todas confirmadas

- [x] **Leitor de tela real** (VoiceOver/TalkBack) em `/quiz` — confirmado
      que a leitura faz sentido.
- [x] **Fluxo completo em pelo menos 1 dispositivo mobile real** (Landing →
      Quiz → Lead → Resultado) — confirmado, nenhuma tela quebrou o
      single-viewport do design system.

## Critério de Go-Live — atendido

- [x] Todos os gates dos Épicos 1–8 seguem válidos (sem regressão) — suíte
      completa (55 Vitest + 39 Playwright) verde.
- [x] Lighthouse ≥ 90 nas 4 categorias aplicáveis, nas 4 rotas públicas.
- [x] Zero violações críticas de acessibilidade (axe-core).
- [x] Fluxo completo validado manualmente em dispositivo mobile real.
- [x] MailerLite configurado em produção (grupo e campos reais).

**Produto pronto para tráfego real.**

---

## Go-Live da v2 (Épico 13)

Re-execução do checklist acima sobre a v2 (banco de questões novo + motor
de diagnóstico + relatório reconstruído — Épicos 10–12), conforme
`specs/epicos/epico-13-qa-regressao-golive-v2.md`.

### 1. Suíte de testes completa (todos os épicos, sem regressão)

**78 testes Vitest** + **42 testes Playwright**, todos verdes (execução
local; ver seção 6 do épico 9 para o método de execução contra preview).
Cobrem, além de tudo do go-live v1: banco de questões v2 e seleção por
blueprint (Épico 10), motor de diagnóstico — fronteiras de classificação,
fórmula de prioridade, as 1024 combinações de acertos por dimensão, extremos
0/15 e 15/15 (Épico 11), e o relatório completo — 3 personas
(aspirante/baixo, pleno/médio, sênior/alto), impressão, gabarito, matriz
editorial exaustiva (Épico 12).

### 2. Lighthouse — as 4 rotas públicas

O script `scripts/lighthouse-flow-check.mjs` tinha dois bugs que impediam a
medição completa desde a migração para o banco v2: contagem de perguntas
hardcoded na v1 (13, não as 15 do blueprint v2) e um `finally` que engolia
qualquer erro do fluxo sem reportar. Ambos corrigidos neste épico.

Resultado após a correção — **achado real**: a transição `/lead → /resultado`
caiu para Performance 87 (era 92–100 na v1) com o relatório mais pesado do
Épico 12 (dois gráficos Recharts). Corrigido com code-splitting
(`next/dynamic`) do radar e do gráfico de prioridades em
`app/resultado/page.tsx` — First Load JS de `/resultado` caiu de 279KB para
177KB. Resultado final:

| Rota                                                 | Performance | Acessibilidade | Boas práticas | SEO  |
| ---------------------------------------------------- | ----------- | -------------- | ------------- | ---- |
| `/` (navegação completa)                             | 97–99       | 100            | 100           | 100  |
| `/quiz` (navegação completa)                         | 100         | 100            | 100           | 100  |
| transição → `/lead`                                  | 100         | n/a¹           | 100           | n/a¹ |
| `/lead` (snapshot)                                   | n/a¹        | 100            | 100           | 100  |
| transição → `/resultado` (inclui `POST /api/submit`) | 100         | n/a¹           | 100           | n/a¹ |
| `/resultado` (snapshot)                              | n/a¹        | 100            | 100           | 100  |

¹ Ver nota do go-live v1 acima — mesma limitação de cobertura por modo de
coleta do Lighthouse, não é lacuna.

### 3. Acessibilidade (axe-core + teclado + leitor de tela)

- **axe-core (WCAG2AA)**: 0 violações em `/resultado`, incluindo com o
  gabarito aberto (`e2e/resultado-a11y.spec.ts`) — a rota mais alterada
  pelos Épicos 10–12.
- **Contraste**: encontrado e corrigido 1 par abaixo do AA (3.57:1) no texto
  de score geral do cabeçalho do relatório (`text-text-low` →
  `text-text-medium`).
- **Teclado**: fluxo completo (15 perguntas + gabarito) segue 100% operável
  sem mouse.
- **Leitor de tela em `/resultado`**: ⬜ **pendente** — precisa de uma
  pessoa (VoiceOver/TalkBack), mesma limitação já documentada no go-live v1.

### 4. Cross-device (375 / 768 / 1440px)

Zero scroll horizontal nas 4 rotas públicas, incluindo `/resultado` com o
relatório completo (`e2e/cross-device.spec.ts`). **Achado real durante este
épico**: a tabela acessível (`sr-only`) do radar vazava como overflow
horizontal em 375px — a legenda (`<caption>`) herdava `white-space: nowrap`
do `sr-only` e tem regra própria de dimensionamento que ignora
`table-layout: fixed`, escapando da caixa de 1px. Corrigido envolvendo a
tabela num `<div className="sr-only">` em vez de aplicar a classe na
própria `<table>` (`components/result/RadarSection.tsx`).

### 5. Variáveis de ambiente em produção (Vercel)

Confirmado via `vercel env ls production` (inalterado desde o go-live v1):
`MAILERLITE_API_KEY` e `MAILERLITE_GROUP_ID`, ambas Sensitive, em Preview e
Production — nenhuma nova variável introduzida pela v2.

### 6. Telemetria de itens (novo na v2 — AVALIACAO.md §6)

Cada submissão registra, por item respondido, o id e a alternativa
escolhida via log estruturado `[diagnostico]`
(`lib/diagnostico/persist-diagnostico.ts`, Épico 11 — sem PII).
`scripts/item-stats.mjs` (`npm run item-stats`) agrega esses logs em taxa de
acerto e distribuição por alternativa, por item e por nível, com saída CSV.
Testado com um lote de submissões de amostra — funcional. Limiares e
processo de revisão documentados em `docs/metodologia.md` §7.

### 7. MailerLite — segmentação v2

O campo `perfil_tecnico` (já provisionado na conta desde o Épico 7) passa a
carregar a dimensão de maior prioridade de desenvolvimento
(`diagnostico.prioridades[0].category`) em vez do `profileTag` da pergunta
de autoavaliação — removida do banco v2 no Épico 10, o campo ficava sempre
vazio desde então. `classificacao` e `score_geral` já vinham do diagnóstico
v2 desde o Épico 11.

⬜ **Pendente**: confirmação manual, na conta real da MailerLite, de que um
subscriber de teste chega com `perfil_tecnico` preenchido com o slug da
dimensão (ex.: `dados-programacao`) — mesmo padrão de verificação do Épico
7, não executável por este agente (sem acesso à conta).

## Pendências que exigem uma pessoa — v2

- ⬜ **Leitor de tela real** em `/resultado` (o gabarito, o radar e o CTA
  são o conteúdo novo mais relevante a validar).
- ⬜ **Fluxo completo em mobile real**, uma persona por nível (5 execuções)
  — confirmar que o relatório correto aparece e que o lead chega à
  MailerLite com os campos de segmentação v2 preenchidos.
- ⬜ **MailerLite em produção**: confirmar `perfil_tecnico` preenchido
  (ver seção 7 acima).

## Critério de Go-Live da v2 — status

- [x] Todos os gates dos Épicos 1–12 seguem válidos (sem regressão) — 78
      Vitest + 42 Playwright verdes.
- [x] Lighthouse ≥ 90 nas 4 categorias, nas 4 rotas públicas.
- [x] Zero violações críticas de acessibilidade (axe-core), incluindo
      `/resultado`.
- [x] Telemetria de itens ativa e `item-stats` funcional.
- [x] `docs/metodologia.md` criado; specs do banco v2 removidas da raiz
      neste commit (`AVALIACAO.md`, `REPORT.md`, `QUESTIONS.json`,
      `specs/epicos/epico-10..13.md`).
- [ ] Fluxo completo validado manualmente em mobile real, para os 5 níveis
      — **pendente de execução humana**.
- [ ] MailerLite de produção com `perfil_tecnico` v2 confirmado —
      **pendente de execução humana**.

**Produto v2 pronto para tráfego real quanto ao que é verificável por CI/E2E
— as duas pendências acima exigem uma pessoa com acesso a dispositivo móvel
real e à conta MailerLite, e devem ser confirmadas antes de considerar o
go-live da v2 encerrado.**

## Go-Live do Redesign (Épico 19)

Re-execução do checklist acima sobre a migração de identidade completa
(tokens/temas/padrões/assets/páginas do funil/relatório — Épicos 14–18),
agora nos **dois temas**, conforme
`specs/epicos/epico-19-qa-visual-golive.md`.

### 1. Suíte de testes completa (todos os épicos, sem regressão)

**162 testes Vitest** (26 arquivos) + **77 testes Playwright** (11
arquivos), todos verdes. Além de tudo do go-live v2, cobre: tokens/tema
claro-escuro e contraste AA (Épico 14), padrões geométricos e catálogo
`/dev/ui` (Épico 15), manifest/orçamento/paleta de assets gerativos (Épico
16), páginas do funil redesenhadas nos dois temas × 375/768/1440px (Épico
17, `e2e/funnel-visual.spec.ts` — 768px somado neste épico), e o relatório
redesenhado nos dois temas (Épico 18, `e2e/resultado-visual.spec.ts` — 768px
e axe-core em tema escuro somados neste épico).

**Achado real deste épico**: o volume de submissões `/api/submit` da suíte
completa (~20 por rodada, depois de somar cobertura de tema escuro em
`resultado-a11y`/`a11y-all-routes`) passou a colidir com o rate limiter de
produção (`lib/rate-limit.ts`, 10 requisições/60s por IP) — toda a suíte
roda do mesmo IP local, então o volume legítimo de teste era barrado como
se fosse abuso. Corrigido tornando o limite configurável via
`RATE_LIMIT_MAX_REQUESTS`, setado **somente** pelo `webServer.command` do
`playwright.config.ts` (nunca aplicado a um deployment real — o alvo de
`PLAYWRIGHT_BASE_URL`/`test:e2e:remote` continua com o limite de produção
inalterado).

### 2. Lighthouse — as 4 rotas públicas × 2 temas

`scripts/lighthouse-flow-check.mjs` ganhou um segundo argumento de tema
(`light`/`dark`, força `prefers-color-scheme` antes de navegar — o mesmo
sinal que o app usa via `next-themes` com `defaultTheme="system"`). CI
(`lighthouse` job) roda `npm run test:lighthouse:flow`, que agora executa
as duas rodadas.

| Rota                                                 | Performance (claro) | Performance (escuro) | Acessibilidade | Boas práticas | SEO  |
| ---------------------------------------------------- | ------------------- | -------------------- | -------------- | ------------- | ---- |
| `/` (navegação completa)                             | 98                  | 95                   | 100            | 100           | 100  |
| `/quiz` (navegação completa)                         | 100                 | 100                  | 100            | 100           | 100  |
| transição → `/lead`                                  | 100                 | 100                  | n/a¹           | 100           | n/a¹ |
| `/lead` (snapshot)                                   | n/a¹                | n/a¹                 | 100            | 100           | 100  |
| transição → `/resultado` (inclui `POST /api/submit`) | 100                 | 100                  | n/a¹           | 100           | n/a¹ |
| `/resultado` (snapshot)                              | n/a¹                | n/a¹                 | 100            | 100           | 100  |

¹ Mesma limitação de cobertura por modo de coleta do Lighthouse já
documentada nos go-lives anteriores.

**Orçamento de assets sob throttling 4G** (landing, mobile, `throttlingMethod:
'simulate'`): Performance 95, LCP 2.9s (score do audit 0.91 — banda "boa"),
peso total da página 336 KiB. Os 9 assets publicados passam
`assets:verify-manifest`/`assets:verify-palette` (parte do `prebuild` e do
CI) — todo arquivo em `public/img/` dentro do `weightBudgetKb` declarado em
`assets/manifest.json`, nenhum órfão.

### 3. Acessibilidade (axe-core + teclado + leitor de tela) — 2 temas

- **axe-core (WCAG2AA), claro e escuro**: 0 violações nas 4 rotas públicas
  (`e2e/a11y-all-routes.spec.ts` para `/` e `/lead`; suítes próprias para
  `/quiz` e `/resultado`), incluindo `/resultado` com o gabarito aberto —
  cobertura de tema escuro somada neste épico (antes, só claro).
- **Contraste**: `npm run audit:contrast` verde nos dois temas; nenhuma
  falha nova introduzida pelo redesign além das já documentadas com
  substituto em `scripts/audit-contrast.mjs` (`KNOWN_SUBSTITUTES`).
- **Teclado**: fluxo completo (`/` → `/quiz` → `/lead` → `/resultado`,
  incluindo gabarito) 100% operável sem mouse nos dois temas (o
  comportamento de foco não depende de tema, verificado uma vez).
- **Leitor de tela em `/quiz` e `/resultado`**: ⬜ **pendente** — precisa de
  uma pessoa (VoiceOver/TalkBack), mesma limitação já documentada nos
  go-lives anteriores.

### 4. Cross-device (375 / 768 / 1440px) — 2 temas

Zero scroll horizontal nas 4 rotas públicas (`e2e/cross-device.spec.ts`,
inalterado desde o Épico 9). Somado neste épico: regressão visual pixel a
pixel em 768px (tablet) para Landing/Quiz/Lead
(`e2e/funnel-visual.spec.ts`) e para `/resultado`
(`e2e/resultado-visual.spec.ts`) — antes só 375/1440px cobriam screenshot,
768px só tinha a checagem funcional de overflow.

### 5. Auditoria de marca (REDESIGN.md §2 / DESIGN.md §10)

- `npm run lint:colors` — zero cores hardcoded fora dos tokens.
- `npm run lint:patterns` — zero peças combinando mais de um padrão
  geométrico fora da exceção documentada do certificado (ver
  `docs/design-system.md` §3).
- Amber restrito a conquista real: varredura manual de todo uso de
  `amber`/`Amber`/`achievement` no código — a única exceção fora do selo
  "Alto" é o badge `attention` (Épico 18, texto/borda Amber-700/300 para
  "ponto de atenção" de dimensão), decisão de marca documentada e
  deliberada (nunca `destructive`: resultado baixo é mapa de
  desenvolvimento, não erro), não um vazamento acidental.
- Space Mono em todo número que é métrica: confirmado em score-geral,
  progresso do quiz, N/total dos cards de dimensão, prioridades e termos de
  código do gabarito (`font-data`/`font-mono`, ambos resolvem para
  `--font-space-mono`).
- Checklist editorial `DESIGN.md` §10 sobre todo o conteúdo do produto
  (`content/*.ts` + strings literais em `components/result/*.tsx`,
  `app/**/*.tsx`): nenhuma promessa de promoção/salário, nenhum emoji em
  material técnico, nenhum nome comercial em inglês, nenhuma frase
  condescendente — a única violação encontrada em todo o processo do
  redesign (`"Impacto na sua promoção"`) já foi corrigida no Épico 18 (PR
  #24); esta varredura final não encontrou nenhuma nova.

### 6. Variáveis de ambiente em produção (Vercel)

Inalterado desde o go-live v2 — nenhuma variável nova introduzida pelo
redesign (tokens/padrões/assets são todos build-time ou estáticos em
`public/`, sem chave de API nova).

## Pendências que exigem uma pessoa — Redesign

- ⬜ **Leitor de tela real** em `/quiz` e `/resultado`, nos dois temas — a
  mesma pendência dos go-lives anteriores, agora dobrada por tema.
- ⬜ **Fluxo completo em mobile real**, nos dois temas — confirmar que
  nenhuma tela quebra o single-viewport e que o tema persiste entre rotas
  em um dispositivo físico, não só emulação de viewport/`prefers-color-scheme`.

## Critério de Go-Live do Redesign — status

- [x] Todos os gates dos Épicos 1–18 seguem válidos (sem regressão) — 162
      Vitest + 77 Playwright verdes.
- [x] Lighthouse ≥ 90 nas 4 categorias, nas 4 rotas, nos 2 temas.
- [x] Zero violações críticas de acessibilidade (axe-core) nas 4 rotas × 2
      temas.
- [x] Auditoria de marca verde (lint + checklist §7) com evidências acima.
- [x] `docs/design-system.md` criado; `REDESIGN.md` e
      `specs/epicos/epico-14..19.md` removidos da raiz neste commit (mesmo
      padrão do go-live v2 com `AVALIACAO.md`/`REPORT.md`/`QUESTIONS.json`
      — `DESIGN.md` e `design/tokens.json` **não** são removidos: são SSOT
      vivos, não spec temporária).
- [ ] Fluxo completo validado manualmente em mobile real, nos 2 temas —
      **pendente de execução humana**.
- [ ] Leitor de tela real em `/quiz` e `/resultado` — **pendente de
      execução humana**.

**Redesign pronto para tráfego real quanto ao que é verificável por CI/E2E
— as duas pendências acima exigem uma pessoa com acesso a dispositivo móvel
real e a um leitor de tela real, e devem ser confirmadas antes de
considerar o go-live do redesign encerrado.**

## Go-Live do Refinamento Anti-Genérico + SEO/Analytics (Épicos 20-21)

Re-execução do checklist sobre o refinamento visual (hero, bento de
evidência, banda Deep Forest, faixa de números, eyebrows, componentes com
assinatura — Épico 20) e a ativação de SEO técnico + GA4/Meta Pixel com
consentimento LGPD (Épico 21), conforme `_insumos/epico-20-refinamento-
anti-generico.md` e `_insumos/epico-21-seo-analytics-pixel.md` (removidos
neste commit — ver regra permanente no topo do prompt original do ciclo).

### 1. SSOTs e pipeline de tokens

`DESIGN.md` substituído pela v1.1 (§4.3–§4.6) e `design/tokens.json` pela
v1.2.0 — **mesclados manualmente**, não sobrescritos: o `tokens.json`
fornecido pelo founder não incluía os tokens de contraste AA dos Épicos
14/15/18 (`errorText`, `achievementForeground`, `linkForeground`,
`attentionText`, `progressBar`, `progressTrack`) e revertia
`theme.light.secondary`/`theme.dark.primary` de Grove-700 para Grove-500 —
a mesma falha de contraste (3.16:1) já corrigida no Épico 14. A v1.2.0
final no repo preserva todos os tokens da v1.1.0 real (não a v1.1.0
assumida pelo arquivo do founder) e só acrescenta os campos novos.
`npm run check:tokens-additive` (novo, parte do `prebuild`) prova isso
automaticamente contra `design/archive/tokens-v1.1.0.json`. Paleta
primária (Forest/Grove/Amber) confirmada intocada por diff de hexes.

### 2. Suíte de testes completa (todos os épicos, sem regressão)

**189 testes Vitest** (35 arquivos) + **81 testes Playwright** (12
arquivos, incluindo `e2e/consent.spec.ts`, novo), todos verdes. Além de
tudo dos go-lives anteriores, cobre: aditividade de tokens
(`check-tokens-additive.test.ts`), camada de tracking e sanitização de PII
(`analytics-track.test.ts`), consentimento (`analytics-consent.test.ts`),
a regressão real do `tailwind-merge` descrita abaixo
(`cn-typography-scale.test.ts`), evidência da landing sem vazamento de
gabarito (`landing-evidence.test.ts`), e o fluxo de consentimento
completo por interceptação de rede (`e2e/consent.spec.ts`).

**Achados reais corrigidos durante este épico** (nenhum estava presente
antes das mudanças deste ciclo):

- `tailwind-merge` descartava silenciosamente qualquer classe de
  `typography.scale` (`text-eyebrow`, `text-data-xl` etc.) combinada com
  uma cor de texto no mesmo `cn()` — o componente `Eyebrow` renderizava
  sem nenhuma propriedade do token, só a cor sobrevivia. Corrigido em
  `lib/utils.ts`, registrando essas classes num grupo próprio do
  `tailwind-merge` (derivado de `design/tokens.json`, não uma lista
  solta) — coberto por teste que varre toda a escala.
- O `ConsentBanner` novo, fixo no rodapé, colidia visualmente com o botão
  "Próxima" no viewport único de `/quiz` (`h-dvh`, sem scroll por
  design) — bloqueava cliques e derrubava a suíte E2E inteira em
  cascata. Corrigido escondendo o banner em `/quiz`/`/lead`.
- Trocar a `CardTitle` (um `<div>`) por um `<h1>` de verdade em
  `QuestionCard`/`LeadForm` (higiene técnica do Épico 21 — nenhuma das
  duas rotas tinha `h1`) quebrou o seletor `[data-slot="card-title"]`
  usado por vários specs E2E — preservado no `<h1>`.

### 3. Lighthouse — as 4 rotas públicas × 2 temas

`scripts/lighthouse-flow-check.mjs` ganhou dois ajustes para o Épico 21:
SEO da home agora exige ≥ 95 (não só ≥ 90), e SEO deixou de ser gate nas 3
rotas `noindex` (`/quiz`, `/lead`, `/resultado`) — cobrar SEO ali
contradiria a própria regra de indexação que o épico pede, já que o audit
`is-crawlable` do Lighthouse reprova qualquer página `noindex` por
definição. O score continua impresso nas 3 rotas (visibilidade), só não
falha o build.

| Rota                                                 | Performance (claro) | Performance (escuro) | Acessibilidade | Boas práticas | SEO                        |
| ---------------------------------------------------- | ------------------- | -------------------- | -------------- | ------------- | -------------------------- |
| `/` (navegação completa)                             | 95                  | 95                   | 100            | 100           | 100 (≥ 95 exigido)         |
| `/quiz` (navegação completa)                         | 100                 | 100                  | 100            | 100           | 63 (noindex — não é gate)  |
| transição → `/lead`                                  | 100                 | 100                  | n/a¹           | 100           | n/a¹                       |
| `/lead` (snapshot)                                   | n/a¹                | n/a¹                 | 100            | 100           | 100 (noindex — não é gate) |
| transição → `/resultado` (inclui `POST /api/submit`) | 100                 | 100                  | n/a¹           | 100           | n/a¹                       |
| `/resultado` (snapshot)                              | n/a¹                | n/a¹                 | 100            | 100           | 100 (noindex — não é gate) |

¹ Mesma limitação de cobertura por modo de coleta do Lighthouse já
documentada nos go-lives anteriores.

### 4. Acessibilidade, cross-device e auditoria de marca

- **axe-core (WCAG2AA)**: 0 violações nas 4 rotas × 2 temas, incluindo
  `/resultado` com o gabarito aberto e a nova banda Deep Forest da S5
  (`PriorityCareerSkills`) — texto sobre a banda usa cores fixas
  Chalk/Grove-300 (nunca as variáveis de tema, que resolveriam para o
  texto do modo claro sobre um fundo sempre escuro).
- **Cross-device (375/768/1440px)**: zero scroll horizontal nas 4 rotas,
  nos 2 temas — inclui a correção do banner de consentimento acima.
- `npm run lint:colors` — estendido neste épico para banir também classes
  Tailwind de cinza default de framework (`text-gray-500` etc.), não só
  literais hex (DESIGN.md v1.1 §4.5) — zero ocorrências.
- `npm run lint:patterns` — zero peças combinando mais de um padrão.
- Varredura manual dos anti-padrões §4.5 nas 4 rotas: zero grid de cards
  idênticos remanescente (a seção de dimensões da landing virou bento de
  evidência real do produto), zero sombra/gradiente/glassmorphism
  default, zero emoji como ícone de feature, radius só do token scale.
- Checklist de assinaturas §4.4: hero da landing usa as 3 obrigatórias
  (eyebrow, palavra-acento itálica em "finanças", marcador Grove sob
  "nível"); as 4 rotas usam ≥ 3 assinaturas cada (eyebrow em toda seção +
  pelo menos mais duas: bento/faixa de números/banda na landing, cards
  com assinatura + eyebrow em quiz/lead/resultado).

### 5. Analytics e consentimento LGPD

- **Consentimento**: `e2e/consent.spec.ts` prova por interceptação de
  rede que nenhuma requisição sai para `googletagmanager.com` ou
  `facebook.net` antes do aceite; que aceitar carrega os dois scripts e a
  escolha persiste entre reloads; que recusar mantém zero requisições e
  também persiste; e que nenhum payload de evento do funil real
  (varredura ao vivo do fluxo `/` → `/quiz`) carrega formato de PII.
- **Taxonomia**: `quiz_start`, `question_answered`, `quiz_complete`,
  `lead_submitted` (`generate_lead`/`Lead` — evento padrão nas duas
  plataformas), `report_viewed`, `cta_offer_click`, `radar_shared` — todos
  disparados só via `track()` (`lib/analytics/track.ts`), nunca `gtag`/
  `fbq` direto nos componentes.
- **IDs reais fornecidos pelo founder** (GA4 `G-H0NTV61JS6`, Meta Pixel
  `852035937455815`) — entram só como variável de ambiente na Vercel
  (`NEXT_PUBLIC_GA_MEASUREMENT_ID`/`NEXT_PUBLIC_META_PIXEL_ID`), nunca no
  git. Testados localmente com IDs falsos (`playwright.config.ts`
  `webServer.env` — nunca aplicado a um deployment real).

### 6. SEO técnico

- `/` indexável, canonical explícito, JSON-LD `Organization`+`WebSite`.
- `/quiz`, `/lead`, `/resultado`: `metadata.robots: noindex` (confirmado
  por inspeção do HTML renderizado) + `app/robots.ts` (disallow
  explícito, defesa em profundidade) — nenhuma das três aparece em
  `app/sitemap.ts`.
- `lang="pt-BR"` (já existia), 1 `h1` por rota (`/quiz` e `/lead` não
  tinham nenhum — achado real, corrigido preservando o seletor de teste
  `data-slot="card-title"` no `<h1>` novo).
- Página `/privacidade` nova, linkada no banner de consentimento —
  conteúdo restrito ao que é verificável neste repositório (o que a
  aplicação de fato coleta e por quê); identificação legal da Syntaxis e
  canal formal de contato/DPO ficam pendência do founder (abaixo).

### 7. Variáveis de ambiente em produção (Vercel) — o que muda

Duas variáveis novas, `NEXT_PUBLIC_*` (client-side por design, não são
segredo — ver `.env.example`): `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
`NEXT_PUBLIC_META_PIXEL_ID`. Nenhuma outra variável introduzida.

## Pendências que exigem uma pessoa — Épicos 20-21

- ⬜ **Domínio final do app** — o fluxo GA4 fornecido pelo founder aponta
  para `syntaxis.com.br`, mas o app está em `skill-test-mocha.vercel.app`.
  Definir o domínio final (ex.: `skillcheck.syntaxis.com.br`), configurá-lo
  na Vercel, e confirmar que o stream GA4/Pixel passam a medir o domínio
  real — medir só o domínio de preview/Vercel invalida os dados de
  produção. `lib/site-url.ts` já resolve automaticamente para o domínio
  ativo assim que a variável de ambiente da Vercel apontar para ele.
- ⬜ **Configurar `NEXT_PUBLIC_GA_MEASUREMENT_ID`/`NEXT_PUBLIC_META_PIXEL_ID`
  reais na Vercel** (Production) com os IDs fornecidos pelo founder — ver
  `.env.example`. Sem isso, os scripts nunca montam mesmo com
  consentimento aceito (mesmo comportamento intencional do ambiente de
  teste, que usa IDs falsos).
- ⬜ **Validação nas plataformas, pós-deploy no domínio final**: GA4
  Realtime/DebugView e Meta Test Events mostrando o funil completo; o
  aviso "a coleta de dados não está ativa" do GA4 precisa desaparecer
  (só resolve depois de tráfego real no domínio certo, tipicamente 24-48h).
- ⬜ **Google Search Console**: verificar a propriedade do domínio final,
  submeter `sitemap.xml`, confirmar que só `/` aparece indexável em
  `site:` e na Inspeção de URL.
- ⬜ **Rich Results Test** (JSON-LD `Organization`+`WebSite`) contra o
  domínio final — não validável contra `localhost`/preview.
- ⬜ **Canal de contato formal (DPO/LGPD)** para `/privacidade` — o texto
  atual marca isso como "a definir pelo founder" em vez de inventar um
  contato.
- ⬜ **Leitor de tela real** e **mobile real**, nos 2 temas — mesma
  pendência recorrente dos go-lives anteriores, agora incluindo o bento
  de evidência da landing e a banda Deep Forest de `/resultado`.

### Passo a passo: configurar GA4/Meta Pixel na Vercel

1. **Vercel → Project → Settings → Environment Variables**: adicionar
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` (`G-H0NTV61JS6`) e
   `NEXT_PUBLIC_META_PIXEL_ID` (`852035937455815`) em **Production**
   (deixar em branco em Preview, de propósito — ver `.env.example`).
   Como são `NEXT_PUBLIC_*`, ficam embutidas no bundle **no momento do
   build** — salvar as variáveis e então gerar um novo deploy (redeploy
   do commit atual, ou qualquer novo merge) para elas valerem.
2. **Vercel → Project → Settings → Domains**: apontar o domínio final
   (o stream do GA4 já está configurado para `syntaxis.com.br`, mas o
   app está em `skill-test-mocha.vercel.app`) — medir só o domínio de
   preview/`.vercel.app` invalida os dados de produção.
3. Confirmar em uma aba anônima que nada carrega antes do aceite: nenhuma
   requisição para `googletagmanager.com`/`connect.facebook.net` até
   clicar "Aceitar" no banner (`components/analytics/ConsentBanner.tsx`).
4. **GA4** → Admin → DebugView/Realtime e **Meta** → Events Manager →
   Test Events: navegar o funil completo e confirmar `quiz_start`,
   `question_answered`, `quiz_complete`, `lead_submitted`,
   `report_viewed` (o aviso "coleta de dados não está ativa" do GA4 some
   só depois de tráfego real no domínio certo, tipicamente 24-48h).
5. **Search Console**: verificar a propriedade do domínio final, submeter
   `sitemap.xml` (`/sitemap.xml`, gerado pelo framework), confirmar que
   só `/` aparece indexável.

Vercel Web Analytics e Speed Insights (`@vercel/analytics`/
`@vercel/speed-insights`) não precisam de nenhuma variável — ativam
automaticamente assim que o código está em produção na Vercel; conferir
as abas **Analytics**/**Speed Insights** do projeto alguns minutos após
o deploy.

## Critério de Go-Live — Épicos 20-21 — status

- [x] Todos os gates dos Épicos 1–19 seguem válidos (sem regressão) — 189
      Vitest + 81 Playwright verdes.
- [x] Lighthouse ≥ 90 (performance/a11y/boas práticas) nas 4 rotas × 2
      temas; SEO ≥ 95 na home nos 2 temas; SEO informativo (não-gate) nas
      3 rotas noindex, por design.
- [x] Zero violações críticas de acessibilidade (axe-core) nas 4 rotas × 2
      temas.
- [x] Checklist de assinaturas §4.4 e varredura de anti-padrões §4.5 verde
      nas 4 rotas, com evidências acima.
- [x] Aditividade de `design/tokens.json` v1.2.0 provada automaticamente
      (`npm run check:tokens-additive`).
- [x] Consentimento LGPD funcional, com prova E2E de que nada carrega sem
      aceite, e zero PII em qualquer payload de evento (revisão + teste).
- [x] Regras de indexação (só `/` indexável), sitemap, robots e JSON-LD
      implementados e verificados localmente.
- [ ] Domínio final configurado e stream GA4/Pixel medindo produção —
      **pendente do founder**.
- [ ] Validação em produção (GA4 DebugView, Meta Test Events, Search
      Console, Rich Results Test) — **pendente, depende do domínio final**.
- [ ] Fluxo completo em mobile real e leitor de tela real, nos 2 temas —
      **pendente de execução humana**.

**O refinamento visual e a instrumentação de SEO/analytics estão prontos
para tráfego real quanto ao que é verificável por CI/E2E. As pendências
acima — todas explicitamente fora do alcance de um agente sem acesso a
DNS/Vercel/contas de analytics reais ou a um dispositivo físico — exigem
uma pessoa antes de considerar este ciclo encerrado.**

## Go-Live do Design v2.0 (Épico 22)

Segunda rodada de refinamento visual por decisão do founder: três mudanças
estruturais — Amber sai, entra **Lime** como cor de ação/conquista (Forest
e Grove intocados); **cantos retos** em todo o sistema (radius 0–2px,
hairlines no lugar de sombra); tipografia migra para **Space Grotesk**
(display) + **Hanken Grotesk** (corpo), Space Mono mantida — conforme
`_insumos/epico-22-design-v2-lime-cantos-retos.md` (removido neste ciclo,
mesma regra permanente dos ciclos anteriores).

### 1. SSOTs e relatório de breaking changes

`DESIGN.md` substituído pela v2.0 e `design/tokens.json` pela v2.0.0 —
mesclado manualmente, não sobrescrito: o arquivo do founder, como o de
v1.2.0 antes dele, não incluía os tokens de contraste AA dos Épicos
14/15/18/20 (`errorText`, `progressBar`/`progressTrack`,
`linkForeground`, `achievementForeground`, `attentionText`) — preservados
byte a byte onde não têm relação com Amber/Lime; os dois últimos migrados
para a escala lime na mesma posição relativa que ocupavam na escala amber.

**Achado real do processo de merge**: o `tokens.json` v2.0.0 bruto do
founder também revertia `color.theme.light.secondary` e
`color.theme.dark.primary` de Grove-700 para Grove-500 — a mesma
regressão de contraste do Épico 14, não declarada no changelog e sem
nenhuma relação com as três mudanças estruturais do épico. Pego por
`scripts/check-tokens-breaking.mjs` (novo — substitui
`check-tokens-additive.mjs`: a v2.0.0 é um bump MAIOR declarado, "zero
diff" deixa de ser a regra, vira "só o que está na allowlist derivada do
changelog"), com uma guarda extra que falha o build se qualquer token de
Forest/Grove/neutro/semântico-de-feedback aparecer no diff — exatamente o
critério de aceite do épico.

### 2. Varredura completa

- **Amber → Lime**: CTA primário (`bg-lime-500 text-neutral-ink`, fixo
  nos dois temas — Grove sai dos botões preenchidos), selo de conquista
  (`shadow-lime`), marcador de headline (`MarkerHighlight`, sem mais
  variante `achievement` separada — lime já É conquista), eyebrow sobre
  banda/dark (`lime-300`, era `grove-300`), linha de conquista
  (`stroke-linejoin: miter`, acompanhando os cantos retos).
- **Cantos retos**: todo `rounded-lg/xl/md/pill/4xl` do sistema migrado
  para `rounded-none`/`rounded-sm` (2px máximo) — cards, botões, inputs,
  badges, accordion, dialog, progress bar. Sombra sai do Card como
  padrão (hairline faz o trabalho). Duas exceções documentadas em código:
  avatares/logo (nenhum no app hoje) e o círculo do `RadioGroup`
  (achatá-lo o tornaria indistinguível de um checkbox no quiz de
  alternativa única).
- **Hairlines estruturais** (assinatura nova, §4.4.3): divisor vertical
  no hero entre texto e imagem de evidência; seção dedicada no catálogo
  `/dev/ui`.
- **Tipografia**: `next/font` troca DM Serif Display/DM Sans por Space
  Grotesk/Hanken Grotesk; todo itálico de display removido do app
  (Space Grotesk não tem itálico) — incluindo o Canvas 2D do card
  compartilhável (`ShareRadarButton`) e o `opengraph-image.tsx`, que
  buscam as fontes via Google Fonts API em build time.

### 3. Lint estendido em CI

`scripts/lint-hardcoded-colors.mjs` passa a banir também classes
Tailwind sobre as escalas Amber/Cream (mesmo mecanismo que já bane
cinzas de framework). `scripts/lint-radius.mjs` (novo): bane todo
`rounded-*` fora de `none`/`sm`, com as duas exceções acima explicitamente
documentadas em código — já pegou uma ocorrência real
(`DialogFooter` com `rounded-b-xl` esquecido) antes de chegar a um commit.

### 4. Auditoria de contraste do lime

`scripts/audit-contrast.mjs` ganha a seção "Regras duras do Lime": pares
fixos (`lime-500`/`lime-300` × Ink, Chalk × `lime-700`, Deep Forest ×
`lime-300`, e o par que prova que `lime-500` nunca deve passar como texto
pequeno sobre claro) auditados a cada execução — verde, com margem
folgada em todos os pares reais (4.41:1–15.75:1); o único par abaixo de
4.5:1 é o uso gráfico (traço da linha de conquista sobre claro), que só
precisa do limiar de UI (3:1) e passa.

### 5. Assets generativos

Inventário dos 9 assets publicados contra seus pares `duotone`: nenhum
usa Amber ou Cream — todos usam Forest/Grove/Chalk/Mint/Deep Forest.
Decisão registrada no próprio `assets/manifest.json`: nenhum recolor ou
regeração necessário neste ciclo. `assets/prompts/_brand-block.md`
(bloco-padrão injetado em todo prompt do pipeline) atualizado para os
hexes lime e a instrução "cantos retos" em qualquer asset gerado daqui
para frente.

### 6. Suíte de testes e Lighthouse

**189 testes Vitest** + **81 testes Playwright** (incluindo axe-core
WCAG2AA nas 4 rotas × 2 temas, zero violações críticas/sérias), todos
verdes numa rodada limpa sem `--update-snapshots`, depois de regravar o
baseline visual do funil e do relatório (esperado: cor/radius/tipografia
mudaram em toda a superfície do produto). `npm run build` limpo. Lighthouse
(`test:lighthouse:flow`): Performance 98–100, Accessibility 100, Best
Practices 95–96, SEO 100 na home (≥ 95 exigido) — nas 4 rotas × 2 temas,
a troca de fontes não degradou LCP.

## Pendências que exigem uma pessoa — Épico 22

- ⬜ **Revisão visual manual do founder** — mobile real + desktop, dois
  temas, lado a lado com as referências que motivaram o ciclo. Este é o
  **gate final do próprio épico**, definido como humano por natureza
  (`epico-22`, "Gate — critério de conclusão"): nenhuma verificação
  automatizada substitui a aprovação de que o resultado bate com a
  referência visual aprovada.
- ⬜ **Leitor de tela real** e **mobile real** nos 2 temas — mesma
  pendência recorrente dos go-lives anteriores.

## Critério de Go-Live — Épico 22 — status

- [x] SSOTs v2.0/v2.0.0 no repo; relatório de breaking changes
      coincidente com o changelog (`npm run check:tokens-breaking`).
- [x] Zero Amber/Cream/fontes antigas; zero radius fora do sistema
      (`npm run lint:colors`, `npm run lint:radius`).
- [x] Auditoria de contraste do lime verde, relatório versionado
      (`design/contrast-report.md`).
- [x] Zero regressões: 189/189 Vitest, 81/81 Playwright (axe-core
      incluído), Lighthouse ≥ 90 em todas as categorias aplicáveis.
- [ ] **Revisão visual manual do founder** — **pendente de execução
      humana**, gate final do épico.
- [ ] Leitor de tela real e mobile real, nos 2 temas — **pendente de
      execução humana**.

**O Design v2.0 está pronto para tráfego real quanto ao que é verificável
por CI/E2E — cor, radius e tipografia migrados de ponta a ponta, com
prova automatizada de que nenhuma mudança fora do declarado no changelog
passou despercebida. A aprovação visual do founder contra as referências
originais é o gate final e exige uma pessoa.**
