---
slug: hero-landing-pessoas
usage: 'Landing (/) — caixa lateral ao lado do headline/CTA, coluna própria (não fundo full-bleed). Substitui hero-landing (Épico 29).'
aspectRatio: '4:5'
minResolution: '1536x1920'
variants: [light, dark]
weightBudgetKb: 120
history:
  - date: 2026-09-04
    version: 1
    file: assets/generated/raw/hero-landing-pessoas/2026-09-04-v1.png
    decision: approved
  - date: 2026-09-04
    version: 2
    file: assets/generated/raw/hero-landing-pessoas/2026-09-04-v2.png
    decision: rejected # tela do laptop com título "Portfolio Optimization" legível — viola a
    # proibição explícita de texto renderizado legível em qualquer superfície da cena
  - date: 2026-09-04
    version: 3
    file: assets/generated/raw/hero-landing-pessoas/2026-09-04-v3.png
    decision: pending
---

## Prompt

Fotografia editorial/documental — não banco de imagens corporativo — de uma pessoa jovem adulta
(fim de vinte/início de trinta anos) estudando finanças quantitativas numa mesa de trabalho.
Vista de três-quartos ou de lado, foco no gesto de estudo real: anotações à mão numa caderno ao
lado do laptop, xícara de café, uma régua ou calculadora financeira física por perto. A tela do
laptop mostra dados/gráficos genéricos, fora de foco o bastante para não ser lido como texto
real (nunca uma interface reconhecível ou marca de terceiro). Luz natural de janela lateral,
sombras reais e suaves (a peça inteira passa por correção de duotone depois — a fotografia
bruta não precisa nem deve tentar caber nos hexes da marca).

**Enquadramento (v2, corrigido — DESIGN.md/Épico 30):** vertical, proporção 4:5, não 16:9. A
peça é usada como caixa lateral ao lado do texto (não como fundo full-bleed atrás do headline),
então não precisa de espaço negativo lateral para overlay — o enquadramento deve preencher o
quadro vertical com a cena (pessoa + mesa + laptop), mais próximo, sem sobra de fundo vazio nas
laterais. Mesa vista de um ângulo que funcione alto/estreito: laptop mais para o topo do quadro,
mãos/caderno na parte inferior, ou uma composição vertical equivalente que não pareça uma foto
horizontal simplesmente cortada nas laterais.

Registro: sério, focado, sem sorriso performático para câmera — a pessoa está genuinamente
concentrada, não posando. Sem contato visual com a câmera.

**Variante light e dark:** a mesma fotografia (ambiente com luz natural, tons neutros) —
`assets:process` aplica dois duotones diferentes (`#1B6A45`/`#F7F7F5` para light,
`#1B6A45`/`#141414` para dark) sobre o mesmo raw, mesmo mecanismo do asset anterior.

## Restrições negativas específicas

Além do bloco-padrão (`_brand-block.md`, seção "Peças com pessoas"): nenhum texto de tela de
laptop legível; nenhuma marca/logo de terceiro visível (laptop, caderno, xícara sem
identificação de marca); nenhum sorriso de banco de imagens; nenhuma pose de "trabalho em
equipe" ou aperto de mão — é uma pessoa, sozinha, estudando.
