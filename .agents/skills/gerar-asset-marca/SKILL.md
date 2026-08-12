---
name: gerar-asset-marca
description: Gera (ou itera) um asset de imagem da marca Syntaxis via Nano Banana Pro, invocado pelo agy, a partir de um prompt versionado em assets/prompts/<slug>.md. Use quando precisar produzir/regenerar um dos assets do lote do Épico 16 (hero, ilustrações de dimensão, fundo OG, textura do card, estado vazio) ou qualquer novo asset generativo futuro que siga o mesmo pipeline.
---

# Gerar asset de marca (Nano Banana Pro via agy)

Esta skill trata geração de imagem como **build reprodutível, não sessão
criativa avulsa** (ver `specs/epicos/epico-16-assets-generativos-agy.md`
§"Boas práticas aplicadas"): o prompt versionado é código-fonte, a saída
bruta é artefato imutável, a aprovação é registrada, e o publicado é
sempre derivado por script — nunca editado à mão.

> **Nota de escopo (Épico 16):** este arquivo documenta o CONTRATO da
> skill — input esperado, passos, output. A invocação real do Nano Banana
> Pro depende do `agy` (Antigravity CLI) configurado no ambiente de quem
> roda a skill; adapte o passo 3 abaixo para a sintaxe real da instalação
> local do `agy`, que não está disponível no ambiente onde este pipeline
> foi montado.

## Input

Um slug de prompt existente em `assets/prompts/<slug>.md` (ver os 9
arquivos do lote inicial nesse diretório, mais `_brand-block.md`, que é
compartilhado — nunca copiado dentro de cada prompt individual).

## Passos

1. **Ler o prompt.** Carregar `assets/prompts/<slug>.md` (frontmatter +
   corpo) e `assets/prompts/_brand-block.md` (compartilhado).
2. **Montar o prompt final.** Concatenar: corpo de `<slug>.md` (seção
   "Prompt") + `_brand-block.md` (paleta, direção estética, proibições) +
   "Restrições negativas específicas" do próprio `<slug>.md`, se houver.
   Se o frontmatter listar `variants` (ex.: `[light, dark]`), gerar uma
   invocação por variante, anexando ao prompt qual variante está sendo
   pedida (ver texto de cada variante no corpo do prompt).
3. **Invocar o Nano Banana Pro via agy.** Comando de referência (adaptar
   à sintaxe real do `agy` instalado):
   ```bash
   agy run nano-banana-pro \
     --prompt-file assets/prompts/<slug>.md \
     --brand-block assets/prompts/_brand-block.md \
     --aspect-ratio "<aspectRatio do frontmatter>" \
     --min-resolution "<minResolution do frontmatter>" \
     --out assets/generated/raw/<slug>/
   ```
4. **Gravar a saída versionada.** Nome do arquivo:
   `assets/generated/raw/<slug>/<AAAA-MM-DD>-v<N>.png`, onde `N` é
   incremental por slug (nunca reaproveitar número, nunca sobrescrever um
   arquivo existente — cada geração é um artefato imutável novo). Se o
   slug tiver variantes, cada variante grava seu próprio arquivo:
   `assets/generated/raw/<slug>/<AAAA-MM-DD>-v<N>-<variant>.png`.
5. **Atualizar o histórico.** Acrescentar uma entrada em `history:` no
   frontmatter de `assets/prompts/<slug>.md`:
   ```yaml
   history:
     - date: 2026-08-12
       version: 1
       file: assets/generated/raw/hero-landing/2026-08-12-v1-light.png
       decision: pending # pending | approved | rejected
   ```
6. **Gate de revisão humana.** Uma pessoa avalia a geração contra o
   checklist de marca (`DESIGN.md` §7 + `docs/design-system.md`): aderência à
   paleta, sem clichês proibidos, sem texto embutido, funciona nos dois
   temas quando aplicável, coerência com o restante do lote. Atualiza
   `decision` da entrada do histórico para `approved` ou `rejected`.
   - **Reprovado:** nunca editar a imagem à mão. Ajustar o texto do
     prompt (`assets/prompts/<slug>.md`) e repetir os passos 1-6 — a
     nova tentativa vira uma nova versão no histórico, a reprovada
     permanece registrada (rastreabilidade: "por que essa versão não
     ficou boa" é tão importante quanto "por que a aprovada ficou boa").
   - **Aprovado:** rodar `node scripts/process-asset.mjs <slug>
--raw <caminho-do-arquivo-aprovado>` (ver
     `scripts/process-asset.mjs`) para corrigir cor, otimizar e publicar
     em `public/img/<slug>/`, atualizando `assets/manifest.json`.

## Por que nunca sobrescrever

Cada arquivo em `assets/generated/raw/` é um artefato imutável. Isso
permite responder, meses depois, "de onde veio esta imagem e por que ela
é assim" — a mesma rastreabilidade que o resto do repositório já tem para
código (git blame) e para os bancos de questão arquivados
(`data/archive/`, `design/archive/`).
