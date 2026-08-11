# ÉPICO 16 — Pipeline de Assets Generativos (Nano Banana Pro via agy)

**Depende de:** Épico 14 concluído (pode rodar em paralelo ao 15). **Fontes de verdade:** `REDESIGN.md` §§3.3–4, `DESIGN.md` §§4–5 e §7 (checklist de marca).

## Objetivo

Montar o pipeline reprodutível de geração de imagens com Nano Banana Pro invocado via agy — prompts versionados, gate de revisão humana, correção de cor para os tokens e otimização para web — e produzir o primeiro lote de assets aprovados para os Épicos 17–18.

## Escopo

- **Skill agy de geração** (`.agents/skills/` do projeto, padrão SKILL.md já usado no workflow ClickUp+agy): comando que recebe o slug de um prompt em `assets/prompts/<slug>.md`, invoca o Nano Banana Pro e grava a saída em `assets/generated/raw/<slug>/<AAAA-MM-DD>-vN.png`, nunca sobrescrevendo gerações anteriores; registra no cabeçalho do arquivo de prompt o histórico de gerações (data, versão, decisão).
- **Formato do arquivo de prompt** (frontmatter + corpo): slug; uso destinado (página/seção); proporção e resolução mínima; variantes (light/dark) quando aplicável; prompt; restrições negativas; e o **bloco-padrão de marca obrigatório** — hexes exatos da paleta (Forest `#1B6A45`, Grove `#2D9E67`, Amber `#C9832A`, Chalk `#F7F7F5`, Ink `#141414`, Mint, Cream, Mist), direção estética ("estrutura, árvore sintática/AST, grafos e ramificações; geométrico, editorial, sóbrio") e proibições (candlestick, moedas/cifrões, robôs/cérebros genéricos de IA, glassmorphism, gradientes fora da paleta, pessoas fotorrealistas, qualquer texto renderizado na imagem).
- **Lote inicial de assets** (lista mínima; prompts escritos neste épico):
  1. Hero da landing — composição abstrata nó-e-galho "crescendo" (variantes light/dark).
  2. Cinco ilustrações de dimensão (mercados-produtos, matemática-quant, dados-programação, IA aplicada, risco-regulação) em estilo unificado, para landing e relatório.
  3. Fundo do OG/social card do app e textura de fundo do card compartilhável do radar (o "mini-certificado" — a linha de conquista em si permanece SVG programático do Épico 15; a geração cobre apenas a textura de fundo).
  4. Imagem de estado vazio/erro na voz da marca.
- **Gate de revisão humana:** checklist de aprovação por asset (aderência à paleta, sem clichês proibidos, sem texto embutido, funciona nos dois temas quando aplicável, coerência com o restante do lote) registrado em `assets/manifest.json`; reprovado → nova iteração de prompt (nunca edição sem registro).
- **Correção de cor:** script de processamento que aplica recolor/duotone dos assets aprovados para os hexes exatos dos tokens quando a geração sair aproximada — o publicado bate com os tokens, não "quase".
- **Otimização e publicação:** resize para os breakpoints reais de uso, AVIF/WebP + fallback, strip de metadados, saída em `public/img/<slug>/`; `assets/manifest.json` liga cada asset publicado ao prompt de origem, versão aprovada e páginas que o usam.
- **Orçamento de peso por asset** definido no manifest (ex.: hero ≤ 120KB no maior breakpoint em AVIF) — insumo do gate de Lighthouse do Épico 19.

## Critérios de aceite

- Dado um slug de prompt existente, quando a skill agy é executada, então a nova geração aparece versionada em `raw/` sem sobrescrever nada e com o histórico atualizado.
- Dado um asset aprovado, quando processado, então as cores dominantes da versão publicada correspondem aos hexes dos tokens (verificação por script de amostragem de paleta) e todas as variantes/formatos do manifest existem em `public/img/`.
- Dado um asset em `public/img/`, quando rastreado, então o manifest identifica seu prompt de origem e a versão raw aprovada (nenhum asset "órfão").
- Dado o lote inicial, quando revisado, então os 8+ assets (hero ×2 temas, 5 dimensões, OG, textura do card, estado vazio) estão aprovados no checklist e dentro do orçamento de peso.

## Testes obrigatórios

- Teste do script de processamento (entrada de referência → variantes, formatos e pesos esperados).
- Script de verificação de integridade do manifest em CI: todo asset publicado tem origem e orçamento; nenhum arquivo em `public/img/` fora do manifest.
- Verificação de paleta (amostragem) dos assets publicados contra os tokens, com tolerância definida e documentada.

## Gate — critério para liberar os Épicos 17/18

- [ ] Skill agy funcional e documentada (como rodar, como iterar um prompt reprovado).
- [ ] Lote inicial 100% aprovado no checklist de marca e publicado via manifest.
- [ ] Verificações de manifest e paleta verdes em CI.
- [ ] Todos os assets dentro do orçamento de peso.

## Boas práticas aplicadas

Geração de imagem tratada como build reprodutível, não como sessão criativa avulsa: prompt versionado é código-fonte, a saída bruta é artefato imutável, a aprovação é registrada e o publicado é derivado por script — seis meses depois, qualquer pessoa consegue responder "de onde veio esta imagem e por que ela é assim", com a mesma rastreabilidade que o resto do repositório.
