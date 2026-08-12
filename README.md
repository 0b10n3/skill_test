# Syntaxis Skill Check

[![CI](https://github.com/0b10n3/skill_test/actions/workflows/ci.yml/badge.svg)](https://github.com/0b10n3/skill_test/actions/workflows/ci.yml)

Quiz adaptativo de diagnóstico de conhecimento técnico em finanças/matemática financeira, com seleção de perguntas por senioridade, scoring no servidor e captura de lead via MailerLite.

Especificação completa do produto em [`/specs`](./specs).

## Stack

- Next.js 15 (App Router) + TypeScript estrito
- Tailwind CSS v4 + shadcn/ui (`@base-ui/react`)
- Recharts (gráfico radar do resultado)
- Zod (validação client + server)
- MailerLite (`@mailerlite/mailerlite-nodejs`, captura de lead)
- ESLint + Prettier
- Vitest + Testing Library (unitário/integração) + Playwright + axe-core (E2E, acessibilidade, visual)
- Deploy: Vercel (preview por PR, produção a partir de `main`)

## Setup local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env.local` e preencha as variáveis necessárias (ver seção abaixo).

## Scripts disponíveis

| Script                              | Descrição                                                                                                           |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                       | Servidor de desenvolvimento (Turbopack)                                                                             |
| `npm run build`                     | Build de produção                                                                                                   |
| `npm run start`                     | Roda o build de produção localmente                                                                                 |
| `npm run lint`                      | ESLint                                                                                                              |
| `npm run typecheck`                 | `tsc --noEmit`                                                                                                      |
| `npm run format`                    | Formata o código com Prettier                                                                                       |
| `npm run format:check`              | Verifica formatação sem alterar arquivos                                                                            |
| `npm run test`                      | Suíte de testes unitários/integração (Vitest)                                                                       |
| `npm run test:e2e`                  | Suíte E2E (Playwright) contra um build de produção                                                                  |
| `npm run test:e2e:update-snapshots` | Regenera os snapshots visuais do Playwright                                                                         |
| `npm run test:lighthouse`           | Auditoria Lighthouse (Performance/A11y/SEO) contra `/`                                                              |
| `npm run test:lighthouse:flow`      | Auditoria Lighthouse nas 4 rotas públicas via User Flow (ver [`GOLIVE.md`](./GOLIVE.md))                            |
| `npm run generate:tokens`           | Gera `app/tokens.generated.css` (gitignored) a partir de `design/tokens.json`                                       |
| `npm run check:tokens-additive`     | Falha se `design/tokens.json` alterar/remover algum token da v1.1.0 (snapshot em `design/archive/`) — só aditivo    |
| `npm run lint:colors`               | Falha se algum `.ts`/`.tsx` em `app/`, `components/`, `lib/`, `content/` tiver cor hex/rgb/hsl fora dos tokens      |
| `npm run audit:contrast`            | Gera `design/contrast-report.md` checando contraste WCAG AA de todos os pares semânticos claro/escuro               |
| `npm run lint:patterns`             | Falha se algum arquivo importar mais de um padrão geométrico (`components/patterns`) — "um padrão por peça"         |
| `npm run assets:process`            | Corrige cor (duotone), gera variantes AVIF/WebP e publica um asset aprovado em `public/img/` (ver `--help` no uso)  |
| `npm run assets:verify-manifest`    | Falha se algum asset publicado não tiver origem/orçamento no manifest, ou se houver arquivo órfão em `public/img/`  |
| `npm run assets:verify-palette`     | Falha se a amostragem de pixels de algum asset publicado cair fora da tolerância de paleta da marca                 |
| `npm run validate:questions`        | Valida `content/questions.json` contra o blueprint de senioridade (`docs/metodologia.md`)                           |
| `npm run item-stats`                | Agrega os logs de telemetria de itens em taxa de acerto/distribuição por alternativa (ver `docs/metodologia.md` §7) |

## Variáveis de ambiente

Ver [`.env.example`](./.env.example) para a lista completa e documentada. Nenhuma chave sensível é commitada — `.env.local` está no `.gitignore`.

## Banco de questões

`content/questions.json` é o banco canônico (v2, desde o Épico 10): 5
dimensões de competência × 5 senioridades, com seleção determinística de 15
itens por nível (3 por dimensão) em `lib/quiz-selection.ts`, conforme o
blueprint descrito em [`docs/metodologia.md`](./docs/metodologia.md). Toda
alteração de item passa por `npm run validate:questions` (também bloqueante
em CI). Bancos substituídos vão para `data/archive/` (nunca apagados) — ver
`data/archive/README.md`.

O motor de diagnóstico (`lib/diagnostico/`) transforma as respostas em
score por dimensão, classificação, prioridades de carreira e pontos
fortes/atenção — modelo completo em `docs/metodologia.md`. Cada submissão
também alimenta a telemetria de itens (taxa de acerto e distribuição por
alternativa, por item e por nível) via `npm run item-stats`.

## Tokens de design e tema (Épico 14)

`design/tokens.json` é a fonte canônica (formato DTCG) de toda cor,
tipografia, espaçamento, raio, sombra e token de padrão geométrico da marca
Syntaxis — nunca editar CSS com valores literais diretamente. `npm run
generate:tokens` (parte do `prebuild`) lê esse arquivo e escreve
`app/tokens.generated.css` (gitignored, gerado a cada build), que alimenta o
`@theme` do Tailwind v4 e as variáveis semânticas `:root`/`.dark` consumidas
pelos componentes. Dois scripts bloqueantes em CI garantem que essa é
sempre a única fonte de cor: `npm run lint:colors` (nenhum literal
hex/rgb/hsl fora dos arquivos de token) e `npm run audit:contrast` (todo par
semântico claro/escuro precisa manter contraste AA — falhas documentadas
como aceitáveis ficam no `KNOWN_SUBSTITUTES` de `scripts/audit-contrast.mjs`,
qualquer outra falha quebra o build).

O tema claro/escuro usa `next-themes` (`components/theme-provider.tsx`,
alternância em `components/theme-toggle.tsx`), seguindo preferência do
sistema por padrão. Estados de hover dos variants `default`/`secondary` de
botão e badge escurecem a cor com `color-mix(in oklch, var(--X), black 20%)`
em vez de reduzir opacidade ou clarear em direção ao texto — a paleta
Forest/Grove é mais escura que o sistema visual anterior, e opacidade/mix
para claro derruba o contraste abaixo do AA (achado real de QA do Épico 14,
ver comentário em `components/ui/button.tsx`).

`components/logo.tsx` e `app/icon.svg` são **placeholders** (wordmark
tipográfico e favicon geométrico) até que um asset de marca real seja
fornecido. O antigo catálogo `/dev/design-system` (construído em cima do
sistema de tokens anterior, "O Sinal no Escuro") foi removido — o
substituto é `/dev/ui` (Épico 15). Tokens/catálogos substituídos vão para
`design/archive/` (nunca apagados) — ver `design/archive/README.md`.

## Padrões geométricos e catálogo de componentes (Épico 15)

`components/patterns/` implementa as três famílias de padrão geométrico da
marca (DESIGN.md §5) como componentes SVG/CSS paramétricos, consumindo só
`pattern.*` de `design/tokens.json` — nunca um valor copiado:

- `<PatternNodeBranch context="onText"|"decorative" ... />` — nós e galhos
  (padrão primário). A opacidade é sempre computada em JS a partir de
  `pattern.nodeBranch.*`: em `onText` é travada em `opacityOnText`
  (ignora qualquer prop passada); em `decorative` é clampada entre
  `opacityDecorativeMin`/`Max`.
- `<PatternDataGrid slot="margin-left"|"margin-right"|"header" />` — grade
  de dados. A API só oferece esses três slots fixos — não existe prop de
  posicionamento livre, então não dá para usar atrás de texto denso por
  engano.
- `<PatternGrowthLine steps={n} />` — linha de conquista, em degraus retos.
  Não aceita prop de opacidade: é sempre protagonista, nunca decoração de
  fundo.

`npm run lint:patterns` (parte do `prebuild`) falha se algum arquivo
importar mais de um desses três componentes — "um padrão por peça"
(DESIGN.md §5.4) vira restrição de composição, não convenção de disciplina.

O catálogo vivo fica em `/dev/ui` — todos os componentes restylizados e os
três padrões, nos dois temas, com a matriz de uso dos padrões (DESIGN.md
§5.3) documentada na própria página. Não é uma rota de produto (não
indexada, não linkada) e é a base do teste visual de referência
(`e2e/dev-ui-catalog.spec.ts`: screenshots em 375px/1440px × claro/escuro,
mais axe-core com zero violações críticas).

## Pipeline de assets generativos (Épico 16)

> **Estado atual: lote inicial gerado e publicado.** Este épico foi
> entregue como _scaffold_ — a geração de imagem real via Nano Banana Pro
> depende do `agy` (Antigravity CLI), que não estava disponível no
> ambiente onde o pipeline foi montado. Os 9 assets do lote inicial foram
> gerados e aprovados posteriormente (via `agy`, fora deste ambiente) e já
> estão em `assets/manifest.json`/`public/img/`, consumidos pelos Épicos
> 17-18.

Geração de imagem tratada como build reprodutível (`docs/design-system.md`
§4): o
prompt versionado é código-fonte, a saída bruta é artefato imutável, a
aprovação é registrada, o publicado é sempre derivado por script.

- **`assets/prompts/<slug>.md`** — um arquivo por asset (frontmatter com
  uso/proporção/resolução/variantes/orçamento de peso + corpo com o
  prompt e restrições negativas específicas). `assets/prompts/_brand-block.md`
  é o bloco de marca compartilhado (paleta, direção estética, proibições)
  — nunca copiado dentro de cada prompt individual, sempre concatenado na
  hora de montar o prompt final.
- **`.agents/skills/gerar-asset-marca/SKILL.md`** — contrato completo de
  como invocar o Nano Banana Pro via `agy` a partir de um slug, gravar a
  saída versionada em `assets/generated/raw/<slug>/<data>-vN.png` (nunca
  sobrescrevendo), e como iterar um prompt reprovado no gate de revisão
  humana.
- **`npm run assets:process -- <slug> --raw <path> --dark <hex> --light <hex> --widths <n,n,...>`**
  (`scripts/process-asset.mjs`) — publica um asset aprovado: aplica
  correção de cor por **duotone** (remapeia cada pixel para um ponto
  exato na reta entre dois hexes dos tokens — aderência à paleta garantida
  por construção, não "aproximada"), gera as variantes AVIF/WebP
  configuradas em `public/img/<slug>/`, e atualiza `assets/manifest.json`.
- **`npm run assets:verify-manifest`** / **`npm run assets:verify-palette`**
  (parte do `prebuild`) — todo asset publicado tem origem (prompt + raw
  aprovado) e orçamento no manifest, nenhum arquivo em `public/img/` fica
  órfão; e todo pixel amostrado de cada asset publicado cai dentro da
  tolerância de paleta documentada em `scripts/lib/palette.mjs` (o
  segmento dark↔light do duotone registrado no manifest, não uma lista
  solta de cores — ver comentário no topo de `scripts/verify-asset-palette.mjs`
  para o porquê).

## Refinamento anti-genérico (Épico 20)

`DESIGN.md` v1.1 (§4.3–§4.6) e `design/tokens.json` v1.2.0 codificam as
assinaturas visuais e a lista de anti-padrões "feito por IA" que este épico
aplicou às 4 rotas públicas: hero com `displayXxl` + palavra-acento serif
itálica + marcador Grove (`components/ui/marker-highlight.tsx`), eyebrows
mono em toda seção (`components/ui/eyebrow.tsx`), a seção "o que o
diagnóstico avalia" da landing virou grid bento assimétrico de tiles de
evidência real do produto (`components/landing/DimensionsSection.tsx` +
`lib/landing-evidence.ts` — nunca expõe `correctOptionId`, coberto por
teste), faixa de números (`StatsStripSection.tsx`) e banda Deep Forest
(`CredibilityBand.tsx` na landing; a S5 de `/resultado`,
`PriorityCareerSkills.tsx`). Botões e cards migraram para os tokens de
componente da v1.2.0 (`component.button`/`component.card`).

A v1.2.0 de `design/tokens.json` é estritamente aditiva sobre a v1.1.0 —
`npm run check:tokens-additive` (parte do `prebuild`) compara contra o
snapshot congelado `design/archive/tokens-v1.1.0.json` e falha se qualquer
valor pré-existente mudar ou for removido.

**Achado real:** `tailwind-merge` (via `cn()`, `lib/utils.ts`) descarta por
padrão qualquer classe `text-<palavra>` sem sufixo numérico quando
combinada com uma cor de texto no mesmo `cn()` — tratava `text-eyebrow`,
`text-data-xl` etc. como candidatas a cor e as removia silenciosamente.
`lib/utils.ts` registra as classes de `typography.scale` (derivadas de
`design/tokens.json`) num grupo próprio do `tailwind-merge` — coberto por
`__tests__/cn-typography-scale.test.ts`, que varre todo token da escala.

## SEO e Analytics (Épico 21)

Camada única de tracking: `lib/analytics/track.ts` exporta `track(evento,
params)` — nenhum componente chama `gtag`/`fbq` diretamente. Sanitiza PII
por chave e por formato de valor antes de despachar para GA4 e Meta Pixel
(taxonomia completa em `lib/analytics/track.ts`, testada em
`__tests__/analytics-track.test.ts`).

GA4/Meta Pixel só carregam depois de aceite explícito no banner de
consentimento LGPD (`components/analytics/ConsentBanner.tsx` +
`lib/analytics/consent.ts`) — nada é montado antes disso, então nenhuma
requisição sai (coberto por `e2e/consent.spec.ts`, que intercepta rede). O
banner não aparece em `/quiz`/`/lead` (viewport único, sem scroll — um
banner fixo no rodapé colidiria com o CTA da tarefa); o consentimento é
resolvido na landing na maioria dos casos, ou reaparece em `/resultado`.
IDs via `NEXT_PUBLIC_GA_MEASUREMENT_ID`/`NEXT_PUBLIC_META_PIXEL_ID` (ver
`.env.example`) — nunca hardcoded, em branco fora de produção.

`/quiz`, `/lead` e `/resultado` têm `metadata.robots: noindex` (conteúdo
transacional/pessoal); `app/robots.ts` e `app/sitemap.ts` (gerados pelo
framework) refletem a mesma regra — só `/` é indexável e listada no
sitemap. JSON-LD `Organization`+`WebSite` na home (`app/page.tsx`).
`lib/site-url.ts` centraliza a resolução do domínio ativo (Vercel
production URL → Vercel URL → localhost), fonte única para
`metadataBase`, sitemap, robots e JSON-LD.

`scripts/lighthouse-flow-check.mjs` exige SEO ≥ 95 na home, mas não cobra
SEO nas 3 rotas `noindex` — o próprio audit `is-crawlable` do Lighthouse
reprova qualquer página `noindex` por definição, então cobrar SEO ali
contradiria a própria regra de indexação (score continua impresso, só não
é gate). Performance/acessibilidade/boas práticas seguem ≥ 90 em todas as
rotas.

## Setup do MailerLite

A captura de lead (rota `/lead`) sincroniza cada submissão com uma conta MailerLite via API. Antes de rodar qualquer teste de integração real (ou de configurar `MAILERLITE_API_KEY` em produção), é preciso preparar a conta no painel:

1. **Gerar a API key**: painel MailerLite → _Integrations_ → _MailerLite API_ → gerar uma chave. Colar em `MAILERLITE_API_KEY` (`.env.local` local, e nas variáveis de ambiente do projeto na Vercel para produção). Essa chave é usada **somente em código server-side** — nunca em componente client, nunca em variável `NEXT_PUBLIC_*`.
2. **Criar (ou reaproveitar) um Grupo** para onde todos os leads do quiz vão — na conta em uso, esse grupo é o `SYNTAXIS_SKILL_APP`. Colar o **ID numérico** do grupo em `MAILERLITE_GROUP_ID` (`.env.local`). O ID aparece na URL do grupo no painel (`.../groups/<ID>`) ou via `GET /api/groups` com a API key.
   - A classificação final (`baixo`/`medio`/`alto`), a senioridade e o score **não** segmentam por grupo — ficam gravados como Campos customizados no próprio subscriber (item 3).
3. **Criar os Campos customizados** (painel → _Subscribers_ → _Custom fields_, ou via `POST /fields`) com exatamente estas chaves (o código em `lib/mailerlite.ts` envia esses nomes):
   - `seniority` (texto) — a senioridade declarada em q00
   - `score_geral` (número) — percentual geral do quiz
   - `classificacao` (texto) — `baixo` / `medio` / `alto`
   - `perfil_tecnico` (texto) — desde o banco v2 (Épico 10) o quiz não tem mais pergunta de autoavaliação, então este campo chega sempre vazio; a segmentação por prioridade de carreira do diagnóstico v2 é redefinida no Épico 13.

Sem o grupo/campos criados, o `POST /subscribers` ainda funciona (grupo/campos ausentes são apenas ignorados pela API), mas o subscriber não fica no lugar certo — **confirme que o grupo e os 4 campos existem antes de considerar a integração validada**.

A chamada à MailerLite é sempre **não-bloqueante**: se falhar (rede, credencial inválida, etc.), o erro é logado no servidor e o resultado do quiz é exibido normalmente ao usuário.

O botão "Receber este relatório por e-mail" do relatório (`/resultado`, Épico 12) chama `POST /api/resend-report`, que apenas **re-sincroniza os campos do subscriber** na MailerLite (idempotente) — o envio do e-mail em si depende de uma automação configurada no painel da MailerLite disparada por essa atualização de campo. Sem uma automação configurada, o botão confirma sucesso mas nenhum e-mail sai.

## Deploy

- Preview: gerado automaticamente pela Vercel a cada Pull Request.
- Produção: https://skill-test-mocha.vercel.app/

Variáveis de ambiente de produção são configuradas em Vercel → Settings →
Environment Variables (nunca via `.env` commitado). Passos completos de
setup local em "Setup local" acima; setup do MailerLite na seção anterior.

## Go-live

Checklist final de QA, acessibilidade, performance (Lighthouse nas 4 rotas
públicas) e critério de go-live: ver [`GOLIVE.md`](./GOLIVE.md).

## Fluxo de contribuição

- Um branch e um Pull Request por épico (ver `/specs/epicos`), nunca commit direto em `main`.
- `main` é protegida: PR obrigatório + CI (lint, format, typecheck, testes, build) verde antes de merge.
- Commits seguem [Conventional Commits](https://www.conventionalcommits.org/).
