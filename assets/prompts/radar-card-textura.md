---
slug: radar-card-textura
usage: 'Textura de fundo do card de compartilhamento do radar (components/result/ShareRadarButton.tsx) — o "mini-certificado"'
aspectRatio: '1:1'
minResolution: '1080x1080'
variants: [light, dark]
weightBudgetKb: 70
history: []
---

## Prompt

Textura de fundo para o card compartilhável do radar de competências — o
"mini-certificado" descrito em `DESIGN.md` §6. Só a TEXTURA de fundo é
gerada aqui: a linha de conquista em si e a moldura de nó-e-galho
permanecem SVG programático do Épico 15 (`PatternGrowthLine` +
`PatternNodeBranch`), desenhados por cima desta textura no componente.
Textura sutil, quase uniforme, evocando papel/superfície de certificado
(leve variação tonal, sem elementos figurativos), nas cores da marca.

**Variante light:** base Chalk `#F7F7F5` com leve variação tonal em
direção a Mint `#E6F4EE`.

**Variante dark:** base próxima de Ink `#141414` / Deep Forest, com leve
variação tonal em direção a Forest `#1B6A45`.

## Restrições negativas específicas

Nenhum elemento gráfico que possa colidir visualmente com o padrão
`PatternGrowthLine`/`PatternNodeBranch` desenhado por cima (SVG
programático, não parte desta geração) — a textura precisa ficar
subordinada, nunca competir com esses elementos.
