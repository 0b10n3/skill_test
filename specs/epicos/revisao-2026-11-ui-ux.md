# Revisão de UI/UX, conversão e medição — novembro de 2026

**Data:** 13/11/2026 · **Base:** `main` em `431e182` (Épico 41) · **Produção:** `https://skill.syntaxis.com.br`

Este documento registra o que a revisão encontrou e como os achados viram os Épicos 42–47. Cada
épico tem arquivo próprio nesta pasta; o prompt de execução está em
`specs/prompt-execucao-epicos-42-47.md`.

## 1. Como a revisão foi feita

- Leitura de `strategy/FUNIL.md`, `strategy/DECISOES_2026-11.md`, `strategy/AUDIENCES.md`,
  `strategy/SYNTAXIS.md`, `DESIGN.md` v4.1 e `brand/APLICACAO.md` §1–1.2.
- Leitura de todas as rotas, componentes de landing, quiz, lead e resultado, e da camada de
  analytics.
- Funil percorrido de ponta a ponta num servidor local (chave do MailerLite inválida, IDs de
  analytics falsos), com capturas em 375×667, 390×844 escuro, 768×1024 e 1440×900.
- Requisições de GA4 e Meta registradas durante o funil; bundle de produção inspecionado.

## 2. O papel do app na estratégia

O Skill Check é a captura gratuita do topo do funil: o lead entra no MailerLite e é convidado ao
Substack (decisões 11 e 12). Segmento prioritário do estágio: `#GENZ-FEAR` e `#GENZ-GREED`. A
mídia paga hoje vai para assinantes do Substack, não para o Skill Check (decisão 10), então o
tráfego do app é orgânico e cada visita conta.

Duas conversões importam, nesta ordem:

1. **Lead** — visitante conclui o quiz e envia nome e e-mail.
2. **Clique para o Substack** — lead sai do resultado para a página de inscrição.

Hoje a segunda conversão depende de um botão a ~4.000 px de profundidade no celular, dentro de um
cartão aninhado, com um texto que não se liga ao diagnóstico. É o maior ganho disponível.

## 3. Achados

Severidade: **A** bloqueia conversão ou mede errado · **M** prejudica a experiência ou a marca ·
**B** acabamento.

### 3.1 Medição (GA4, Meta Pixel, atribuição) → Épico 42

| # | Sev. | Achado | Evidência |
| --- | --- | --- | --- |
| M1 | A | O Pixel em produção usa `2151084515475904`; `.env.example` e `GOLIVE.md` documentam `852035937455815`. Os dois existem na Meta. O founder confirmou em 13/11/2026 que o correto é `2151084515475904` | chunk de analytics em produção |
| M2 | A | Risco de `PageView` em dobro no Meta: o `fbevents.js` dispara `PageView` sozinho a cada `pushState`, e o `PageviewTracker` dispara outro à mão | `components/analytics/AnalyticsProvider.tsx`; não reproduzível com ID falso |
| M3 | A | Risco de `page_view` em dobro no GA4: a Medição Otimizada do fluxo conta mudanças de histórico por padrão, e o app também envia `page_view` à mão | idem; depende da configuração do fluxo real |
| M4 | M | O `page_view` manual só leva `page_path`, sem `page_location` | `PageviewTracker` |
| M5 | M | O link para o Substack não leva UTM e cai na home da publicação, não em `/subscribe`: a inscrição vinda do app não é atribuível | `content/offers.ts` |
| M6 | M | Consentimento sem `ad_user_data` e `ad_personalization` (Consent Mode v2) | script `ga4-init` |
| M7 | M | Não há como rever a escolha de cookies depois de feita | `ConsentBanner.tsx` (comentário aponta a pendência) |
| M8 | B | `GOLIVE.md` ainda trata o domínio final como pendente; produção já responde em `skill.syntaxis.com.br` com canonical correto | `GOLIVE.md`, HTML de produção |
| M9 | A | A suíte E2E local sobe o servidor com a `.env.local` real: cada rodada grava leads `@example.com` no MailerLite de produção | `playwright.config.ts`, `e2e/*.spec.ts` |

Funciona e fica como está: nenhum script carrega antes do aceite; a ordem dos eventos no funil
está correta (`page_view` → `quiz_start` → 15× `question_answered` → `quiz_complete` →
`generate_lead` → `report_viewed`); nenhum parâmetro leva PII; `Lead` é evento padrão no Meta.

### 3.2 Página de resultado → Épico 43

| # | Sev. | Achado |
| --- | --- | --- |
| R1 | A | O CTA da newsletter é o último bloco da página (≈4.000 px no celular), num cartão dentro de outro cartão, disputando com dois botões secundários |
| R2 | A | O topo do relatório fica cortado atrás do cabeçalho fixo (`py-10` contra um cabeçalho de 56 px), e o logo aparece duas vezes |
| R3 | A | Com zero acertos numa dimensão "dominante", o relatório afirma "Seu perfil é mais forte em…" e lista essa dimensão em "O que te destaca" |
| R4 | M | O veredito é uma pilha de textos pequenos centralizados; o selo "Baixo" é seco e o percentual é o único número |
| R5 | M | No desktop, blocos de `max-w-md` e `max-w-4xl` se alternam: a página ziguezagueia |
| R6 | M | O gráfico de prioridades mostra pesos crus (`0.1675`), que não dizem nada ao leitor |
| R7 | M | "Vale revisitar" é uma frase única com enunciados truncados separados por ponto e vírgula |
| R8 | M | No celular, cinco cartões de dimensão empilhados ocupam ~700 px antes de qualquer orientação |
| R9 | B | A página tem CSS de impressão pronto, mas nenhum botão que leve a ele |

### 3.3 Página final → Épico 44

Não existe. O resultado termina num link para a home do Substack. Falta a página que faz a ponte
entre o diagnóstico e a newsletter, com estrutura de copy por segmento (`AUDIENCES.md` §3), prova
com textos reais e CTA de inscrição.

### 3.4 Chassi do funil (quiz, lead, cabeçalho, banner) → Épico 45

| # | Sev. | Achado |
| --- | --- | --- |
| F1 | A | No celular, o banner de cookies cobre o CTA do hero: a primeira tela não mostra o botão principal da página |
| F2 | A | As opções de senioridade aparecem embaralhadas (Estagiário, Sênior, Júnior, Pleno, Aspirante) |
| F3 | A | Texto das alternativas em 12 px no celular |
| F4 | M | O logo no cabeçalho leva a `/` durante o quiz: um toque acidental apaga as respostas, que só vivem em memória |
| F5 | M | Recarregar a página no meio do quiz perde tudo, sem aviso |
| F6 | M | Formulário de lead: campos de 32 px de altura, botão pequeno alinhado à direita, título "Quase lá" sem dizer o que o lead recebe, erros sem ligação com o campo para leitor de tela |
| F7 | M | O banner usa Lime no "Aceitar": três ocorrências de Lime na mesma tela, e destaque desigual entre aceitar e recusar |
| F8 | M | Anel de foco com 50% de opacidade: provável falha no alvo de 3:1 (`DESIGN.md` §8, SC 2.4.13) |
| F9 | B | Não há página 404 da marca |
| F10 | B | O eyebrow do quiz é sempre "Avaliação Syntaxis": não orienta sobre a dimensão da pergunta |

### 3.5 Landing → Épico 46

| # | Sev. | Achado |
| --- | --- | --- |
| L1 | A | O hero não diz que é gratuito e tem dois parágrafos antes do botão; no celular não há nenhum elemento de marca além do texto |
| L2 | M | A página não explica o que acontece depois do clique nem o que o visitante recebe |
| L3 | M | A banda de metodologia é um parágrafo de mais de 50 palavras em corpo de título |
| L4 | M | A faixa "15 · 5 · 5" lista características do teste, não fatos que ajudem a decidir |
| L5 | M | Nenhuma resposta às objeções previsíveis (é pago? pede e-mail? é certificação?) |
| L6 | M | Ninguém assina a página: falta dizer quem está por trás |
| L7 | B | A meta description promete "trilha personalizada"; o produto entrega diagnóstico e prioridades |
| L8 | B | Texto de leitura em 12 px em vários pontos do bento |

### 3.6 Fora de escopo, por instrução do founder

- **MailerLite** (`lib/mailerlite.ts`, `app/api/submit`, `app/api/resend-report`, `leadSchema`):
  nada muda. Observação registrada, sem ação: o opt-in de marketing é condição para ver o
  resultado.
- **CSP** e verificação de propriedade de e-mail: fechados como não-ação no Épico 36.
- **Banco de questões e motor de diagnóstico** (`content/questions.json`, `lib/diagnostico/`):
  nenhum conteúdo ou cálculo muda. Os Épicos 43 e 45 mexem só em apresentação.

## 4. Plano

| Épico | Nome | Resolve | Depende de |
| --- | --- | --- | --- |
| 42 | Medição: GA4, Meta Pixel e atribuição | M1–M9 | — |
| 43 | Relatório de resultado: hierarquia e ponte | R1–R9 | 42 |
| 44 | Página final `/newsletter` | 3.3 | 42, 43 |
| 45 | Chassi do funil: quiz, lead, cabeçalho e banner | F1–F10 | — |
| 46 | Landing: clareza e conversão | L1–L8 | 45 |
| 47 | QA visual, acessibilidade, desempenho e go-live | regressão de tudo | 42–46 |

A ordem põe primeiro o que mede e depois o caminho de conversão que o founder pediu (resultado →
página final → Substack). Os Épicos 45 e 46 não dependem de 43 e 44.

## 5. O que só uma pessoa resolve

| Item | Épico | O que o founder entrega |
| --- | --- | --- |
| Bio e retrato real de quem escreve | 44, 46 | 2–3 frases e uma foto em cor natural (mínimo 800×1000 px) |
| Aprovação da copy da página final | 44 | leitura do rascunho em `content/newsletter.ts` antes do merge |
| Curadoria dos textos por dimensão | 44 | confirmar ou trocar os três posts sugeridos por dimensão |
| Pixel e GA4 no Substack | 42 | conferir em Configurações → Analytics do Substack |
| Conferência em produção | 42, 47 | Test Events do Meta, DebugView do GA4, eventos-chave marcados |
| Aparelho real | 47 | um iPhone (Safari) e um Android (Chrome), nos dois temas |
