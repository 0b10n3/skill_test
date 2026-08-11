# REDESIGN.md — Revisão Completa de Design | Syntaxis Skill Check

> **Propósito deste arquivo:** spec-mestra da migração do app para a identidade Syntaxis definida em `DESIGN.md` e `tokens.json` v1.1.0. Governa os Épicos 14–19. Como os demais arquivos de spec, vive na raiz do repositório e pode ser removido ao fim do processo (após incorporação do conteúdo permanente à documentação viva — ver Épico 19).

---

## 1. Natureza do trabalho: migração de identidade, não polimento

O app foi construído sobre a camada visual anterior ("O Sinal no Escuro"). Este redesign migra o produto inteiro para o sistema de marca consolidado:

| | Sistema anterior | Sistema novo (SSOT) |
|---|---|---|
| Fonte de verdade | tokens antigos | **`tokens.json` v1.1.0 (DTCG)** + **`DESIGN.md` v1.0** |
| Paleta | Volt green, dark-first | **Forest `#1B6A45` / Grove `#2D9E67` / Amber `#C9832A`** + neutros (Chalk/Ink/Slate/Mint/Cream/Mist) |
| Tipografia | Space Grotesk / Inter / JetBrains Mono | **DM Serif Display (display) / DM Sans (corpo/UI) / Space Mono (dados, código, métricas)** |
| Temas | dark-first | **Light e Dark de primeira classe** via `color.theme.light` / `color.theme.dark` (com as inversões intencionais do dark: Grove como primary, Mint como secondary) |
| Padrões visuais | — | **Três famílias:** nó-e-galho (primário), grade de dados, linha de conquista (`pattern.*` nos tokens; regras no `DESIGN.md` §5) |
| Logo | — | Símbolo Syntaxis em duas variantes de verde (fundos claros / escuros) |

**Regra de precedência:** onde qualquer decisão anterior do app (inclusive `REPORT.md`, escrito antes desta migração) conflitar com `DESIGN.md`/`tokens.json` v1.1.0, **os novos arquivos vencem**. A estrutura S1–S8 do `REPORT.md` permanece válida; sua camada visual é substituída por este redesign.

## 2. Invariantes de design (valem para todos os épicos)

1. **Nenhuma cor fora dos tokens.** Toda cor no app resolve para um token de `tokens.json` (primitivo ou semântico). Cores hardcoded são bug, verificável por lint/grep em CI.
2. **Camada semântica, não primitivos, na UI.** Componentes consomem `--background`, `--primary`, `--accent` etc. (mapeados de `color.theme.light|dark`); primitivos (`forest.500`) só aparecem na definição dos temas e nos padrões geométricos.
3. **Tipografia por papel:** DM Serif Display apenas para títulos editoriais/display (`displayXl` em itálico, conforme token); DM Sans para corpo e UI; **Space Mono para todo número que é métrica** (scores, "2/3", percentuais do radar, contagem "7 de 15") — é a assinatura visual "técnica" da marca no produto.
4. **Grid de 8px** (`spacing.*`) e radius moderado (base 10px). Sem valores mágicos.
5. **Padrões geométricos seguem `DESIGN.md` §5.4:** um padrão por peça; máx. 12% de opacidade atrás de texto; Grove para estrutura, Amber exclusivamente para conquista real; contraste mínimo AA até em elemento decorativo.
6. **Voz (`DESIGN.md` §3) também é design:** microcopy do app segue "técnico e preciso, leve sem condescendência"; nomes comerciais em português; nunca prometer salário/promoção — a promessa verificável é a da §1.3 ("skills e ferramentas de trabalho real, incluindo IA, para o próximo nível da carreira"). Isso se aplica diretamente à matriz editorial do relatório.
7. **Acessibilidade:** AA em todo par texto/fundo nos dois temas, verificado por auditoria automatizada de contraste sobre os pares de tokens (atenção conhecida: Amber-500 sobre Chalk para texto pequeno — usar Amber-700/900 para texto, Amber-500 para superfícies/traços).
8. **Single-viewport por seção em 375px** permanece como regra de layout do app.

## 3. Inventário de assets

### 3.1 Logos (fornecidos — pasta `public/brand/`)
- `logo_nbg_{8,48,96}px.png` — variante verde-escuro (Forest), para fundos claros.
- `logo_nbg2_{8,48,64}px.png` — variante verde-médio (Grove), para fundos escuros.
- Convenção no repo: renomear para `public/brand/logo-forest-{size}.png` e `logo-grove-{size}.png`; mapa de uso: header light → forest; header dark → grove; favicon → 48px com fallback 8px; OG/social → 96px sobre superfície da marca.
- **Lacuna declarada:** não há SVG master. Épico 14 inclui vetorização (traçado fiel do símbolo) OU obtenção do SVG original com o founder — PNG upscalado não é aceitável em hero/impressão. Até lá, usar os PNGs nos tamanhos exatos fornecidos, sem escalar acima do fornecido.

### 3.2 Padrões geométricos (programáticos — nunca gerados por IA)
Nó-e-galho, grade de dados e linha de conquista são **SVG/CSS paramétricos** construídos a partir dos tokens `pattern.*` (raio de nó 2.5px, traço 0.75px, dot-grid 14px, degraus Amber 2px). Precisão geométrica e aderência exata de cor são requisitos — por isso ficam fora do pipeline generativo.

### 3.3 Assets generativos (Nano Banana Pro via agy)
Imagens ilustrativas onde a geração agrega: hero da landing, ilustrações de dimensão de competência, fundos de OG/social card, texturas de superfície. Governadas pelo pipeline do §4 e pelo Épico 16.

## 4. Pipeline de assets generativos — Nano Banana Pro via agy

O fluxo usa o agy (Antigravity CLI) para invocar o Nano Banana Pro de forma reprodutível e versionada:

1. **Prompts versionados:** cada asset tem um arquivo em `assets/prompts/<slug>.md` contendo: prompt completo, negative/constraints, proporção e resolução alvo, variante light/dark, e o campo "tokens de referência" (hexes exatos da paleta colados no prompt).
2. **Invocação padronizada via agy:** comando/skill do agy que lê o arquivo de prompt e grava a saída em `assets/generated/raw/<slug>/<data>-vN.png` — nunca sobrescrevendo gerações anteriores. (A skill agy correspondente segue o padrão SKILL.md já usado no workflow ClickUp+agy do projeto.)
3. **Template de prompt de marca (obrigatório):** todo prompt inclui o bloco-padrão — paleta restrita aos hexes Forest/Grove/Amber + neutros; estética "estrutura/árvore sintática/grafos, geométrica e editorial"; proibições: candlestick, moedas/cifrões, robôs genéricos, glassmorphism, gradientes fora da paleta, pessoas fotorrealistas, texto renderizado na imagem.
4. **Gate de revisão humana:** nenhum asset gerado entra em `public/` sem aprovação registrada contra o checklist de marca (`DESIGN.md` §7 + invariantes §2 deste arquivo). Modelos generativos não garantem aderência exata de cor: quando a paleta sair aproximada, aplicar tratamento de correção (duotone/recolor para os hexes dos tokens) na etapa de processamento — o asset publicado deve bater com os tokens, não "quase".
5. **Processamento e publicação:** aprovados passam por script de otimização (resize para os breakpoints usados, AVIF/WebP + fallback, strip de metadados) e entram em `public/img/<slug>/...` com registro em `assets/manifest.json` (slug → prompt de origem, versão aprovada, variantes, uso).
6. **Orçamento de peso:** imagens não podem custar o gate de Lighthouse — budget por página definido no Épico 19.

## 5. Direção por página (resumo; detalhado nos épicos)

- **Landing (`/`):** fundo Chalk (light) / Deep-forest ajustado (dark); hero com padrão nó-e-galho decorativo (25–40%) + asset generativo opcional; título em DM Serif Display; CTA Grove; promessa da §1.3 como headline de suporte. Grade de dados apenas em seção técnica ("o que avaliamos"), nas margens.
- **Quiz (`/quiz`):** superfície de card branca/`card` sobre fundo; progresso "N de 15" em Space Mono com barra Grove; sem padrão atrás do enunciado (legibilidade absoluta); microinterações sóbrias (transição de questão ≤ 200ms).
- **Lead (`/lead`):** formulário sobre `card`; inputs com `border`/`ring` dos tokens; opt-in com microcopy na voz da marca.
- **Resultado (`/resultado`):** mantém a estrutura S1–S8 do `REPORT.md` com a nova pele: radar com série "Seu perfil" em Grove (área) sobre "Expectativa" tracejada em Slate/Mist; selo de classificação usando Amber **somente** no caso ALTO (conquista real — regra §5.4 do DESIGN.md); seção S5 ("onde investir para a promoção") usa a **linha de conquista** como elemento protagonista; card de compartilhamento tratado como "mini-certificado" (linha de conquista + nó-e-galho como moldura, padrão do certificado do `DESIGN.md` §6); gabarito com trechos de código/termos técnicos em Space Mono.

## 6. Sequência de épicos

| Épico | Entrega | Depende de |
|---|---|---|
| 14 | Fundação: tokens v1.1.0 no código, tipografia, temas light/dark, logos | 13 (ou 9, se a v2 funcional ainda não iniciou) |
| 15 | Padrões geométricos + restyle da biblioteca de componentes | 14 |
| 16 | Pipeline agy + Nano Banana Pro e primeiro lote de assets aprovados | 14 (paralelo a 15) |
| 17 | Redesign das páginas do fluxo: landing, quiz, lead | 15, 16 |
| 18 | Redesign do relatório `/resultado` | 12, 15, 16 |
| 19 | QA visual, acessibilidade, performance e go-live do redesign | 17, 18 |
