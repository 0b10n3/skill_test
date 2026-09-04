# Syntaxis — DESIGN.md

**Manual de Marca** · Fonte única da verdade para identidade visual, voz e aplicação de marca
**v3.0** · 04/09/2026 — documento reescrito do zero, rodada 3.

---

## Sumário

0. [O que esta versão é](#0-o-que-esta-versão-é)
1. [Fundamentos da Marca](#1-fundamentos-da-marca)
2. [Público](#2-público--a-moldura-de-marca-sobre-audiencesmd)
3. [Personalidade e Voz](#3-personalidade-e-voz)
4. [Identidade Visual](#4-identidade-visual)
5. [O contrato de camadas](#5-o-contrato-de-camadas)
6. [Sistema de padrões](#6-sistema-de-padrões)
7. [Camada de ilustração — collage / paper cut](#7-camada-de-ilustração--collage--paper-cut)
8. [Acessibilidade — alvo declarado](#8-acessibilidade--alvo-declarado)
9. [Aplicação em materiais de curso](#9-aplicação-em-materiais-de-curso)
10. [Checklist rápido](#10-checklist-rápido)
11. [Lacunas abertas](#11-lacunas-abertas)

---

## 0. O que esta versão é

### Escopo da reescrita

Esta é a terceira reescrita completa da marca a partir de evidência, não a primeira — e a
segunda vez que a árvore de `brand/` é esvaziada e reconstruída do zero em vez de emendada.
Nenhum invariante mudou nesta rodada: Forest, Grove e Lime, o trio tipográfico, a voz da §3, a
promessa da §1.3 e o conceito unificador nó-e-galho seguem exatamente os mesmos que a rodada
anterior já havia herdado da v1.0/v1.1. O que mudou, e por quê:

| #   | O que mudou                                                                                                                                                                                          | Por quê                                                                                                                                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | O sistema de padrões continua reconstruído sobre a geometria **medida diretamente** do símbolo (não herdada como afirmação) — módulo M≈40,24u, ângulos 0°/90°/±45°, terminação em quarto de arco     | remedido nesta rodada a partir do `d=` de `symbol-master.svg`: quatro medidas caem dentro de 3% do módulo, e o pattern em produção não compartilhava nenhuma delas (§6.1)                        |
| 2   | A camada de ilustração — collage/paper cut, profundidade por degrau de tom, sem sombra — **passa a existir só em `pipelines/hemingway`**                                                             | decisão do founder, 03–04/09/2026: nunca em `apps/skill_test`, nunca no site. Substitui a versão anterior, que incluía ilustração de produto (estados de app, hero de site) no mesmo vocabulário |
| 3   | O sistema de padrões continua em **duas** famílias (`nodeBranch`, `reticula`), mas `reticula` volta a ser **só sistema** — a variante grossa como matéria de ilustração compartilhada foi depreciada | com a ilustração restrita a `hemingway`, a ponte que justificava um pattern com dupla expressão perdeu o consumidor (`03-proposta.md` A6)                                                        |
| 4   | Nenhuma peça de ilustração herdada de rodada anterior é reaproveitada — todo o kit de collage começa vazio                                                                                           | decisão do founder: peça nova só é gerada por necessidade real de publicação, nunca para preencher amostra                                                                                       |

O sistema de padrões segue em **duas** famílias, não três — `growthLine` continua fora dele,
reclassificada como marca de dado desde a rodada anterior.

### Histórico de versões

| Versão                              | Mudança                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v1.0                                | Consolidação do pivô (newsletter → plataforma): voz, padrões geométricos, paleta Forest/Grove/Amber                                                                                                                                                                                                                                                                                                                                                                     |
| v1.1                                | Regras de composição digital: assinaturas visuais e anti-padrões de "design de IA"                                                                                                                                                                                                                                                                                                                                                                                      |
| v2.0                                | Amber → Lime (Forest/Grove intocados) · cantos retos · tipografia grotesca moderna                                                                                                                                                                                                                                                                                                                                                                                      |
| v2.1                                | Revisão de coerência cross-superfície; `APLICACAO.md` passa a governar superfícies de terceiros                                                                                                                                                                                                                                                                                                                                                                         |
| v3.0 (rodada 2)                     | Documento reescrito do zero. Patterns reconstruídos sobre a geometria do símbolo; contrato de camadas explícito; ilustração unificada em collage/paper cut (então ainda incluindo produto); alvo de acessibilidade declarado. Nunca chegou a sincronizar com `apps/skill_test/main` antes de a árvore ser esvaziada para esta rodada                                                                                                                                    |
| **v3.0 (rodada 3, este documento)** | **Reescrito de novo do zero**, não emendado sobre a rodada anterior — o founder apagou a árvore de `brand/` inteira entre as duas rodadas e pediu reconstrução, confiando no histórico do git como arquivo. Mesmo número de versão maior (v3.0) porque nenhum consumidor real chegou a depender de uma v3.0 anterior publicada. Mudança de conteúdo: ilustração restrita a `hemingway` (item 2 acima); `reticula.coarse` depreciada; nenhuma peça de ilustração herdada |

**Por que reescrever em vez de emendar, de novo.** O ledger desta rodada
(`brand/_arquivo/DECISOES-HERDADAS.md`) registra 27 restrições medidas, 12 armadilhas de
varredura e a autocrítica de 5 pontos que a rodada anterior deixou escrita sobre sua própria
proposta — inclusive o risco, nomeado por ela mesma, de que collage destoe do posicionamento de
rigor técnico se a fronteira entre camadas não for policiada. A decisão desta rodada de
restringir ilustração a um único repositório é, em parte, resposta a esse risco: menos
superfície onde a fronteira pode vazar.

### O pivô de produto (mantido desde a v1.0)

| Antes (Substack de investimentos)                | Agora (plataforma de treinamento)                                            |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Público: investidores pessoa física              | Público: estagiários e analistas do mercado de capitais brasileiro           |
| Promessa: conectar portfólio a objetivos de vida | Promessa: skills técnicas aplicáveis no trabalho, incluindo fluência em IA   |
| Formato: newsletter editorial                    | Formato: aulas expositivas + cases reais + skills de IA entregáveis          |
| Metodologia implícita                            | Metodologia explícita e rigorosa (`education/METHODOLOGY.md`)                |
| Voz: analítica e humana                          | Voz: técnica e precisa, no estado da arte acadêmico, mas leve e bem-humorada |

---

## 1. Fundamentos da Marca

### 1.1. Essência

**Estrutura que vira competência.**

A Syntaxis existe para transformar a estrutura de uma decisão real de mercado — com toda a sua
ambiguidade institucional brasileira — em uma capacidade técnica nova e verificável no
trabalho.

### 1.2. Estrutura Estratégica

| Pilar               | Definição                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Propósito**       | Ensinar as skills técnicas que o mercado de capitais brasileiro realmente usa — modelagem, dados, renda fixa, IA aplicada — através de professores que somam carreira acadêmica sólida a experiência de mercado real.  |
| **Visão**           | Ser a referência brasileira em formação técnica para o mercado financeiro, reconhecida por ensinar através de decisões reais, não de exercícios de enunciado limpo.                                                    |
| **Missão**          | Projetar cada aula e cada case com backward design a partir de uma competência observável no trabalho, entregando ao final de cada módulo as skills de IA e os arquivos de contexto que o aluno leva para o dia a dia. |
| **Mecanismo único** | Professor híbrido (acadêmico + mercado) · case brasileiro real com tensão institucional (CVM, CMN) · AI-first como competência entregável, não como enfeite de marketing.                                              |

### 1.3. Promessa de Resultado

> _Skills e ferramentas de trabalho real — incluindo IA — para alcançar o próximo nível da
> carreira._

Esta é a promessa-guia definida em `MARKETING_REVIEW.md` §4 e deve substituir qualquer
formulação genérica ("aprenda finanças", "domine investimentos") em toda peça de copy, aula ou
material de curso.

**Regra de verificabilidade:** a promessa é checável na prática do próprio trabalho do aluno
(ele sabe se passou a usar a skill ou não) — nunca prometemos número de salário ou promoção que
a Syntaxis não controla. Linha vermelha, não sugestão de estilo.

> **Nota de ponteiro (mantida desde a v3.0 anterior).** O texto acima é reposto **verbatim** por
> ser invariante, e por isso a citação `MARKETING_REVIEW.md` foi preservada como está. Esse
> arquivo não existe com esse nome: o documento é [`strategy/MARKETING.md`](../strategy/MARKETING.md).
> A promessa e a regra de verificabilidade são o invariante; o caminho não é.

### 1.4. Valores Fundamentais

**Rigor sem enfeite.** Todo conteúdo segue o estado da arte acadêmico — bibliografia real,
taxonomia de Bloom, cognitive load theory. Rigor não é forma; é a razão pela qual o aluno
confia no professor híbrido.

**Tensão real, não exercício limpo.** Um case da Syntaxis reconstrói uma decisão sob incerteza
institucional brasileira. Nunca um enunciado com resposta única.

**IA como ferramenta, não como enfeite.** `education/METHODOLOGY.md` trata IA como competência
entregável. Toda peça de marca trata IA com a mesma seriedade técnica que trata renda fixa ou
modelagem.

**Leveza que não abre mão do rigor.** Humor e leveza de tom nunca substituem precisão técnica.
A leveza vive no _como_ se diz, nunca no _o quê_ se afirma — §3.3.

---

## 2. Público — a moldura de marca sobre `AUDIENCES.md`

`strategy/AUDIENCES.md` é o SSOT de segmentação para copy de vendas e continua sendo. Os quatro
segmentos seguem governando estrutura de argumento em qualquer peça comercial.

O que este documento acrescenta é a moldura comum que sobrevive acima dos quatro eixos:

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

> **Distinção de escopo:** esta seção é a voz de **marca e produto** — como a Syntaxis fala em
> copy, curso e material comercial. Não é a mesma coisa que a voz **autoral** de quem escreve o
> Substack, documentada em `pipelines/hemingway/estilo/estilo-autoral.md` (a prosa
> ensaística/pessoal de um autor específico). Os dois convivem porque descrevem coisas
> diferentes — nenhum substitui o outro. Ao escrever copy/produto, use esta seção; ao escrever
> um post de Substack, use `estilo-autoral.md`.

### 3.1. Arquétipo: O Professor Híbrido

A Syntaxis fala como a pessoa que o mecanismo único do produto descreve: alguém com carreira
acadêmica sólida **e** experiência real de mercado, que já viu a ambiguidade institucional
brasileira de perto e não tem paciência para conteúdo genérico traduzido — mas também não tem
nenhuma necessidade de provar isso sendo solene. É competência confortável consigo mesma.

### 3.2. Os Dois Eixos de Tom

**Técnico e preciso, no estado da arte da academia — sem perder a leveza e o bom humor.** Dois
eixos independentes, não um meio-termo:

| Eixo                | O que significa                                                                                                  | O que NÃO significa                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Rigor acadêmico** | Toda afirmação tem lastro — bibliografia real, dado com fonte, verbo de Bloom correto no objetivo de aprendizado | Jargão por jargão; complicar para parecer inteligente                            |
| **Leveza e humor**  | Analogias vívidas, autoironia ocasional sobre o próprio mercado financeiro, ritmo de frase que não cansa         | Piada forçada; meme; infantilização; humor que descredibiliza o conteúdo técnico |

A regra de ouro: **o rigor nunca é sacrificado pela leveza, e a leveza nunca é sacrificada pelo
rigor.**

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

- **Português como padrão.** Termos técnicos em inglês quando são o termo de mercado real
  (_duration_, _case_, _asset_, _trainee_, _yield_) — nunca por afetação.
- **Nomes comerciais em português.** Nomenclatura interna de projeto pode continuar em inglês,
  mas nunca vaza para a página de vendas ou para o aluno.
- **Tratamento: "você".** Direto, sem formalidade excessiva.
- **Sem emoji em material técnico.** Emoji apenas em canais informais.
- **Todo percentual leva fonte.** Regra universal de marca.

### 3.5. A voz também é pedagógica

- **Abrir por relevância, não por definição** — nunca comece explicando "o que é" antes de "por
  que importa agora, no seu trabalho".
- **Reduzir carga cognitiva extrínseca** — ruído visual e jargão desnecessário são o mesmo erro
  em contextos diferentes.
- **Não infantilizar o adulto profissional** — se uma frase soaria estranha dita a um colega de
  trabalho, não deveria estar em nenhum material da Syntaxis.

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

### 4.1. Paleta — camada semântica, SSOT em `brand/tokens/syntaxis.tokens.json`

| Papel                         | Token                      | Hex       |
| ----------------------------- | -------------------------- | --------- |
| Âncora institucional          | `color.forest.500`         | `#1B6A45` |
| Estrutura em movimento        | `color.grove.500`          | `#2D9E67` |
| Acento único (ação/conquista) | `color.lime.500`           | `#CDF163` |
| Fundo claro                   | `color.neutral.chalk`      | `#F7F7F5` |
| Fundo escuro (banda, prancha) | `color.neutral.deepForest` | `#0F3D27` |
| Fundo escuro máximo contraste | `color.neutral.ink`        | `#141414` |
| Secundário / traço neutro     | `color.neutral.slate`      | `#4A5568` |
| Hairline / divisor            | `color.neutral.mist`       | `#E2E8F0` |
| Superfície suave              | `color.neutral.mint`       | `#E6F4EE` |

Forest, Grove e Lime são **invariantes travados**. Qualquer proposta de mudar um hex para
melhor combinar com uma referência externa (`design_stitch.md` incluído — ver
`01-referencias.md` I9) é incompatibilidade a registrar, nunca argumento de mudança.

### 4.2. Tipografia

| Papel                 | Família        |
| --------------------- | -------------- |
| Display (títulos)     | Space Grotesk  |
| Corpo                 | Hanken Grotesk |
| Dados / código / mono | Space Mono     |

Trio fechado. Sem serif, sem itálico como ênfase (a assinatura "palavra-destaque em serif
itálico" é revogada desde a v2.0 e continua morta — ver `REVOGACOES.md`).

### 4.3. Geometria — camada de sistema

- **Cantos retos, 0–2px.** Exceção nomeada: avatar e o símbolo circular do logo. Controles de
  seleção nativos (radio, ponto do switch) ganham a mesma exceção estreita, nunca estendida a
  checkbox, botão, card, input ou tag (decisão do founder, rodada 2, mantida por não haver fato
  novo que a conteste).
- **Sem sombra como recurso principal.** Hairline (1px, `mist`) é o divisor. Sombra difusa e
  glassmorphism são anti-padrão em qualquer camada — inclusive na ilustração (§7). Gradiente e
  glow têm uma exceção estreita e nomeada — §4.5.
- **Contraste por cor chapada, nunca por luz — exceto na camada de ambiente da §4.5.** Nenhum
  brilho, nenhum halo, em componente ou texto.
- **Um acento por composição.** Lime marca ação ou conquista real — nunca cor ambiente.

### 4.4. Anti-padrões — escopados por camada desde a redação

| Anti-padrão                                               | Onde vale                | Por quê                                                                                                                                     |
| --------------------------------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Gradiente contínuo em componente ou atrás de texto direto | sistema                  | não tem par de token; sai do gate de contraste automatizado (R6/R7 do ledger). Exceção estreita para camada de ambiente de fundo — §4.5     |
| Radius acima de 2px fora das exceções nomeadas            | sistema                  | assinatura revogada — "botão pílula" e radius alto liam como template genérico                                                              |
| Sombra difusa, glassmorphism                              | sistema **e** ilustração | proibido nas duas — na ilustração, profundidade é degrau de tom (§7.2), nunca sombra. Glow tem a mesma exceção estreita de gradiente — §4.5 |
| Palavra-destaque em serif itálico                         | sistema                  | revogada na v2.0                                                                                                                            |
| Curva orgânica livre                                      | sistema **e** ilustração | a única curva do sistema é o quarto de arco do símbolo (§6.1); corte de papel é reto ou a 45° (§7.5)                                        |

### 4.5. Exceção nomeada — gradiente e glow ambiente de fundo

**Revogação de 04/09/2026** (`REVOGACOES.md` H8): a proibição total de gradiente/glow no
sistema, em vigor desde a v2.0, é substituída por uma exceção estreita — mecanismo adotado de
`design_stitch.md` ("glow ambient lights", radial-gradient de baixa opacidade atrás da
composição), adaptado para não reabrir R6/R7 do ledger (gradiente sem par de token escapando do
gate de contraste automatizado).

Regras, todas obrigatórias para a exceção valer:

1. **Só como camada de ambiente**, na base do empilhamento visual (abaixo de todo conteúdo) —
   nunca em card, botão, input, badge, tag ou pattern. Continua proibido em qualquer componente
   interativo ou de conteúdo, sem exceção.
2. **Nunca atrás de texto direto.** Todo texto precisa continuar resolvendo contraste contra um
   fundo sólido de token conhecido — se a região tem texto, ela tem uma superfície sólida entre
   o texto e o gradiente (um card, uma banda de cor chapada), nunca o gradiente cru atrás da
   letra. Isso é o que impede o gate de contraste de ficar cego: nenhum texto real se apoia na
   cor do gradiente.
3. **Radial, baixa opacidade, cor de token — nunca hex novo.** Tokens `illustration`-like:
   grupo `gradient.ambient.*` (§ tokens), alias de cor existente (`forest.700`, `lime.500`),
   opacidade máxima 0,25, raio generoso (blur forte — é ambiente, não forma).
4. **Um por seção**, no máximo dois em cantos opostos (mecanismo do hero de `design_stitch.md`)
   — nunca um campo de gradientes cobrindo tudo.

Isto não reabre glassmorphism nem sombra difusa em componente: a exceção é só para a camada de
ambiente atrás da composição, e só nos dois tokens declarados abaixo.
| Texto renderizado dentro de imagem gerada | ilustração | gerador erra tipografia; a marca tem tipografia própria — o alt-text carrega a informação verbal |

---

## 5. O contrato de camadas

Duas camadas, com fronteira **checável**, não intenção de estilo:

- **Camada de sistema** — UI de `apps/skill_test`, o site, componentes, tipografia, patterns
  funcionais, tabelas, certificado. Plana, geométrica, reta, sem sombra. Sem exceção.
- **Camada de ilustração** — collage / paper cut, §7. **Existe em um único lugar:
  `pipelines/hemingway`** — capas editoriais, imagens de post e sua distribuição social
  (LinkedIn, Instagram, thumbnail de YouTube). Não existe em `apps/skill_test`. Não existe no
  site `syntaxis.com.br`.

Onde as duas se encontrariam, o sistema vence — mas na prática elas quase não se encontram
mais: a restrição desta rodada elimina a maior parte da fronteira que rodadas anteriores
precisavam policiar. O que sobra de fronteira real é a distribuição social do conteúdo
editorial (um post do Substack compartilhado no LinkedIn, por exemplo), onde a ilustração
segue as mesmas regras de §7 e nunca ganha chrome de produto ao redor.

**Regras binárias, verificáveis:**

| Regra                                                                     | Como se verifica                                                  |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Ilustração nunca aparece em `apps/skill_test` ou no site                  | binário, por repositório/superfície — não por peça                |
| Toda ilustração é contida por um frame retangular, radius 0, hairline 1px | binário, olhando a borda                                          |
| Nada sangra para fora do frame                                            | binário                                                           |
| Sombra proibida nas duas camadas                                          | binário: qualquer desfoque entre camadas reprova                  |
| Amplitude cromática entre 3 e 7 cores ≥1% do quadro                       | numérico, por quantização (`illustration.maxColors`)              |
| Fundo ≥ 40% do quadro                                                     | numérico (`illustration.minBackground`)                           |
| Lime ≤ 1% do quadro                                                       | numérico (`illustration.accent`, teto medido)                     |
| Um matiz de pilha por peça                                                | numérico, por matiz das cores dominantes (`illustration.maxHues`) |
| Pattern: 0°, 90°, ±45°, comprimento múltiplo do módulo                    | binário, por linter                                               |
| Foco com área de perímetro de 2px                                         | numérico (§8)                                                     |

---

## 6. Sistema de padrões

Duas famílias — `nodeBranch` e `reticula`. `growthLine` não é pattern: é marca de dado, sempre
a 100%, nunca atrás de texto, sempre ligada a conquista verificável (`PriorityCareerSkills.tsx`
é o uso real em produção).

### 6.1. A geometria do símbolo — medida, não estimada

`brand/LOGO/symbol-master.svg`, dois `<path>` em simetria rotacional de 180°. Lido diretamente
do `d=` nesta rodada:

| Elemento            | Medida                       | Em módulos (M≈40,24u) |
| ------------------- | ---------------------------- | --------------------- |
| Diagonal do chevron | 56,81u, a exatamente ±45,00° | M·√2                  |
| Segmento vertical   | 41,42u                       | 1,03 M                |
| Barra horizontal    | 40,45u                       | 1,00 M                |
| Quarto de arco      | raio 38,92u                  | 0,97 M                |

Quatro medidas dentro de 3% do mesmo módulo. **O quarto de arco é a única curva que o sistema
inteiro contém.** Preenchimento sólido, sem traço.

### 6.2. `pattern.nodeBranch` — reconstruído sobre a gramática do símbolo

| Propriedade              | Regra                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------ |
| Ângulos permitidos       | 0°, 90°, ±45° — nada mais                                                            |
| Comprimento de galho     | múltiplo inteiro do módulo `m` (token `pattern.nodeBranch.module`)                   |
| Nó                       | a própria dobra — o vértice onde a diagonal encontra o ortogonal. Sem círculo        |
| Terminação               | quarto de arco de raio `m` (`pattern.nodeBranch.arcRadius`), a única curva permitida |
| Cor                      | `{color.grove.500}`                                                                  |
| Opacidade atrás de texto | 0,12, travada em código                                                              |
| Opacidade decorativa     | 0,25–0,40                                                                            |

`nodeRadius` está `$deprecated` desde a rodada anterior — o nó deixou de ser círculo.

### 6.3. `pattern.reticula` — um primitivo, escala como parâmetro (agora só sistema)

Substitui `dataGrid` (`$deprecated`, ponteiro para `reticula.fine`, valores idênticos).

| Escala                                  | Uso                                                                                      | Estado                                                                                                                                                                                                      |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fine` (1px ponto / 14px espaçamento)   | camada de sistema — fundo, opacidade 0,15–0,20, sempre dentro de retângulo de canto reto | ativa                                                                                                                                                                                                       |
| `coarse` (4px ponto / 48px espaçamento) | previa matéria de ilustração compartilhada                                               | **`$deprecated` desde v2.3.0** — A6 (separação estrita) elimina o consumidor. Retícula de ilustração agora é construída peça a peça em `brand/ILUSTRACOES/_bloco-marca.md`, não recortada de um asset comum |

### 6.4. Matriz de uso

| Contexto                                                  | Pattern                                  | Opacidade | Superfície |
| --------------------------------------------------------- | ---------------------------------------- | --------- | ---------- |
| Banda escura em página                                    | `nodeBranch`, campo ou canto             | 0,25–0,40 | app, site  |
| Atrás de texto corrido                                    | `nodeBranch`                             | 0,12      | app, site  |
| Respiro em conteúdo denso                                 | `reticula.fine`                          | 0,15–0,20 | app, site  |
| Painel/tile texturizado dentro de retângulo de canto reto | `reticula.fine`                          | 0,15–0,20 | app, site  |
| Certificado                                               | `nodeBranch` como moldura + `growthLine` | 1,0       | app        |
| Prova social / página de vendas                           | nenhum                                   | —         | —          |

### 6.5. Regra de uso — um pattern por peça

Se uma composição tem padrão geométrico de fundo, é **um só**, na opacidade certa da matriz
acima — nunca `nodeBranch` e `reticula` sobrepostos na mesma superfície. A exceção nomeada é o
certificado, onde `nodeBranch` (moldura) e `growthLine` (marca de dado, não pattern) convivem
por desenho — `growthLine` nunca é decorativo, então não conta como um segundo pattern
disputando a mesma superfície. Verificável em CI: um componente não importa mais de uma família
de pattern de `@/components/patterns`.

---

## 7. Camada de ilustração — collage / paper cut

**Escopo: `pipelines/hemingway` é o único consumidor.** Nunca `apps/skill_test`. Nunca o site.
Esta seção descreve construção — a taxonomia e as regras de destino vivem em
`brand/ILUSTRACOES/README.md` e `_bloco-marca.md`, autossuficientes para um ilustrador ou
pipeline generativo externo.

### 7.1. Mecanismo de profundidade — degrau de tom, nunca sombra

Confirmado por medição (`01-referencias.md` §1.2, reproduzida nesta rodada): a paleta já
contém a escada.

| Papel na peça         | Tokens                                      | Degrau de luminância                |
| --------------------- | ------------------------------------------- | ----------------------------------- |
| Pilha escura          | Ink → Deep Forest → forest.700 → forest.500 | 0,029 · 0,028 · 0,046               |
| Pilha clara           | mist → mint → Chalk                         | 0,075 · 0,052                       |
| Figura, sobre a pilha | grove.500, grove.300                        | +0,150 e +0,225 — salto, não degrau |
| Acento                | lime.500                                    | +0,283                              |

### 7.2. Regras numéricas

1. Máximo um matiz de pilha por peça, mais um neutro estrutural (`illustration.maxHues`).
2. Entre 3 e 7 cores acima de 1% do quadro (`illustration.maxColors`).
3. Fundo ocupa no mínimo 40% do quadro (`illustration.minBackground`).
4. Profundidade é degrau de tom — sombra é anti-padrão, sem exceção.
5. Lime no máximo 1% do quadro, só em virada/conquista/ação (`illustration.accent`).
6. Offset de registro tipo risograph, 2–4px, cor chapada.

### 7.3. Borda, textura, granulação

- **Corte a faca**: reto ou a 45°, nunca curva livre.
- **Rasgo**: vocabulário base em capa editorial; nas demais taxonomias, um por peça.
- **Retícula**: duas escalas de ponto permitidas na mesma peça quando codificam ordem de
  camada — construída por peça, não derivada de `pattern.reticula.coarse` (§6.3).
- **Granulação**: só no fundo, amplitude abaixo de 0,028 (um degrau da escada). Sobrevivência à
  compressão de LinkedIn/YouTube segue como lacuna (§11).

### 7.4. Escala pequena

Abaixo de 96px não existe ilustração — existe símbolo (`brand/LOGO/`). Thumbnail de YouTube
(acima do limiar) tem teto de três camadas visíveis.

### 7.5. Descritores proibidos no prompt-kit generativo

`drop shadow`, `soft shadow`, `blur`, `glow`, `rounded corners`, `organic curve`, `gradient`,
`3D`, `bevel`, `emboss`, `handwritten`, `sketchy`, `text`, `lettering`, `typography`,
`caricature`, `satirical`.

### 7.6. Estado do kit

Nenhuma peça de ilustração existe hoje. Peça nova é gerada quando houver necessidade real de
publicação — nunca para preencher amostra (decisão do founder, 04/09/2026).

---

## 8. Acessibilidade — alvo declarado

**AA + SC 2.4.13**, confirmado por texto normativo do W3C/WAI reconfirmado nesta rodada
(`02-pesquisa-e-plugins.md` P3).

| Critério                  | Nível                  | O que impõe                                                                                 |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| 1.4.1 Use of Color        | A                      | Nenhum estado ou marcação só por cor — precisa de rótulo, número ou marcador junto          |
| 1.4.11 Non-text Contrast  | AA                     | 3:1 contra cores adjacentes onde o hairline é a única fronteira de um controle              |
| 2.4.11 Focus Not Obscured | AA                     | Nenhum elemento fixo (faixa, banda) pode esconder o componente focado                       |
| 2.4.13 Focus Appearance   | AAA, adotado como alvo | Área do indicador ≥ perímetro de 2px do componente não-focado; contraste ≥3:1 entre estados |
| 2.5.8 Target Size         | AA                     | Alvo de toque mínimo 24×24 CSS px, com as cinco exceções nomeadas da spec                   |

Nenhum dos cinco exige canto arredondado, sombra ou gradiente. Geometria reta não custa
acessibilidade — o custo aparece só no indicador de foco, como regra de área.

---

## 9. Aplicação em materiais de curso

Segue `brand/APLICACAO.md` para composição de página por superfície. Regra geral: material de
curso (slides, PDFs de aula) é camada de sistema — plano, reto, sem ilustração de collage. A
camada LaTeX (`syntaxis.sty`, `beamerthemesyntaxis.sty`) não existe ainda; os dois `.tex`
citados em rodadas anteriores nunca existiram (ver `04-cleanup.md` da rodada anterior).

---

## 10. Checklist rápido

- [ ] Cor: só tokens de `brand/tokens/syntaxis.tokens.json`
- [ ] Tipografia: Space Grotesk / Hanken Grotesk / Space Mono, sem exceção
- [ ] Radius: 0–2px, exceções nomeadas em §4.3
- [ ] Sem sombra difusa nem glassmorphism — em nenhuma camada. Gradiente/glow só na camada de
      ambiente de fundo (§4.5), nunca em componente, nunca atrás de texto direto
- [ ] Se houver padrão geométrico, é um só, na opacidade certa (§6.5)
- [ ] Ilustração de collage: só em `pipelines/hemingway`, nunca em app ou site
- [ ] Toda ilustração dentro de frame radius 0, hairline 1px, sem sangria
- [ ] Texto nunca renderizado dentro de imagem gerada
- [ ] Foco com perímetro de 2px e contraste 3:1 entre estados

---

## 11. Lacunas abertas

| #   | Lacuna                                                                                                                       | Por que trava                                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Carlito em três lockups SVG legados (`logo_banner*.svg`)                                                                     | decisão de arte, não tomada nesta rodada                                                                                                                   |
| 2   | Pílulas no banner do YouTube — paths com arco, invisíveis a linter                                                           | redesenho de forma, não feito                                                                                                                              |
| 3   | Proporção de tela e respiro ao redor da ilustração dentro de card real                                                       | parcialmente respondida por `design_stitch.md` (radius incompatível — ver `01-referencias.md` §3.3)                                                        |
| 4   | Sobrevivência da granulação à compressão de LinkedIn/YouTube                                                                 | nunca medida                                                                                                                                               |
| 5   | Merge/push das branches órfãs (`apps/skill_test@revisao/04-design-v21`, `pipelines/hemingway@marca/v3-camada-de-ilustracao`) | marcadas como descartadas nesta rodada (Fase 0) — decisão sobre o código que elas continham é da Fase 4 do prompt mestre, fora desta reconstrução de marca |
| 6   | Sincronizar `apps/skill_test/DESIGN.md` e tokens com esta versão                                                             | é a Fase 4 do prompt mestre (refactor do Skill Check), não desta reconstrução                                                                              |
| 7   | `brand/.claude/skills/` (`brandkit`, `emil-design-eng`)                                                                      | decisão do founder, Fase 6                                                                                                                                 |
| 8   | Nível intermediário de luminância entre Chalk e Deep Forest                                                                  | decisão de paleta — a escada atual já serve os dois usos (sistema e ilustração) sem token novo                                                             |
