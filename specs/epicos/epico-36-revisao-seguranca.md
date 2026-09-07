# ÉPICO 36 — Revisão de segurança

**Depende de:** nenhum. Independente dos Épicos 33/34/35 (PRs abertos).

**Origem:** pedido direto do founder — revisão de segurança do app inteiro.

## Método

Varredura dirigida por área de risco real (não um checklist genérico): dependências
(`npm audit`), segredos e variáveis de ambiente, rotas de API (validação de entrada, rate
limit, injeção), cabeçalhos de resposta HTTP, vetores de XSS (`dangerouslySetInnerHTML`),
exposição de dado sensível ao client, tracking/analytics e PII. Cada achado foi verificado
antes de virar item — inclusive um que eu suspeitava e descartei depois de checar a
documentação da Vercel (ver Achado 5).

## Achados corrigidos nesta rodada (2)

### 1. Nenhum cabeçalho de segurança configurado

`next.config.ts` não definia `headers()` — nem `X-Content-Type-Options`, nem
`X-Frame-Options`, nem `Referrer-Policy`, nem `Permissions-Policy`, nem
`Strict-Transport-Security`. Adicionados os cinco em `next.config.ts`, escopados para
`/:path*`. Verificado contra o servidor de produção real (`next start` + `curl -I`) — os
cinco chegam na resposta. Suíte e2e completa (`full-flow-resultado.spec.ts`, 6/6) rodada
contra o servidor com os headers ativos, sem regressão.

`Content-Security-Policy` fica **fora** desta lista, de propósito — ver Achado 3.

### 2. Duas vulnerabilidades de dependência corrigíveis sem breaking change

`npm audit` apontou 5 vulnerabilidades (1 moderada, 4 altas). Duas — `fast-uri` (host
confusion/SSRF via normalização de IDN/IPv6) e `qs` (bypass de limite de array, DoS via
`isBuffer`) — tinham fix não-breaking via `npm audit fix`. Aplicado; só `package-lock.json`
mudou (bump transitivo), `package.json` intocado. `npm test` (192/192), lint, typecheck e
build seguem verdes.

## Achados registrados, não corrigidos nesta rodada — decisão do founder

### 3. CSP não implementado — decisão de arquitetura, não esquecimento

GA4 e Meta Pixel (`components/analytics/AnalyticsProvider.tsx`) rodam via `<Script>` com
conteúdo inline (`ga4-init`, `meta-pixel-init`). Um CSP estrito bloquearia esses dois
scripts. Duas opções, nenhuma implementada aqui:

- **`'unsafe-inline'` em `script-src`** — rápido, mas esvazia boa parte do valor do CSP
  contra XSS (a proteção mais importante que CSP oferece é justamente barrar script inline
  injetado).
- **Nonce por requisição via `middleware.ts`** — correto, mas é mudança estrutural (não um
  array estático em `next.config.ts`): gerar o nonce por request, passar para os `<Script
  nonce={...}>`, e listar os domínios exatos de coleta do GA4/Meta (não só
  `googletagmanager.com`/`connect.facebook.net`, mas os endpoints de coleta,
  ex. `google-analytics.com`, `facebook.com/tr`).

Não decidi por nenhuma das duas — é escolha do founder, não algo para inferir dentro de uma
lista de headers.

### 4. Duas vulnerabilidades de dependência exigem major do Next.js

`postcss` (XSS em stringify de CSS, leitura arbitrária de arquivo via `sourceMappingURL`) e
`sharp` (CVEs herdadas da libvips) só corrigem via `npm audit fix --force`, que instala
`next@16.3.4` — major breaking change, fora do escopo de uma correção de segurança pontual.

**Exploração real, verificada:** `sharp` só é usado em `scripts/` (`process-asset-core.mjs`,
`verify-asset-palette.mjs`) — pipeline de asset em build/dev time, processando arquivos do
próprio repositório, nunca imagem enviada por usuário em runtime. As CVEs de libvips
exigem imagem maliciosa como entrada; não há rota que aceite upload de imagem. Risco real
baixo, apesar da severidade alta reportada. `postcss` é dependência transitiva do próprio
Next.js (`next/node_modules/postcss`) — risco de build-tooling, não de rota exposta a
usuário anônimo (este app não processa CSS arbitrário de terceiro em runtime).

Decisão registrada: **não upgrade agora**. Reavaliar quando o Next 16 upgrade entrar em
pauta por outro motivo (épico próprio, com o mesmo rigor de teste que qualquer major bump
merece).

### 5. `getClientIp`/`x-forwarded-for` — suspeita levantada e descartada

Hipótese inicial: `getClientIp` (`lib/rate-limit.ts`) confia no primeiro valor de
`x-forwarded-for`, que em muitos setups é o primeiro elo de uma cadeia que o **cliente**
pode forjar. Verificado contra a documentação oficial da Vercel
(`vercel.com/docs/headers/request-headers`) antes de reportar como achado: **a Vercel
sobrescreve `x-forwarded-for` e não repassa IP externo** — spoofing por esse vetor exigiria
permissão Enterprise de "Trusted Proxy" (não é o caso deste projeto, plano hobby). **Não é
um achado real nesta plataforma de deploy.** Registrado aqui só para não ser
re-investigado do zero numa rodada futura.

### 6. Rate limiting é por instância, não distribuído (já documentado no código)

`lib/rate-limit.ts` já registra a limitação: o `Map` em memória não é compartilhado entre
instâncias serverless da Vercel — um atacante distribuído entre regiões/instâncias frias
efetivamente vê um limite mais alto que o nominal (10 req/janela). Não é um achado novo;
confirmando que continua sem correção e listando o caminho já apontado no próprio código
(store compartilhado, ex. Upstash Redis) **só quando o abuso real justificar** — implementar
isso hoje seria infraestrutura especulativa sem sinal de abuso real.

### 7. Sem verificação de propriedade de e-mail antes de disparar sync/e-mail via MailerLite

`/api/submit` e `/api/resend-report` aceitam um e-mail auto-declarado (validado só quanto ao
formato) e chamam `syncLeadToMailerLite`, que atualiza campos do subscriber — e, pelo
comentário do próprio código, isso **dispara uma automação de e-mail** configurada no painel
MailerLite. Não há passo de confirmação (double opt-in) antes disso. Um agente anônimo pode,
dentro do rate limit (10 req/min/IP), inserir e-mails de terceiros na lista e/ou provocar o
envio de um e-mail não solicitado para um endereço que não é o dele.

**Severidade real depende de uma configuração fora deste código** — se o grupo MailerLite já
exige double opt-in na própria conta, o impacto se limita a um e-mail de confirmação (baixo);
se não exige, o impacto é maior (spam attribuído ao domínio da Syntaxis). **Pergunta para o
founder, não assumida aqui:** o grupo `SYNTAXIS_SKILL_APP` na MailerLite já exige double
opt-in?

### 8. Prático, fora do código: rotacionar `MAILERLITE_API_KEY`

Durante uma sessão anterior deste mesmo assistente, o conteúdo de `.env.local` (incluindo
`MAILERLITE_API_KEY` e um `VERCEL_OIDC_TOKEN`) apareceu uma vez na saída de um comando de
diagnóstico, dentro da transcrição da conversa. O arquivo em si nunca foi commitado
(confirmado: `.env*` no `.gitignore`, `git ls-files` só lista `.env.example`) — mas por
cautela, recomendo rotacionar a API key da MailerLite. `VERCEL_OIDC_TOKEN` já é
de curta duração por design da Vercel, não precisa de ação.

## O que foi verificado e está correto (sem achado)

| Área | Verificação |
| --- | --- |
| Segredos no git | `.env.local` nunca commitado; `MAILERLITE_API_KEY` nunca prefixada `NEXT_PUBLIC_`, usada só em código server-side (`lib/mailerlite.ts`, chamado só de Route Handlers) |
| Validação de entrada | `/api/submit` recomputa o gabarito no servidor a partir de `content/questions.json` — client nunca é fonte de verdade sobre resposta correta, elegibilidade de pergunta por senioridade, ou integridade da sessão (contagem exata por dimensão) |
| XSS | Único `dangerouslySetInnerHTML` do app (`app/page.tsx`, JSON-LD) é conteúdo 100% estático, sem entrada de usuário |
| PII em log | `persistDiagnostico` explicitamente nunca grava nome/e-mail; `track()` tem bloqueio de chave de PII em runtime para eventos de analytics |
| Consentimento (LGPD) | GA4/Meta Pixel só montam depois de `getConsent() === 'granted'` — nenhuma chamada de rede antes do aceite (testado, `e2e/consent.spec.ts`) |

## Escopo

- `next.config.ts` — headers de segurança
- `package-lock.json` — bump transitivo (`npm audit fix`)

**Fora de escopo, deliberadamente:** CSP (achado 3), upgrade do Next.js (achado 4), store de
rate limit distribuído (achado 6), fluxo de verificação de e-mail (achado 7) — todos exigem
decisão do founder ou mudança estrutural maior que uma correção de segurança pontual deveria
carregar.

## Critérios de aceite

- `curl -I` contra o build de produção mostra os 5 headers.
- `npm audit` reporta só as 2 vulnerabilidades que exigem major do Next (registradas, não
  corrigidas).
- `npm test`, lint, typecheck, build verdes; suíte e2e completa sem regressão nova (as 2
  falhas de `consent.spec.ts` são pré-existentes ao ambiente sandbox, confirmado rodando o
  mesmo teste contra o código sem a mudança deste épico — mesma falha, mesma linha).
