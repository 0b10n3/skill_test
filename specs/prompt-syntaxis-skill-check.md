# PROMPT PARA IA AGÊNTICA

## Projeto: Syntaxis Skill Check — Avaliação de Conhecimento em Finanças/Matemática Financeira

> **Nota de 02/09/2026 (revisão de marca, item 5).** A seção 3 deste documento descreve o
> sistema visual **"O Sinal no Escuro" v2.1** — dark-mode-first, Volt Green `#1FE07A`,
> `specs/tokens.json`. Esse sistema foi sucedido por `brand/DESIGN.md` v2.0 (Forest/Grove/**Lime
> `#CDF163`**, cantos retos, Space Grotesk + Hanken Grotesk + Space Mono) e o app implementou a
> sucessão no Épico 22, incluindo o toggle de tema que este documento dizia não construir.
> Nada da seção 3 é especificação vigente — é registro do briefing original. Fonte viva:
> `brand/DESIGN.md` e `design/tokens.json`.

**Este é o documento de visão geral do projeto.** Ele descreve o produto, o stack e a arquitetura em alto nível. O detalhamento de cada parte vive em documentos próprios, que devem ser lidos junto com este:

- `especificacao-quiz-avaliacao.md` — metodologia completa do quiz: banco de perguntas por senioridade, lógica de seleção adaptativa, cálculo de score, classificação, schema de dados.
- `questions.json` — banco de 30 perguntas (1 de senioridade + 28 de conhecimento + 1 de autoavaliação).
- `epicos/*.md` — o trabalho de implementação quebrado em 9 épicos sequenciais, cada um com critérios de aceite, testes obrigatórios e um gate de validação que bloqueia o avanço para o próximo.
- `prompt-claude-code-implementacao.md` — o prompt operacional que orquestra a implementação épico por épico.

Este arquivo não repete o detalhe que já está nos outros três — onde há sobreposição, os documentos específicos têm prioridade.

---

## 0. PAPEL E POSTURA

Você é um(a) engenheiro(a) full-stack sênior, especialista em Next.js (App Router), TypeScript, design systems e deploy na Vercel. Sua missão é construir, de ponta a ponta, um web app de avaliação (quiz) de conhecimento técnico em finanças/matemática financeira, voltado a profissionais do mercado financeiro de diferentes senioridades. O produto é da **Syntaxis Educação** e deve seguir rigorosamente o sistema de marca **"O Sinal no Escuro"**.

Trabalhe de forma autônoma, tomando decisões técnicas razoáveis quando o escopo abaixo não especificar algo, mas **sempre documentando as suposições feitas** em um `DECISIONS.md` na raiz do projeto.

---

## 1. OBJETIVO DO PRODUTO

Um app de diagnóstico rápido (10 a 15 minutos) que:

1. Pergunta, como primeiro item do quiz, a senioridade do participante — aspirante/investidor (não trabalha no mercado), estagiário, júnior, pleno ou sênior;
2. Aplica um teste de múltipla escolha sobre finanças/matemática financeira, **adaptado à senioridade declarada**: as perguntas seguintes são selecionadas dinamicamente de um banco maior, refletindo o que o mercado espera de cada nível (detalhe completo em `especificacao-quiz-avaliacao.md`);
3. Classifica o participante em **Baixo / Médio / Alto** nível de proficiência;
4. Captura lead (nome, e-mail, opt-in) e sincroniza com a lista de e-mail da Syntaxis via **API da MailerLite**, antes de liberar o resultado;
5. Apresenta o resultado com gráficos e score cards;
6. Entrega uma oferta comercial personalizada conforme o nível — alinhada à estrutura de três camadas da Syntaxis (gratuito → pago → mentoria):
   - **Baixo** → curso introdutório gratuito
   - **Médio** → curso pago (trilha técnica)
   - **Alto** → mentoria/avançado

> Suposição a confirmar: os textos e links reais de cada oferta serão fornecidos depois; deixe placeholders claramente marcados em `content/offers.ts`.

---

## 2. STACK TÉCNICO (obrigatório)

- **Next.js 15** (App Router, Server Components por padrão, Server Actions/Route Handlers para submissão)
- **TypeScript** estrito (`strict: true`)
- **Tailwind CSS v4** com tokens em OKLCH
- **shadcn/ui** para primitivos (Button, Card, Progress, RadioGroup, Dialog, Input, Checkbox, Badge, Separator)
- **Recharts** para os gráficos de resultado (radar por categoria + gauge/donut de score geral)
- **Zod** para validação de formulário e payloads de API
- **next/font** para carregar Space Grotesk, Inter e JetBrains Mono como fontes locais/otimizadas
- **Código hospedado no GitHub**, com branch `main` protegida e Pull Request obrigatório (detalhe de setup no Épico 1)
- **CI via GitHub Actions** (lint, typecheck, testes em todo PR)
- Deploy em **Vercel**, com preview deployment por PR e deploy de produção a partir de `main`; **Vercel Analytics** e **Speed Insights** habilitados
- **MailerLite** (SDK oficial `mailerlite-nodejs`) para captura e segmentação de leads — nunca chamado do client, só de Route Handlers (detalhe completo no Épico 7)

---

## 3. IDENTIDADE VISUAL — Sistema "O Sinal no Escuro"

Aplicar sem exceções o design system já existente da Syntaxis:

- **Dark-mode-first**: não construir toggle de tema; a aplicação é escura por padrão e por identidade.
- **Cor primária**: Volt Green `#1FE07A`.
- **Acessibilidade**: `volt-700` falha AA em texto pequeno — usar sempre o token derivado `volt-800 (#0A7E42)` para texto de destaque sobre fundo escuro, reservando o verde puro (`#1FE07A`) para elementos maiores (botões, ícones, bordas, gráficos).
- **Tipografia**:
  - Space Grotesk → headings
  - Inter → corpo de texto e UI
  - JetBrains Mono → números e dados (score %, contadores de questão, valores dos gráficos) — reforça a leitura "técnica/quant" do produto.
- **Fonte de verdade de tokens**: importar/replicar a estrutura do `tokens.json` existente (não reinventar paleta); gerar o `tailwind.config` a partir dele.
- **Regra do "elemento aceso" (single viewport)**: cada tela do quiz deve caber em um único viewport, sem scroll — uma pergunta, um card, sem rolagem. Use `100dvh`, flex centralizado e evite conteúdo que force overflow vertical em mobile.
- Componentes shadcn devem ser restilizados para essa paleta (dark background quase-preto, cards com leve elevação/glow em volt green, bordas sutis).

---

## 4. ARQUITETURA DE INFORMAÇÃO / FLUXO DO USUÁRIO

```
/                → Landing ("Hello Page")
/quiz            → q00 (senioridade) + 12 perguntas de conhecimento (adaptadas) + 1 autoavaliação = 14 itens
/lead             → captura de nome, e-mail, opt-in → sincroniza com MailerLite
/resultado        → Score cards + gráficos + oferta personalizada
```

### 4.1 Landing ("Hello Page") — `/`

- Headline curta explicando o propósito ("Descubra seu nível técnico em finanças em alguns minutos").
- Sub-texto: tempo estimado, número de perguntas, formato (múltipla escolha).
- CTA único: "Iniciar avaliação".
- Nenhuma captura de dado ainda nesta etapa.

### 4.2 Quiz — `/quiz`

- Primeira pergunta (`q00`) pede a senioridade — não pontua, mas define quais das próximas perguntas serão exibidas (ver `especificacao-quiz-avaliacao.md`, seção 2).
- 12 perguntas de conhecimento seguem, 3 por categoria (`produtos-renda-fixa`, `matematica-financeira-estatistica`, `dados-tecnologia`, `ia-aplicada-financas`), selecionadas dinamicamente entre as elegíveis para a senioridade declarada.
- Uma pergunta de autoavaliação técnica encerra o quiz (não pontua, alimenta a personalização do resultado).
- Uma pergunta por tela, 4 alternativas (exceto `q00`, com 5), seleção única, barra de progresso ("Pergunta X de 14") em JetBrains Mono.
- Sem opção de "voltar" após responder.
- Estado do quiz mantido em memória (Context ou `useReducer`) — **não persistir respostas no localStorage**.
- Transição suave entre perguntas, respeitando `prefers-reduced-motion`.

### 4.3 Captura de lead — `/lead`

Campos: nome, e-mail, opt-in explícito para a lista da Syntaxis (obrigatório marcar para prosseguir, nunca pré-marcado). Ao submeter, o app sincroniza o lead com a MailerLite (Épico 7) e só então calcula/exibe o resultado.

### 4.4 Resultado — `/resultado`

- **Score card** principal: percentual geral + badge de classificação (Baixo / Médio / Alto), em destaque com tipografia mono.
- **Radar chart** (Recharts) com o desempenho por categoria.
- **Gauge/donut** simples para o score geral.
- **Bloco de oferta personalizada**, condicional ao nível.
- Botão secundário de compartilhar/copiar resultado (opcional, não bloqueante).

---

## 5. MODELO DE DADOS E LÓGICA DE PONTUAÇÃO

O schema completo (`type: "seniority" | "knowledge" | "self_assessment"`, `targetSeniority`, categorias, faixas de classificação) está definido em `especificacao-quiz-avaliacao.md`, seção 8, e implementado em `questions.json`. Resumo:

- Score = (acertos / 12) × 100, calculado **sempre no servidor**.
- Classificação usa uma régua única para todos os níveis (0–39% Baixo, 40–69% Médio, 70–100% Alto) — a adaptação por senioridade acontece no **conteúdo** das perguntas exibidas, não numa régua de corte diferente (ver racional na seção 4.3 da especificação).
- **Requisito de segurança crítico**: `correctOptionId` nunca pode ser enviado ao client antes da submissão. O JSON completo só é lido no servidor; o client recebe apenas as perguntas já filtradas e sem gabarito.

---

## 6. OFERTA PERSONALIZADA POR NÍVEL

Estrutura em `content/offers.ts`, mapeando classificação → oferta:

```ts
export const offers = {
  baixo: {
    title: 'Comece pelo essencial',
    description: '[placeholder] curso introdutório gratuito da Syntaxis',
    ctaLabel: 'Começar grátis',
    ctaHref: '[placeholder-link]',
  },
  medio: {
    title: 'Avance na trilha técnica',
    description: '[placeholder] curso pago da Syntaxis',
    ctaLabel: 'Ver curso',
    ctaHref: '[placeholder-link]',
  },
  alto: {
    title: 'Você está pronto para o próximo nível',
    description: '[placeholder] mentoria avançada Syntaxis',
    ctaLabel: 'Aplicar para mentoria',
    ctaHref: '[placeholder-link]',
  },
};
```

---

## 7. INTEGRAÇÃO DE LEAD — MAILERLITE

Detalhe completo de implementação, incluindo endpoints, autenticação e setup de Grupos/Campos, está no Épico 7 (`epicos/epico-07-mailerlite.md`). Resumo:

- SDK oficial `mailerlite-nodejs`, chamado só em Route Handlers — `MAILERLITE_API_KEY` nunca em código client.
- Subscriber criado/atualizado via upsert por e-mail, com `fields` (nome, senioridade, score, classificação, perfil técnico) e `groups` (Baixo/Médio/Alto — pré-criados no painel MailerLite).
- Falha na chamada à MailerLite **não pode bloquear** a exibição do resultado — logar e seguir.

---

## 8. ESTRUTURA DE PASTAS SUGERIDA

```
/app
  /page.tsx                → Landing
  /quiz/page.tsx
  /lead/page.tsx
  /resultado/page.tsx
  /api/submit/route.ts     → calcula score, envia lead à MailerLite
  /dev/design-system/page.tsx  → QA visual dos componentes (não pública)
/components
  /quiz/QuestionCard.tsx
  /quiz/ProgressBar.tsx
  /lead/LeadForm.tsx
  /result/ScoreCard.tsx
  /result/CategoryRadarChart.tsx
  /result/OfferBlock.tsx
  /ui/...                  → shadcn components restilizados
/content
  questions.json            → banco de 30 perguntas (do repositório de specs)
  offers.ts
/lib
  quiz-selection.ts         → seleção adaptativa por senioridade (Épico 3)
  scoring.ts                → cálculo de score e classificação (Épico 3/6)
  mailerlite.ts              → integração com a API da MailerLite (Épico 7)
  validations.ts             → schemas Zod
/styles
  tokens.css / globals.css   → derivado do tokens.json da marca
/specs                       → documentos de especificação (este arquivo e os demais)
DECISIONS.md
README.md
```

---

## 9. REQUISITOS NÃO FUNCIONAIS

- **Responsivo**: mobile-first, respeitando a regra de single-viewport por tela de pergunta.
- **Performance**: Lighthouse ≥ 90 em todas as categorias; `next/image`, fontes otimizadas, sem bibliotecas pesadas além das listadas.
- **Acessibilidade**: contraste AA (`volt-800`), navegação por teclado no quiz, `aria-live` na barra de progresso, labels corretos no formulário.
- **SEO/OG**: metadata via `generateMetadata`, imagem OG com a identidade "Sinal no Escuro".
- **Privacidade**: copy clara no opt-in sobre uso do e-mail; nada de checkbox pré-marcado.

---

## 10. COMO EXECUTAR ESTE PROJETO

A implementação não segue este documento diretamente — ela segue os 9 épicos em `epicos/`, na ordem definida em `epicos/00-indice.md`, cada um com seu próprio gate de validação. O prompt em `prompt-claude-code-implementacao.md` já está pronto para orquestrar essa execução com o Claude Code. Este documento serve como referência de contexto do produto, não como plano de execução passo a passo.
