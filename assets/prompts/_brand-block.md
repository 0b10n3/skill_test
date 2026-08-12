# Bloco-padrão de marca (obrigatório em todo prompt)

Fonte canônica: `DESIGN.md` §§4–5, `docs/design-system.md` §4. Este arquivo é a
ÚNICA fonte do texto injetado em todo prompt gerado — nenhum arquivo de
prompt individual copia este bloco; a skill de geração
(`.agents/skills/gerar-asset-marca/`) concatena este arquivo ao corpo de
`assets/prompts/<slug>.md` na hora de montar o prompt final enviado ao
Nano Banana Pro. Mudou a paleta ou a direção estética? Edita só aqui.

## Paleta restrita (hexes exatos — nunca aproximar)

- Forest `#1B6A45` — âncora institucional, estrutura, UI principal.
- Grove `#2D9E67` — ação, cor secundária, crescimento.
- Amber `#C9832A` — exclusivo de conquista real, nunca decoração neutra.
- Chalk `#F7F7F5` — fundo claro.
- Ink `#141414` — fundo escuro / texto sobre claro.
- Mint `#E6F4EE` — fundos suaves, cards informativos.
- Cream `#F5EDD6` — fundos de conquista/objetivo.
- Mist `#E2E8F0` — bordas, linhas divisórias, grade de dados.

## Direção estética

Estrutura, árvore sintática / AST, grafos e ramificações — nó-e-galho é o
conceito unificador da marca (ver `DESIGN.md` §5.1). Geométrico, editorial,
sóbrio. Rigor sem enfeite; tensão real, não clichê de fintech.

## Proibições (negative constraints — sempre incluir)

- Candlestick / gráfico de vela (clichê genérico de fintech).
- Moedas, cifrões, símbolos de dinheiro literais.
- Robôs, cérebros ou qualquer ícone genérico de "IA".
- Glassmorphism, gradientes fora da paleta acima.
- Pessoas fotorrealistas.
- Qualquer texto renderizado dentro da imagem (título, legenda, watermark).
