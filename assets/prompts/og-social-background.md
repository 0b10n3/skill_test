---
slug: og-social-background
usage: 'Fundo do OG/social card (app/opengraph-image.tsx) — atrás do texto de resultado, gerado dinamicamente por rota'
aspectRatio: '1.91:1'
minResolution: '1200x630'
variants: []
weightBudgetKb: 80
history: []
---

## Prompt

Textura de fundo sutil em nó-e-galho, campo completo, bem baixa
densidade/contraste — precisa funcionar como CAMADA DE FUNDO atrás de
texto grande renderizado por cima (título, score, classificação) via
`@vercel/og`/Satori, então a estrutura deve ficar discreta o bastante para
não competir com o texto (opacidade visual baixa desde a própria
geração, não só via CSS depois — Satori não aplica opacidade a imagens de
fundo com a mesma flexibilidade de CSS). Fundo Forest `#1B6A45` sólido ou
quase sólido, com a estrutura nó-e-galho em Grove `#2D9E67` bem sutil por
cima.

## Restrições negativas específicas

Nenhuma área de alto contraste/densidade que possa colidir com texto
sobreposto em qualquer região da imagem — a peça precisa ser "segura" em
toda a área, já que o texto pode ocupar posições diferentes por rota
(resultado varia por classificação/score).
