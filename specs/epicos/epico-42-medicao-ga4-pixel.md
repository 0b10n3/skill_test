# ÉPICO 42 — Medição: GA4, Meta Pixel e atribuição

**Depende de:** Épico 41.

**Origem:** pedido do founder de 13/11/2026 ("garanta que o pixel e o Google Analytics estejam
corretamente configurados"). Achados M1–M9 de `revisao-2026-11-ui-ux.md`.

**Autorização de escopo:** o founder pediu esta revisão de forma explícita. Este épico pode
alterar `components/analytics/`, `lib/analytics/` e `e2e/consent.spec.ts`. **MailerLite continua
fora de escopo**: nada em `lib/mailerlite.ts`, `app/api/submit`, `app/api/resend-report` ou
`leadSchema`.

## Objetivo

Cada plataforma recebe exatamente um evento por ação real, com o ID certo, e a inscrição no
Substack vinda do app passa a ser atribuível.

## Estado medido em 13/11/2026

- Produção responde em `https://skill.syntaxis.com.br`, com canonical correto.
- O bundle de produção inicializa GA4 `G-H0NTV61JS6` e Meta Pixel `2151084515475904`.
- Funil local com IDs falsos: `page_view` (/) → `page_view` (/quiz) → `quiz_start` → 15×
  `question_answered` → `quiz_complete` → `page_view` (/lead) → `generate_lead` →
  `report_viewed` → `page_view` (/resultado). Consentimento chega como concedido.
- Com ID falso, o `fbevents.js` não dispara nenhum evento e o GA4 não recebe a configuração do
  fluxo real. Por isso M2 e M3 só se confirmam com os IDs reais (tarefa 1).

## Tarefas

### 1. Verificação de contagem com os IDs reais, sem enviar nada

Criar `e2e/analytics-count.spec.ts`, que só roda com `ANALYTICS_REAL_IDS=1` (fora disso,
`test.skip`). O teste:

- **aborta** toda requisição para `*.google-analytics.com`, `*.analytics.google.com`,
  `*.doubleclick.net` e `*.facebook.com`, registrando cada uma. Nada chega às plataformas;
- **deixa passar** `www.googletagmanager.com/gtag/js` e `connect.facebook.net` (script e
  configuração do fluxo, que não registram evento);
- aceita o consentimento, percorre o funil até `/resultado` e extrai o nome de cada evento: `en`
  na query e em cada linha do corpo (GA4), `ev` na query (Meta);
- afirma: 1 `page_view`/`PageView` por rota visitada; 1 `quiz_start`; 15 `question_answered` só
  no GA4; 1 `quiz_complete`; 1 `generate_lead` e 1 `Lead`; 1 `report_viewed`; nenhum valor de
  parâmetro com formato de e-mail nem com o nome digitado no formulário.

Como rodar (registrar em `GOLIVE.md`):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H0NTV61JS6 NEXT_PUBLIC_META_PIXEL_ID=2151084515475904 \
MAILERLITE_API_KEY=e2e-invalid RATE_LIMIT_MAX_REQUESTS=1000 npm run build
MAILERLITE_API_KEY=e2e-invalid RATE_LIMIT_MAX_REQUESTS=1000 npx next start -p 3200 &
PLAYWRIGHT_BASE_URL=http://localhost:3200 ANALYTICS_REAL_IDS=1 \
  npx playwright test e2e/analytics-count.spec.ts
```

Rodar **antes** de qualquer correção e anotar a contagem no relatório do épico. É a linha de base.

### 2. Corrigir a contagem, conforme a linha de base

| Se a linha de base mostrar | Correção |
| --- | --- |
| 2 `PageView` do Meta por troca de rota | `fbq.disablePushState = true;` logo antes de `fbq('init', …)`. O disparo manual fica |
| 2 `page_view` do GA4 por troca de rota | remover o `gtag('event', 'page_view', …)` manual do `PageviewTracker`; a Medição Otimizada do fluxo cobre as trocas de rota |
| 1 `page_view` do GA4 por troca de rota | manter o disparo manual e acrescentar `page_location: window.location.href` |

Rodar a verificação de novo: a tarefa só fecha com exatamente um evento por rota em cada
plataforma.

### 3. Consent Mode v2 completo

No `gtag('consent', 'default', …)`, acrescentar `ad_user_data: 'granted'` e
`ad_personalization: 'granted'`. O script só monta depois do aceite, então os quatro sinais
entram concedidos.

### 4. Link do Substack com UTM

Criar `lib/substack.ts`:

```ts
/** `posicao` identifica o botão: resultado, newsletter-hero, newsletter-meio, newsletter-final, newsletter-header. */
export function substackSubscribeUrl(posicao: string): string
// https://syntaxis.substack.com/subscribe?utm_source=skill-check&utm_medium=app&utm_campaign=diagnostico&utm_content=<posicao>
```

`content/offers.ts` passa a usar `substackSubscribeUrl('resultado')`. Teste unitário cobre a URL
e a codificação de `posicao`. Não preencher e-mail na URL: o endereço iria para a URL de página
vista pelo Pixel e pelo GA4 do Substack.

### 5. Taxonomia: dois ajustes

Em `lib/analytics/track.ts`:

- novo evento `next_step_click` (GA4 e Meta, custom): clique na ponte do resultado para a página
  final. Parâmetros: `nivel`, `classificacao`, `posicao`;
- `cta_offer_click` continua sendo o clique que sai para o Substack e passa a receber `posicao`.

Funil completo: `report_viewed` → `next_step_click` → `page_view` (/newsletter) →
`cta_offer_click`. Os componentes que disparam os dois eventos entram nos Épicos 43 e 44.

### 6. Rever a escolha de cookies

- `lib/analytics/consent.ts`: `resetConsent()` apaga a chave e emite o evento com `'unset'`.
- `ConsentBanner` passa a assinar `subscribeToConsent` e reaparece em `'unset'`.
- `SiteFooter` ganha o botão "Preferências de cookies", que chama `resetConsent()` e recarrega a
  página. Os scripts já carregados só saem com o recarregamento.
- `/privacidade` cita o botão do rodapé como o caminho para mudar a escolha.

### 7. Documentação

- `.env.example` e `GOLIVE.md`: Pixel ID `2151084515475904`; domínio final
  `skill.syntaxis.com.br`, marcado como resolvido.
- `GOLIVE.md`, seção nova com a lista de conferência humana abaixo.
- `README.md` e `CLAUDE.MD`: toda rodada local de E2E usa `MAILERLITE_API_KEY=e2e-invalid`. A
  variável de ambiente do shell vence a `.env.local`, e a falha do MailerLite não bloqueia o
  fluxo. Sem isso, cada rodada grava leads `@example.com` na conta real (M9).

## Conferência humana (o agente pede e espera a resposta)

1. **Vercel → Environment Variables (Production):** `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H0NTV61JS6`
   e `NEXT_PUBLIC_META_PIXEL_ID=2151084515475904`; em Preview, as duas em branco.
2. **Meta → Gerenciador de Eventos → Testar eventos**, em `skill.syntaxis.com.br`: um `PageView`
   por tela, `Lead` no envio do formulário.
3. **GA4 → DebugView:** um `page_view` por tela e os eventos do funil na ordem acima.
4. **GA4 → Administrador → Eventos:** marcar `generate_lead` e `cta_offer_click` como
   eventos-chave.
5. **Substack → Configurações → Analytics:** conferir que o Pixel é `2151084515475904` e o GA4 é
   `G-H0NTV61JS6`. É o Pixel do Substack que registra a inscrição (`strategy/FUNIL.md` §4); com
   o mesmo ID nos dois lados, o lead do Skill Check e o assinante caem no mesmo conjunto de
   dados.
6. **Meta → Públicos:** criar públicos personalizados de `Lead` e de `cta_offer_click` (180
   dias), para a fase 2 da mídia (vendas da isca).

## Fora de escopo

MailerLite; API de Conversões do Meta (lado do servidor); Google Tag Manager; CSP.

## Testes obrigatórios

- `e2e/consent.spec.ts` verde, com um caso novo: "Preferências de cookies" faz o banner voltar e,
  depois de recusar, nenhuma requisição sai.
- `__tests__/analytics-track.test.ts`: `next_step_click` mapeado; `posicao` passa pela
  sanitização.
- `__tests__/substack.test.ts`: URL e UTMs.
- `e2e/analytics-count.spec.ts`, rodado à mão com os IDs reais, com as contagens esperadas.

## Gate

- [ ] Linha de base de contagem registrada no relatório, antes e depois.
- [ ] Um `page_view`/`PageView` por rota em cada plataforma.
- [ ] `ad_user_data` e `ad_personalization` no consentimento.
- [ ] Link do Substack com `/subscribe` e os quatro UTMs.
- [ ] Botão de preferências de cookies no rodapé, coberto por E2E.
- [ ] `.env.example`, `GOLIVE.md`, `README.md` e `CLAUDE.MD` atualizados.
- [ ] `prebuild`, vitest, lint, typecheck, `format:check`, build e E2E verdes.
- [ ] Itens 1–5 da conferência humana confirmados pelo founder (o 6 pode ficar registrado como
      pendência).
