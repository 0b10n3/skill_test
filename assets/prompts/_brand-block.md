# Bloco-padrão de marca (obrigatório em todo prompt)

Fonte canônica: `DESIGN.md` §4 (identidade visual) e §6.1 (símbolo/nó-e-galho),
`docs/design-system.md` §4. Este arquivo é a
ÚNICA fonte do texto injetado em todo prompt gerado — nenhum arquivo de
prompt individual copia este bloco; a skill de geração
(`.agents/skills/gerar-asset-marca/`) concatena este arquivo ao corpo de
`assets/prompts/<slug>.md` na hora de montar o prompt final enviado ao
Nano Banana Pro. Mudou a paleta ou a direção estética? Edita só aqui.

## Paleta restrita (hexes exatos — nunca aproximar)

- Forest `#1B6A45` — âncora institucional, estrutura, UI principal.
- Grove `#2D9E67` — ação, cor secundária, crescimento.
- Lime `#CDF163` — exclusivo de conquista/energia real, nunca decoração neutra (v2.0.0: substitui Amber).
- Chalk `#F7F7F5` — fundo claro.
- Ink `#141414` — fundo escuro / texto sobre claro / texto sobre superfície Lime.
- Mint `#E6F4EE` — fundos suaves, cards informativos.
- Mist `#E2E8F0` — bordas, linhas divisórias, grade de dados.

## Direção estética

Estrutura, árvore sintática / AST, grafos e ramificações — nó-e-galho é o
conceito unificador da marca (ver `DESIGN.md` §6.1). Geométrico, editorial,
sóbrio. Rigor sem enfeite; tensão real, não clichê de fintech. Cantos retos —
nenhum elemento arredondado (exceto o símbolo circular do logo, quando
presente): sem cantos suavizados, sem blobs, sem formas orgânicas.

### Peças com pessoas (exceção de 04/09/2026 — ver `_como-gerar-pessoas.md` se existir, ou a

regra abaixo)

"Pessoas fotorrealistas" deixou de ser proibição geral — decisão do founder para o hero da
landing, que precisa de gente estudando/aprendendo finanças, não de metáfora abstrata. Onde uma
peça mostra pessoas: fotorrealista de verdade (não ilustração estilizada de pessoa), contexto
real de estudo/mesa de trabalho — anotações, laptop com dado real na tela (nunca texto
inventado e legível), ambiente que pareça editorial/documental, não "banco de imagens
corporativo" (sem sorriso de dentes forçado, sem aperto de mão, sem grupo posando pra câmera).
Diversidade real de idade/gênero/etnia — o público é estagiário a analista, não um perfil só.
A paleta da cena (roupa, luz, fundo) pode ser neutra/realista; o que precisa respeitar a marca é
o _tratamento_ ao redor da foto (moldura, overlay, tipografia), nunca a foto em si forçada a
caber nos hexes da paleta.

## Proibições (negative constraints — sempre incluir)

- Candlestick / gráfico de vela (clichê genérico de fintech).
- Moedas, cifrões, símbolos de dinheiro literais.
- Robôs, cérebros ou qualquer ícone genérico de "IA".
- Glassmorphism.
- Gradiente fora do grupo `gradient.ambient` (`DESIGN.md` §4.5) — e mesmo esse, nunca em
  componente nem atrás de texto direto.
- Pessoa fotorrealista **fora** do contexto de estudo/aprendizado descrito acima (ex.: pessoa
  como decoração genérica, sem função editorial).
- Qualquer texto renderizado dentro da imagem (título, legenda, watermark) — inclusive texto de
  tela de laptop/anotação que precise ser legível.
- Cantos arredondados, formas orgânicas ou elementos "friendly" — o sistema é reto.
