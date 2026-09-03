# Syntaxis — DESIGN.md

**Manual de Marca** · Fonte única da verdade para identidade visual, voz e aplicação de marca
**v3.0** · 03/09/2026 — documento reescrito do zero.

---

---

## Sumário

0. [O que esta versão é](#0-o-que-esta-versão-é)
1. [Fundamentos da Marca](#1-fundamentos-da-marca)
2. [Público](#2-público--a-moldura-de-marca-sobre-audiencesmd)
3. [Personalidade e Voz](#3-personalidade-e-voz)
4. [Identidade Visual](#4-identidade-visual)
5. [O contrato de camadas](#5-o-contrato-de-camadas)
6. [Sistema de padrões](#6-sistema-de-padrões)
7. [Camada de ilustração](#7-camada-de-ilustração--collage--paper-cut)
8. [Acessibilidade](#8-acessibilidade--alvo-declarado)
9. [Aplicação em materiais de curso](#9-aplicação-em-materiais-de-curso)
10. [Checklist rápido](#10-checklist-rápido)
11. [Lacunas abertas](#11-lacunas-abertas)

## 0. O que esta versão é

### Escopo da reescrita

Esta é a primeira versão escrita **a partir da evidência**, e não por emenda sobre a anterior.
Nenhum invariante de marca mudou: Forest, Grove e Lime, o trio tipográfico, a voz da §3, a
promessa da §1.3 e o conceito unificador nó-e-galho seguem exatamente os mesmos. O que mudou é
o documento — e três coisas dentro dele que a evidência derrubou.

| #   | O que mudou                                                                                                                           | Por quê                                                                                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | O sistema de padrões foi **reconstruído sobre a geometria medida do símbolo**                                                         | o pattern primário e o símbolo não compartilhavam ângulo, módulo nem terminação: a família era o nome, não o desenho (§6.1) |
| 2   | A marca passa a ter **duas camadas declaradas** — sistema e ilustração — com fronteira escrita como regra checável                    | a proibição de sombra e de curva vivia como regra única e vinha sendo revogada por fora, sem registro (§5)                  |
| 3   | A camada de ilustração é **collage / paper cut com profundidade por degrau de tom**, promovida do pipeline editorial ao SSOT da marca | dois vocabulários de ilustração coexistiam sob a mesma marca (§7)                                                           |

O sistema de padrões passou de três famílias para **duas**. Reduzir foi o resultado.

### Histórico de versões

| Versão   | Mudança                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0     | Consolidação do pivô (newsletter → plataforma): voz, padrões geométricos, paleta Forest/Grove/Amber                                                                                                                                                                                                                                                                           |
| v1.1     | Regras de composição digital: assinaturas visuais e anti-padrões de "design de IA"                                                                                                                                                                                                                                                                                            |
| v2.0     | **Amber → Lime** (Forest/Grove intocados) · **cantos retos** · **tipografia grotesca moderna**                                                                                                                                                                                                                                                                                |
| v2.1     | Revisão de coerência cross-superfície; escopo em §4.5; `APLICACAO.md` passa a governar superfícies de terceiros                                                                                                                                                                                                                                                               |
| **v3.0** | **Documento reescrito do zero.** Patterns reconstruídos sobre a geometria medida do símbolo; contrato de camadas explícito; camada de ilustração unificada em collage / paper cut; alvo de acessibilidade declarado (§8). A v2.1 inteira está em `_arquivo/revisao-2026-2026-09-03/DESIGN-v2.1.md`; o rastro da decisão, em `revisao-2026/00-linha-zero.md` … `04-cleanup.md` |

**Por que reescrever em vez de emendar.** A v2.1 acumulava regra sem escopo declarado. Uma
regra sem escopo é revogada por fora — foi o que aconteceu com a proibição de iconografia
financeira, revogada num pipeline sem registro aqui (`_arquivo/DECISOES-HERDADAS.md`, E3). A
v3.0 declara escopo em toda regra que tem mais de um contexto de aplicação.

### O pivô de produto (mantido da v1.0)

| Antes (Substack de investimentos)                | Agora (plataforma de treinamento)                                                |
| ------------------------------------------------ | -------------------------------------------------------------------------------- |
| Público: investidores pessoa física              | Público: estagiários e analistas do mercado de capitais brasileiro               |
| Promessa: conectar portfólio a objetivos de vida | Promessa: skills técnicas aplicáveis no trabalho, incluindo fluência em IA       |
| Formato: newsletter editorial                    | Formato: aulas expositivas + cases reais + skills de IA entregáveis              |
| Metodologia implícita                            | Metodologia explícita e rigorosa (`education/METHODOLOGY.md`)                    |
| Voz: analítica e humana                          | Voz: **técnica e precisa, no estado da arte acadêmico, mas leve e bem-humorada** |

---

## 1. Fundamentos da Marca

### 1.1. Essência

**Estrutura que vira competência.**

A Syntaxis existe para transformar a estrutura de uma decisão real de mercado — com toda a sua
ambiguidade institucional brasileira — em uma capacidade técnica nova e verificável no
trabalho.

### 1.2. Estrutura Estratégica

| Pilar               | Definição                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Propósito**       | Ensinar as skills técnicas que o mercado de capitais brasileiro realmente usa — modelagem, dados, renda fixa, IA aplicada — através de professores que somam carreira acadêmica sólida a experiência de mercado real.    |
| **Visão**           | Ser a referência brasileira em formação técnica para o mercado financeiro, reconhecida por ensinar através de decisões reais, não de exercícios de enunciado limpo.                                                      |
| **Missão**          | Projetar cada aula e cada case com backward design a partir de uma competência observável no trabalho, entregando ao final de cada módulo as _skills_ de IA e os arquivos de contexto que o aluno leva para o dia a dia. |
| **Mecanismo único** | Professor híbrido (acadêmico + mercado) · case brasileiro real com tensão institucional (CVM, CMN) · AI-first como competência entregável, não como enfeite de marketing.                                                |

### 1.3. Promessa de Resultado

> _Skills e ferramentas de trabalho real — incluindo IA — para alcançar o próximo nível da carreira._

Esta é a promessa-guia definida em `MARKETING_REVIEW.md` §4 e deve substituir qualquer formulação genérica ("aprenda finanças", "domine investimentos") em toda peça de copy, aula ou material de curso.

**Regra de verificabilidade:** a promessa é checável na prática do próprio trabalho do aluno (ele sabe se passou a usar a skill ou não) — nunca prometemos número de salário ou promoção que a Syntaxis não controla. Linha vermelha, não sugestão de estilo.

> **Nota de ponteiro (v3.0, 03/09/2026).** O texto acima é reposto **verbatim** por ser
> invariante, e por isso a citação `MARKETING_REVIEW.md` foi preservada como está. Esse arquivo
> não existe com esse nome: o documento é [`strategy/MARKETING.md`](../strategy/MARKETING.md).
> A promessa e a regra de verificabilidade são o invariante; o caminho não é.

### 1.4. Valores Fundamentais

**Rigor sem enfeite.** Todo conteúdo segue o estado da arte acadêmico — bibliografia real,
taxonomia de Bloom, cognitive load theory. Rigor não é forma; é a razão pela qual o aluno
confia no professor híbrido.

**Tensão real, não exercício limpo.** Um case da Syntaxis reconstrói uma decisão sob incerteza
institucional brasileira. Nunca um enunciado com resposta única — a competência que importa é
decidir e defender, não calcular.

**IA como ferramenta, não como enfeite.** `education/METHODOLOGY.md` §2 é claro: a IA é
competência entregável. Toda peça de marca trata IA com a mesma seriedade técnica que trata
renda fixa ou modelagem.

**Leveza que não abre mão do rigor.** Humor e leveza de tom nunca substituem precisão técnica.
A leveza vive no _como_ se diz, nunca no _o quê_ se afirma — §3.3.

---

## 2. Público — a moldura de marca sobre `AUDIENCES.md`

`strategy/AUDIENCES.md` é o SSOT de segmentação para copy de vendas e continua sendo. Os quatro
segmentos (`#Millennials-FEAR`, `#Millennials-GREED`, `#GENZ-FEAR`, `#GENZ-GREED`) seguem
governando _estrutura de argumento_ em qualquer peça comercial.

O que este documento acrescenta é a **moldura comum** que sobrevive acima dos quatro eixos:

- O público é sempre um **profissional adulto**, mesmo o estagiário de 19 anos — tratamento
  andragógico sem exceção.
- O contexto é sempre o **mercado de capitais brasileiro**, com sua ambiguidade institucional
  específica (CVM, CMN, Anbima) — nunca conteúdo genérico traduzido.
- A prova é sempre **verificável no trabalho real**.
- O professor é sempre **híbrido** — a autoridade vem da combinação academia + mercado.

**Regra de uso:** confirme o segmento em `AUDIENCES.md`, depois aplique a voz da §3. Os dois
nunca são usados isoladamente.

---

## 3. Personalidade e Voz

_(Inalterada da v1.0/v1.1 — reproduzida integralmente por ser SSOT.)_

> **Distinção de escopo (acrescentada em 31/08/2026):** esta seção é a voz de **marca e
> produto** — como a Syntaxis fala em copy, curso e material comercial. Não é a mesma coisa
> que a voz **autoral** de quem escreve o Substack, documentada em
> `pipelines/hemingway/estilo/estilo-autoral.md` (a prosa ensaística/pessoal de um autor
> específico). Os dois convivem porque descrevem coisas diferentes — nenhum substitui o
> outro. Ao escrever copy/produto, use esta seção; ao escrever um post de Substack, use
> `estilo-autoral.md`.

### 3.1. Arquétipo: O Professor Híbrido

A Syntaxis fala como a pessoa que o mecanismo único do produto descreve: alguém com carreira acadêmica sólida **e** experiência real de mercado, que já viu a ambiguidade institucional brasileira de perto e não tem paciência para conteúdo genérico traduzido — mas também não tem nenhuma necessidade de provar isso sendo solene. É competência confortável consigo mesma.

### 3.2. Os Dois Eixos de Tom

**Técnico e preciso, no estado da arte da academia — sem perder a leveza e o bom humor.** Dois eixos independentes, não um meio-termo:

| Eixo                | O que significa                                                                                                  | O que NÃO significa                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Rigor acadêmico** | Toda afirmação tem lastro — bibliografia real, dado com fonte, verbo de Bloom correto no objetivo de aprendizado | Jargão por jargão; complicar para parecer inteligente                            |
| **Leveza e humor**  | Analogias vívidas, autoironia ocasional sobre o próprio mercado financeiro, ritmo de frase que não cansa         | Piada forçada; meme; infantilização; humor que descredibiliza o conteúdo técnico |

A regra de ouro: **o rigor nunca é sacrificado pela leveza, e a leveza nunca é sacrificada pelo rigor.**

### 3.3. Onde o humor vive (e onde não vive)

| Local                                                 | Humor permitido?                                               |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| Abertura de aula ("por que isso importa no trabalho") | Sim — lugar ideal para analogia leve antes do conteúdo técnico |
| Transições entre blocos de conteúdo                   | Sim, com moderação                                             |
| Objeções de venda ("acho que já é tarde para mim")    | Sim — reconhecer com leveza antes de responder com dado real   |
| A tensão institucional de um case                     | **Não** — a ambiguidade regulatória é o ponto pedagógico       |
| Dado numérico ou afirmação técnica                    | **Não** — precisão em números e fontes é inegociável           |
| Nota de Ensino (documento para o professor)           | Tom direto e técnico; humor mínimo                             |

### 3.4. Regras de Vocabulário

- **Português como padrão.** Termos técnicos em inglês quando são o termo de mercado real (_duration_, _case_, _asset_, _trainee_, _yield_) — nunca por afetação.
- **Nomes comerciais em português.** Nomenclatura interna de projeto pode continuar em inglês, mas nunca vaza para a página de vendas ou para o aluno.
- **Tratamento: "você".** Direto, sem formalidade excessiva.
- **Sem emoji em material técnico.** Emoji apenas em canais informais.
- **Todo percentual leva fonte.** Regra universal de marca.

### 3.5. A voz também é pedagógica

- **Abrir por relevância, não por definição** — nunca comece explicando "o que é" antes de "por que importa agora, no seu trabalho".
- **Reduzir carga cognitiva extrínseca** — ruído visual e jargão desnecessário são o mesmo erro em contextos diferentes.
- **Não infantilizar o adulto profissional** — se uma frase soaria estranha dita a um colega de trabalho, não deveria estar em nenhum material da Syntaxis.

### 3.6. Guia rápido Do / Don't

| Faça                                                       | Não faça                                                 |
| ---------------------------------------------------------- | -------------------------------------------------------- |
| Abrir com o problema de mercado antes da definição técnica | Abrir com "Hoje vamos aprender sobre..."                 |
| Citar a fonte de todo dado numérico                        | Afirmar percentual sem origem rastreável                 |
| Usar analogia leve para destravar um conceito difícil      | Usar piada que trivializa o risco ou a tensão de um case |
| Tratar o aluno como colega júnior competente               | Tratar o aluno como leigo total ou como criança          |
| Nomear trilhas e produtos em português                     | Misturar inglês de vaidade em nome comercial             |
| Reconhecer a objeção do aluno com leveza antes de rebater  | Ignorar a objeção e insistir só com entusiasmo           |

---

## 4. Identidade Visual

### 4.1. Paleta

| Nome        | Hex       | Papel                                                                                                                                      |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Forest**  | `#1B6A45` | Âncora — títulos, UI institucional, estrutura                                                                                              |
| **Grove**   | `#2D9E67` | Estrutura em movimento — links, progresso, padrões, estados ativos                                                                         |
| **Lime**    | `#CDF163` | **Energia, ação e conquista — o "sinal no escuro".** CTAs, marcadores de headline, números-destaque sobre fundo escuro, selos de conquista |
| Mint        | `#E6F4EE` | Fundos suaves, cards informativos                                                                                                          |
| Deep Forest | `#0F3D27` | Superfícies escuras intencionais, bandas                                                                                                   |
| Chalk       | `#F7F7F5` | Fundo Light Mode                                                                                                                           |
| Ink         | `#141414` | Fundo Dark Mode; texto sobre fundos claros **e sobre Lime**                                                                                |
| Slate       | `#4A5568` | Texto secundário — o único cinza de texto permitido sobre fundo claro                                                                      |
| Mist        | `#E2E8F0` | Bordas, hairlines, divisórias                                                                                                              |

**Escala Lime:** lime-100 `#F2FBD9` (fundos de conquista) · lime-300 `#DFF7A1` (realces, hover
do botão primário, eyebrow sobre banda escura) · lime-500 `#CDF163` (superfícies e marcadores)
· lime-700 `#5F7D1C` (texto lime sobre fundo claro, AA) · lime-900 `#3B4E10` (texto lime de
alto contraste).

**Regras duras do Lime:**

- Lime-500 **nunca** é texto pequeno sobre fundo claro. Medido: sobre Chalk dá **1,20:1** — não
  é indesejável, é ilegível. Sobre claro, texto lime usa 700/900.
- Texto sobre superfície lime é **sempre Ink**.
- Lime marca conquista real ou ação, nunca decoração ambiente.
- **Amber e Cream estão aposentados.** Nenhuma peça nova os usa.

**Pares que não servem para texto**, medidos e registrados para não voltarem por tentativa:
Grove sobre Mint 2,99:1 · Forest sobre Ink 2,80:1 · Slate sobre Ink 2,45:1. É por isso que o
modo escuro tem cinza próprio: `theme.dark.mutedForeground` `#94A3B8`, escolhido por medição
(6,04:1 contra `dark.muted`, 7,51:1 contra `dark.background`), não herdado de framework.

### 4.2. Tipografia

| Papel         | Fonte              | Uso                                         |
| ------------- | ------------------ | ------------------------------------------- |
| **Display**   | **Space Grotesk**  | Headlines, títulos de seção                 |
| **Body**      | **Hanken Grotesk** | Corpo, UI, formulários                      |
| **Data/Code** | **Space Mono**     | Métricas, código, comandos, paths, eyebrows |

Space Grotesk e Space Mono compartilham DNA — a proporcional deriva da mono, e o par dá coesão
display↔dados sem esforço. Hanken Grotesk é neutra o suficiente para não competir com o
display. **Sem serif no sistema, sem itálico em display** — Space Grotesk não possui itálico, e
a ênfase de headline é feita por cor e marcador (§4.4.2).

Blocos de código em Space Mono sobre Deep Forest ou Ink, texto Chalk, com Grove nas keywords e
Lime nos valores. Display em Medium/Bold com tracking levemente negativo em tamanho grande;
corpo em Regular/Medium; nunca Light em tela.

### 4.3. Hierarquia tipográfica

| Papel               | Token                                              | Regra de composição                                                                                  |
| ------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Headline de hero    | `displayXxl` (64/40px, Space Grotesk Bold)         | Uma por página, com palavra-destaque (§4.4.2). Nunca centralizada com dois botões simétricos         |
| Eyebrow de seção    | `eyebrow` (Space Mono, caixa alta, tracking largo) | Toda seção abre com eyebrow curto                                                                    |
| Microcaption        | `caption` (Space Mono, corpo mínimo)               | **Abaixo** do título, carregando o dado que o título não cabe. Complementa o eyebrow, que fica acima |
| Título de seção     | `displayLg` / `heading1`                           | Display para títulos; Hanken para `heading2` e UI                                                    |
| Número protagonista | `statNumber` / `dataXl` (Space Mono Bold)          | Todo número que carrega argumento é grande e em mono. Sobre banda escura, pode ir em Lime            |
| Corpo               | `bodyLg` / `body` (Hanken Grotesk)                 | Texto secundário exclusivamente em Slate sobre claro                                                 |

**Regra dura:** se uma página usa apenas os tamanhos default do framework em progressão
uniforme, está errada por definição — a escala é a do arquivo de tokens, com salto deliberado
entre display e corpo.

### 4.4. Assinaturas visuais de produto

Sete dispositivos que tornam uma página reconhecível como Syntaxis. **Toda página pública usa
no mínimo três; o hero usa obrigatoriamente 1, 2 e 3.**

1. **Eyebrow mono.** Rótulo curto em Space Mono caixa alta acima de todo título de seção.
   Grove-700 sobre claro; Lime-300 sobre banda escura.
2. **Palavra-destaque lime.** No headline, **uma** palavra recebe marcador lime — sublinhado
   reto de 7px, bloco lime-500 com texto Ink, ou a própria palavra em lime sobre fundo escuro.
   Uma palavra, um dispositivo, nunca a frase inteira.
3. **Hairlines estruturais.** Linhas de 1px (Mist sobre claro, `border` sobre escuro)
   delimitando colunas, seções e tabelas — o grid é visível, como em terminal ou planilha.
4. **Banda escura.** Ao menos uma seção full-bleed em Deep Forest (ou Ink) com texto Chalk por
   página longa. É o habitat do Lime.
5. **Faixa de números.** Bloco de 2–4 métricas em `statNumber` com legenda `caption`. Toda
   métrica carrega **unidade e período explícitos** — densidade alta é legível quando cada
   número traz a própria legenda.
6. **Tile de evidência (bento).** Grid **assimétrico** de cards de canto reto, borda 1px Mist,
   sem sombra — cada tile mostra conteúdo real do produto, nunca ícone+título+parágrafo. Um
   tile pode ser promovido por **preenchimento**, nunca por sombra ou escala; e o preenchimento
   sozinho não basta (§8, SC 1.4.1).
7. **Botão reto.** CTA retangular (radius 0–2px). Primário lime-500 com texto Ink em qualquer
   tema; secundário outline 1.5px Forest sobre claro, Chalk sobre escuro. **Nunca pílula.**

### 4.5. Geometria — escopada por camada

A geometria da marca é declarada **por camada** desde esta versão. O contrato completo está na
§5; aqui ficam os valores.

| Propriedade | Camada de sistema                                                                                                                                                                      | Camada de ilustração                                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canto       | reto, radius 0; máximo 2px em chip/tag. Exceções, e são só estas três: avatar, o símbolo circular do logo, e o **controle de seleção nativo** — o círculo do radio e o ponto do switch | reto, ou corte a 45°                                                                                                                                                              |
| Curva       | **apenas** o quarto de arco derivado do símbolo (§6.1), e só como terminação de pattern                                                                                                | idem — curva orgânica livre é proibida nas duas camadas                                                                                                                           |
| Sombra      | proibida como recurso de hierarquia; o hairline faz o trabalho                                                                                                                         | **proibida**, inclusive entre camadas de papel — profundidade é degrau de tom (§7.2)                                                                                              |
| Gradiente   | proibido em superfície de UI                                                                                                                                                           | permitido **apenas** como rampa quantizada de tokens, e como remapeamento de luminância em imagem gerada (`scripts/lib/duotone.mjs`), nunca como gradiente contínuo de superfície |
| Textura     | retícula fina dentro de retângulo de canto reto, opacidade 0,15–0,20                                                                                                                   | retícula grossa como matéria, opacidade 1                                                                                                                                         |

Duas notas de escopo que evitam a revogação por fora:

- **O quarto de arco é o único elemento curvo que a geometria da marca de fato contém.** Ele
  vem do símbolo. Qualquer pattern derivado do símbolo o herda, e por isso "cantos retos" nunca
  significou "nenhuma curva em lugar nenhum" — significa nenhum raio de canto em componente.
- **A proibição de gradiente nunca valeu para imagem gerada.** A marca já usa rampa contínua em
  `duotone.mjs`, verificada por tolerância em `verify-asset-palette.mjs`. A proibição é de
  superfície de UI, onde um fundo não-sólido não tem par de token e por isso **sai
  silenciosamente do gate de contraste** — a WCAG não define método para fundo não-sólido.

### 4.6. Anti-padrões — escopados

Proibições verificáveis em revisão de PR. Cada uma declara a camada em que vale.

| Anti-padrão                                                                         | Camada         |
| ----------------------------------------------------------------------------------- | -------------- |
| Grid de três cards idênticos ícone-título-parágrafo                                 | sistema        |
| Hero centralizado genérico: título centrado, subtítulo, dois botões, sem evidência  | sistema        |
| Cinzas de framework (`#6B7280`, `#9CA3AF`) como texto sobre fundo claro             | sistema        |
| Cantos arredondados em card, botão, input ou imagem; radius "amigável" de 8–16px    | sistema        |
| Gradiente de superfície, glassmorphism, blob desfocado, glow                        | **as duas**    |
| Sombra como recurso de hierarquia ou de profundidade                                | **as duas**    |
| Emoji como ícone de feature                                                         | as duas        |
| Progressão uniforme de tamanhos de fonte, sem salto display/corpo                   | sistema        |
| Espaçamento uniforme entre todas as seções                                          | sistema        |
| Botão pílula                                                                        | sistema        |
| Texto renderizado dentro da imagem                                                  | **ilustração** |
| Traço à mão, rabisco, variação caligráfica                                          | **ilustração** |
| Registro caricato ou satírico; figura pública viva em registro que implique endosso | **ilustração** |
| Curva orgânica livre como borda de recorte                                          | ilustração     |
| Qualquer ocorrência de Amber ou Cream                                               | as duas        |

**Iconografia financeira genérica** (moeda, cifrão, candlestick, cérebro de IA) é proibida em
produto, curso e marketing. **Não vale para a ilustração editorial**, onde a rejeição de clichê
é feita por um método de composição próprio — teste da troca, teste do substantivo, metáfora de
dicionário. Este escopo é a regra, não uma exceção informal: foi a falta dele que produziu uma
revogação invisível em 02/09/2026.

### 4.7. Componentes

Valores canônicos no arquivo de tokens, grupo `component.*`.

| Componente              | Assinatura                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Botão primário**      | Radius 0, lime-500, texto Ink, Hanken Medium; hover lime-300; foco conforme §8                                                                                                   |
| **Botão secundário**    | Outline 1.5px Forest (claro) / Chalk (escuro), texto na cor da borda. Hover escurece por `color-mix`, nunca por opacidade — opacidade clarearia o botão e derrubaria o contraste |
| **Card / tile**         | Radius 0, borda 1px Mist, fundo branco ou Mint sobre Chalk, **sem sombra**                                                                                                       |
| **Banda**               | Full-bleed Deep Forest ou Ink, texto Chalk, eyebrow Lime-300, CTA lime                                                                                                           |
| **Accordion**           | Hairlines Mist entre itens, sem caixa; indicador +/− em Space Mono; canto reto                                                                                                   |
| **Eyebrow**             | Space Mono 12px, caixa alta, tracking 0.15em; Grove-700 (claro) / Lime-300 (escuro)                                                                                              |
| **Faixa de números**    | Fundo Mint ou banda escura; números `statNumber`; conquista em lime-100 de fundo ou número em Lime sobre escuro                                                                  |
| **Input / Select**      | Canto reto, borda 1px `input`, foco conforme §8; label em Hanken Medium                                                                                                          |
| **Chip / tag**          | Radius máximo 2px; alvo conforme §8 (SC 2.5.8)                                                                                                                                   |
| **Frame de ilustração** | Retângulo radius 0 com hairline 1px. É o único lugar onde a camada de ilustração aparece (§5)                                                                                    |

---

## 5. O contrato de camadas

A marca tem **duas camadas**, e toda regra deste documento pertence a uma delas ou às duas.
Antes da v3.0 isso não estava escrito, e o resultado foi previsível: uma regra sem escopo
declarado é revogada por fora, no lugar onde ela não cabia, e a revogação fica invisível para
quem lê só o documento de marca.

|                  | Camada de sistema                                                      | Camada de ilustração                                                                      |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **O que é**      | UI, componentes, tipografia, patterns funcionais, tabelas, certificado | capas editoriais, aberturas de módulo, retratos de dado, ilustrações de apoio, thumbnails |
| **Técnica**      | vetorial, plana, geométrica                                            | collage / paper cut, plana, em degraus de tom                                             |
| **Profundidade** | não existe: hierarquia por hairline, preenchimento e tipografia        | por **degrau de luminância** entre camadas de papel                                       |
| **Sombra**       | proibida                                                               | proibida                                                                                  |
| **Onde vive**    | a página inteira                                                       | **apenas dentro de um frame** retangular, radius 0, hairline 1px                          |

**As três regras de fronteira, escritas para serem checáveis:**

1. **Ilustração de colagem não entra em componente de produto.** Nem como fundo de card, nem
   como preenchimento de botão, nem como textura de banda. Ela ocupa um frame declarado ou não
   aparece.
2. **Nada da ilustração sangra para fora do frame** — borda rasgada, retícula grossa e camada
   de papel terminam no hairline.
3. **Onde as duas camadas se encontram, o sistema vence.**

A fronteira é barata de policiar porque as duas camadas são planas. A diferença entre elas não
é sombra contra ausência de sombra — é **quantos degraus de tom cada uma pode usar**: a camada
de sistema usa preenchimentos chapados de token; a de ilustração empilha até quatro degraus de
um mesmo matiz (§7.2). Isso é uma regra numérica, não uma regra de gosto.

---

## 6. Sistema de padrões

### 6.1. O conceito e a geometria

"Syntaxis" é a estrutura que conecta partes para formar sentido — árvore sintática em
linguística, AST em computação, árvore de decisão em finanças. Três leituras, uma forma: o
nó-e-galho é a própria palavra desenhada. **O conceito é invariante.**

A expressão não era. O símbolo (`LOGO/symbol-master.svg`) foi medido em 03/09/2026:

| Elemento            | Medida                           | Em módulos |
| ------------------- | -------------------------------- | ---------- |
| Diagonal do chevron | 56,81 u a **exatamente ±45,00°** | M·√2       |
| Segmento vertical   | 41,42 u a −90,00°                | 1,03 M     |
| Barra horizontal    | 40,45 u a 0,00°                  | 1,01 M     |
| Quarto de arco      | raio 38,92 u                     | 0,97 M     |

**O símbolo inteiro é um módulo M, três primitivas e nenhuma exceção:** diagonal a 45°,
segmento ortogonal de comprimento M, quarto de arco de raio M — a única curva do sistema.
Preenchimento sólido, sem traço, com o segundo path sendo o primeiro rotacionado 180°.

O pattern anterior gerava galhos em ângulo pseudoaleatório, a partir de raízes em −70°, −20° e
−60°, com nós desenhados como círculos. Nenhum ângulo, nenhum comprimento e nenhuma terminação
coincidiam com o símbolo. A partir da v3.0, **a gramática do símbolo é a gramática do
pattern**.

### 6.2. As duas famílias

**1. Nó-e-galho** _(primário)_ — malha ramificada construída só com as primitivas do símbolo:

| Propriedade          | Regra                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| Ângulos              | **0°, 90°, ±45°, e nada mais**                                            |
| Comprimento de galho | múltiplo inteiro do módulo `m` do pattern                                 |
| Nó                   | **a dobra** — o vértice onde a diagonal encontra o ortogonal. Sem círculo |
| Terminação           | quarto de arco de raio `m` na ponta de cada galho terminal                |
| Cor                  | tom único: Grove sobre escuro, Forest sobre claro                         |
| Aleatoriedade        | escolha de direção entre as quatro permitidas, com seed determinística    |

_Uso:_ bandas escuras, capas de módulo, moldura de certificado, fundo de slide de título.

**2. Retícula** — um único primitivo em duas escalas de ponto. A escala **fina** (ponto de 1px,
espaçamento de 14px, Mist) é camada de sistema, em opacidade baixa e sempre dentro de retângulo
de canto reto. A escala **grossa** é camada de ilustração, em opacidade 1, onde é matéria e não
fundo. Duas escalas podem coexistir numa mesma peça de ilustração **quando codificam ordem de
camada** — variação sem função é ruído.

_Uso:_ respiro em conteúdo técnico denso, painel ou tile texturizado, camada de papel dentro de
ilustração.

**A linha de conquista não é pattern.** Degraus ascendentes retos em Lime, terminações
`miter`/`square`, sempre a 100% de opacidade, nunca atrás de texto, sempre ligada a conquista
verificável. Ela é **marca de dado** e vive junto do símbolo, não neste capítulo — pattern é
substrato, marca de dado é protagonista.

### 6.3. Matriz de uso

| Contexto                          | Pattern                                      | Opacidade               | Camada     |
| --------------------------------- | -------------------------------------------- | ----------------------- | ---------- |
| Banda escura em página            | nó-e-galho, campo ou canto                   | 0,25–0,40               | sistema    |
| Atrás de texto corrido            | nó-e-galho                                   | 0,12, travada em código | sistema    |
| Respiro em conteúdo técnico denso | retícula fina                                | 0,15–0,20               | sistema    |
| Painel ou tile texturizado        | retícula fina, dentro de retângulo radius 0  | 0,15–0,20               | sistema    |
| Camada de papel em ilustração     | retícula grossa                              | 1,0                     | ilustração |
| Certificado                       | nó-e-galho como moldura + linha de conquista | 1,0                     | sistema    |
| Página de vendas, prova social    | nenhum                                       | —                       | —          |

### 6.4. Regras

- **Nunca compita com o texto.** Atrás de texto corrido, 0,12 no máximo, travado em código.
- **Um pattern por peça.**
- **Grove para estrutura; Lime exclusivamente para conquista real ou ação.**
- **Todo segmento é 0°, 90° ou ±45°, e todo comprimento é múltiplo do módulo.** É afirmação
  binária, verificável por linter — a versão anterior não permitia afirmar nada.

---

## 7. Camada de ilustração — collage / paper cut

A especificação executável, com taxonomia, prompt-kit e descritores proibidos, está em
[`ILUSTRACOES/`](ILUSTRACOES/). Aqui ficam as regras que são de marca.

### 7.1. Registro

Analógico, montado à mão: sentido construído a partir de pedaços recortados e camadas
sobrepostas, com imperfeição analógica **controlada**. Papel recortado é o material dominante
em toda a camada — produto, curso e editorial. Não há dois vocabulários de ilustração.

### 7.2. A escada — profundidade sem sombra

Profundidade é **degrau de luminância dentro de um matiz**, nunca sombra. A paleta já continha
a escada; a v3.0 apenas a nomeia.

| Papel na peça        | Tokens, do fundo ao topo                    | Degrau de luminância                |
| -------------------- | ------------------------------------------- | ----------------------------------- |
| Pilha escura         | Ink → Deep Forest → forest.700 → forest.500 | 0,029 · 0,028 · 0,046               |
| Pilha clara          | mist → mint → Chalk                         | 0,075 · 0,052                       |
| Figura sobre a pilha | grove.500, grove.300                        | +0,150 e +0,225 — salto, não degrau |
| Acento               | lime.500                                    | +0,283                              |

Grove e Lime **não empilham**: os saltos deles são de cinco a dez vezes o tamanho de um degrau,
e é isso que os faz destacar em vez de somar profundidade.

### 7.3. Regras numéricas

1. **Um matiz de pilha por peça**, mais um neutro estrutural.
2. **Entre 3 e 7 cores acima de 1% do quadro.**
3. **O fundo ocupa no mínimo 40% do quadro.**
4. **Duas camadas adjacentes diferem por um degrau da escada**, nunca por sombra.
5. **Lime no máximo 1% do quadro**, e só onde há virada, conquista ou ação.
6. **Corte a faca é reto ou a 45°.** Rasgo é vocabulário base apenas em capa editorial; nas
   demais taxonomias, um por peça, no ponto de ruptura.
7. **Granulação só na camada de fundo**, com amplitude de luminância abaixo de um degrau
   (0,028) — acima disso ela cria um quinto nível falso e destrói a leitura de pilha.
8. **Abaixo de 96px não existe ilustração, existe símbolo.** Favicon, avatar e miniatura pequena
   usam os assets de `LOGO/`, produzidos e verificados nesses tamanhos.

### 7.4. Por que estes números

Sete peças de referência foram quantizadas em 03/09/2026 (cobertura em % do quadro, luminância
WCAG, saturação, distância até o token mais próximo). As peças disciplinadas ficam entre 3 e 7
cores acima de 1%; a única rejeitada tem 12. O fundo carrega de 44% a 95% do quadro nas peças
que funcionam, e 27% na rejeitada. A referência que resolve profundidade sem sombra usa um
matiz e quatro degraus de ~0,02. O rastro está em `revisao-2026/01-referencias.md`.

---

## 8. Acessibilidade — alvo declarado

Alvo: **WCAG 2.2 nível AA, mais o SC 2.4.13 (AAA)**. O SC 2.4.13 entra porque a geometria reta
torna a regra dele calculável, não porque é fácil.

| SC                            | Nível | O que o sistema precisa fazer                                                                                                                                                                                                                                      |
| ----------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1.4.1** Use of Color        | A     | Cor nunca sozinha. Um tile promovido por preenchimento verde, um estado marcado só por Lime ou um passo destacado só por cor precisam de rótulo, número ou marcador junto                                                                                          |
| **1.4.11** Non-text Contrast  | AA    | 3:1 contra cores adjacentes. O hairline como **divisor** não é fronteira de componente e não está sujeito; onde o hairline é a única coisa que declara um controle, ele passa a valer 3:1 dos dois lados                                                           |
| **2.4.11** Focus Not Obscured | AA    | Nenhum elemento fixo pode esconder o componente focado. **Faixa-ticker e banda full-bleed nunca são fixas**                                                                                                                                                        |
| **2.4.13** Focus Appearance   | AAA   | A área do indicador de foco é no mínimo a de um perímetro de **2 CSS px** do componente, com 3:1 entre os estados focado e não-focado. Em componente retangular, um anel de 1px tem metade da área exigida: **o foco é 2px**, ou uma geometria de área equivalente |
| **2.5.8** Target Size         | AA    | Alvo de 24×24 CSS px, ou a exceção de espaçamento. Vale para chip, tag e ícone clicável                                                                                                                                                                            |

Consequência de redação: o hairline de 1px continua sendo o vocabulário de **divisão e borda**;
o vocabulário de **foco** é 2px. São coisas diferentes e não devem ser unificadas por estética.

---

## 9. Aplicação em materiais de curso

As superfícies onde a marca **não controla o CSS** — Substack, LinkedIn, YouTube, e-mail,
plataforma de venda — são governadas por [`APLICACAO.md`](APLICACAO.md), que declara por canal
o que é fixo, o que pode variar e qual é o fallback nomeado.

| Material                                    | Elementos aplicáveis                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Notas de estudo                             | Paleta e tipografia v3.0. A camada de editoração não existe ainda (§11)                      |
| Slides                                      | Paleta v3.0; frames de título e de seção são candidatos ao nó-e-galho de fundo               |
| Case (documento de decisão)                 | Voz da §3, sem pattern decorativo — formato de trabalho real                                 |
| Nota de Ensino                              | Tom técnico e direto, Space Mono para código e dado, sem pattern                             |
| Certificado de módulo                       | Linha de conquista + nó-e-galho como moldura — único material onde as duas são protagonistas |
| Capa de post, thumbnail, abertura de módulo | Camada de ilustração (§7), sempre dentro de frame                                            |

---

## 10. Checklist rápido

- [ ] A promessa é a da §1.3, nunca uma genérica?
- [ ] O segmento de `AUDIENCES.md` está identificado e o eixo está puro?
- [ ] Toda afirmação numérica tem fonte rastreável?
- [ ] A leveza aparece nos lugares certos (§3.3), e o rigor não foi trocado por ela?
- [ ] Nenhuma frase soaria condescendente dita a um colega de trabalho adulto?
- [ ] A paleta é exatamente Forest/Grove/Lime + neutros — zero Amber, zero Cream, nenhuma cor nova?
- [ ] Cantos retos (0–2px) em todo componente, e `rx`/`ry` de SVG também?
- [ ] Texto sobre lime é Ink, e lime-500 não aparece como texto pequeno sobre fundo claro?
- [ ] A página usa ≥ 3 assinaturas da §4.4, e o hero usa eyebrow, palavra-destaque e hairlines?
- [ ] Nenhum anti-padrão da §4.6 está presente **na camada em que ele vale**?
- [ ] **A peça declara a que camada pertence?**
- [ ] Se há ilustração, ela está dentro de um frame radius 0 com hairline 1px, e nada dela sangra para fora?
- [ ] Se há ilustração, ela passa nas oito regras da §7.3?
- [ ] Se há pattern, é um só, na opacidade da §6.3, com todo segmento em 0°/90°/±45°?
- [ ] O foco visível é de 2px, e nenhum elemento fixo pode obscurecer o componente focado (§8)?
- [ ] Nenhuma informação é transmitida só por cor (§8, SC 1.4.1)?
- [ ] Se a peça é vetorial, passou em `node brand/scripts/check-palette.mjs`?
- [ ] Se a peça vai para plataforma de terceiro, a regra aplicada é a de `APLICACAO.md` para aquele canal?
- [ ] Se a peça é asset de marca, o arquivo é o canônico de [`LOGO/README.md`](LOGO/README.md)?

---

## 11. Lacunas abertas

| #      | Lacuna                                                                                  | Estado                                                                                                                                                                                                                                                                                                                                                                                   |
| ------ | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | **Nomes comerciais das trilhas**                                                        | decisão aberta; a regra (§3.4, português) já está cristalizada                                                                                                                                                                                                                                                                                                                           |
| 2      | **Formato do certificado** — PDF, badge digital ou ambos                                | `APLICACAO.md` fixa o que já é decidível e isola o que depende do formato                                                                                                                                                                                                                                                                                                                |
| 3      | **Camada de editoração (LaTeX)**                                                        | não existe. Não é migração pendente: é camada não construída                                                                                                                                                                                                                                                                                                                             |
| 4      | **Tipografia fora do sistema em três banners** — `font-family:Carlito` em `<text>` vivo | numa máquina sem a fonte, o navegador substitui e o wordmark sai fora do trio. Corrigir exige decidir entre trocar a família ou converter em contornos                                                                                                                                                                                                                                   |
| 5      | **Pílulas no banner do YouTube**                                                        | são paths com arco, invisíveis a qualquer linter. Corrigir é redesenhar forma                                                                                                                                                                                                                                                                                                            |
| 6      | **Token para "texto secundário sobre banda Deep Forest"**                               | papel semântico real sem valor nomeado; `#94A3B8` ali dá 4,77:1                                                                                                                                                                                                                                                                                                                          |
| ~~7~~  | ~~Nível intermediário de luminância entre Chalk e Deep Forest~~                         | **fechada em 03/09/2026: nenhum token novo é necessário.** A escada já existe dos dois lados — no claro, Chalk 0,929 → Mint 0,877 → Mist 0,802; no escuro, Deep Forest 0,036 → Ink 0,007. A transição de seção por degrau usa esses tons; o que faltava era ver que a pilha de ilustração e a transição de seção são a mesma escada lida em contextos diferentes                         |
| 8      | **Proporção de tela e respiro ao redor da ilustração**                                  | nenhuma referência disponível mostra colagem dentro de interface real                                                                                                                                                                                                                                                                                                                    |
| 9      | **Sobrevivência da granulação à compressão** de LinkedIn e YouTube                      | a ser medido contra a amplitude de 0,028 da §7.3                                                                                                                                                                                                                                                                                                                                         |
| ~~10~~ | ~~Controles de seleção nativos e a exceção de radius~~                                  | **fechada em 03/09/2026: a exceção foi aberta**, e só para o radio e o ponto do switch. A regra existe para impedir "template amigável", não para redesenhar controle de formulário cuja forma circular é convenção que o usuário reconhece; radio quadrado é regressão de reconhecimento, não ganho de rigor. Estreita de propósito — não vale para checkbox, botão, card, input ou tag |
| 11     | **Rampa de luminância dentro de uma camada de ilustração**                              | é a causa de quase toda reprovação do primeiro lote: parede de recorte, sombra de contato, vinheta. A correção é de prompt e já está em `ILUSTRACOES/_como-gerar.md`; o teto de 0,028 não muda                                                                                                                                                                                           |

---

_Syntaxis DESIGN.md v3.0 · 03/09/2026. Documento reescrito do zero a partir da evidência.
Invariantes intocados: Forest, Grove, Lime; Space Grotesk + Hanken Grotesk + Space Mono; a voz
da §3; a promessa da §1.3; o conceito nó-e-galho. Reconstruídos: o sistema de padrões, sobre a
geometria medida do símbolo; a camada de ilustração, unificada em collage / paper cut com
profundidade por degrau de tom; e a fronteira entre as duas, escrita como regra checável._
