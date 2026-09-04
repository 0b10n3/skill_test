# Prompt de execução em lote — Épico 16 (colar no agy)

> Não é um prompt de asset (não segue o formato de `assets/prompts/<slug>.md`).
> É a instrução operacional para rodar o lote inicial inteiro de uma vez.
> Cole o texto abaixo, a partir da raiz do repositório, numa sessão do
> `agy` com acesso ao Nano Banana Pro.

---

Você está na raiz do repositório `skill_test`. Gere o lote inicial de
assets de imagem da marca Syntaxis seguindo exatamente o contrato
documentado em `.agents/skills/gerar-asset-marca/SKILL.md`. Antes de
gerar qualquer imagem, leia esse arquivo inteiro — ele define como montar
o prompt final, como nomear e gravar a saída, e como atualizar o
histórico.

## O que gerar

Para cada item abaixo: leia `assets/prompts/<slug>.md` (frontmatter +
corpo) e `assets/prompts/_brand-block.md` (compartilhado, obrigatório em
todo prompt). Monte o prompt final concatenando: corpo de "Prompt" do
arquivo do slug → conteúdo de `_brand-block.md` (paleta, direção
estética, proibições) → "Restrições negativas específicas" do arquivo do
slug, se houver. Se o slug tiver `variants` no frontmatter, gere uma
imagem por variante, usando o texto específico de cada variante descrito
no corpo do prompt.

| #   | Slug                         | Variante | Proporção | Resolução mínima |
| --- | ---------------------------- | -------- | --------- | ---------------- |
| 1   | `hero-landing`               | light    | 16:9      | 1920×1080        |
| 2   | `hero-landing`               | dark     | 16:9      | 1920×1080        |
| 3   | `dimensao-mercados-produtos` | —        | 1:1       | 800×800          |
| 4   | `dimensao-matematica-quant`  | —        | 1:1       | 800×800          |
| 5   | `dimensao-dados-programacao` | —        | 1:1       | 800×800          |
| 6   | `dimensao-ia-aplicada`       | —        | 1:1       | 800×800          |
| 7   | `dimensao-risco-regulacao`   | —        | 1:1       | 800×800          |
| 8   | `og-social-background`       | —        | 1.91:1    | 1200×630         |
| 9   | `radar-card-textura`         | light    | 1:1       | 1080×1080        |
| 10  | `radar-card-textura`         | dark     | 1:1       | 1080×1080        |
| 11  | `estado-vazio`               | —        | 1:1       | 600×600          |

11 gerações no total, cobrindo os 9 arquivos de prompt em
`assets/prompts/` (todos exceto `_brand-block.md` e este próprio
arquivo).

Note que as 5 ilustrações de dimensão (#3–7) devem ficar visualmente
coerentes entre si como um conjunto — mesma paleta, mesma espessura de
traço, mesmo raio de nó — cada arquivo de prompt já reforça isso
individualmente.

## Onde salvar

Cada geração vira um arquivo novo em
`assets/generated/raw/<slug>/<AAAA-MM-DD>-v1.png` (ou `-v1-light.png` /
`-v1-dark.png` quando houver variante), usando a data de hoje. **Nunca
sobrescreva** um arquivo existente — se rodar de novo para um slug que já
tem geração, incremente a versão (`-v2`, `-v3`...).

## Depois de gerar cada imagem

Acrescente uma entrada em `history:` no frontmatter do
`assets/prompts/<slug>.md` correspondente, com `decision: pending` (a
aprovação fica para uma revisão humana separada, contra o checklist de
`DESIGN.md` §10 — não decida aprovação sozinho). Formato exato da entrada
em `.agents/skills/gerar-asset-marca/SKILL.md` (passo 5).

## Depois de gerar tudo

Não rode `scripts/process-asset.mjs` ainda — isso só acontece depois que
alguém aprovar cada geração no checklist de marca (aderência à paleta,
sem clichês proibidos, sem texto embutido, funciona nos dois temas
quando aplicável, coerência com o resto do lote). Reporte ao final: quais
das 11 gerações ficaram prontas, quais falharam (e por quê), e o caminho
de cada arquivo gerado, para a revisão humana começar.
