# Syntaxis — DESIGN.md

**Manual de Marca** · Fonte única da verdade para identidade visual, voz e aplicação de marca
**v4.1** · 31/10/2026 — rodada 5 + imagem no app e no site. Tokens: `brand/tokens/syntaxis.tokens.json` **v3.1.0**.

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
10. [Canais sociais](#10-canais-sociais)
11. [Checklist rápido](#11-checklist-rápido)
12. [Lacunas abertas](#12-lacunas-abertas)

---

## 0. O que esta versão é

### Autoridade e escopo

A v4.0 é **autossuficiente**: toda regra que continua valendo está escrita aqui ou nos
documentos que ela nomeia (`SOCIAL.md`, `APLICACAO.md`, `ILUSTRACOES/`, `CHECKLIST-PR.md`). O
que não está na v4.0 nem tem veredito MANTER no inventário da rodada 5
(`revisao-2026-r5/lab/src/dados/inventario.json`) não vale mais. O que caiu está em
`REVOGACOES.md`, seção "Rodada 5 (v4.0)", com o caminho onde vivia.

A rodada 5 teve autoridade para revogar qualquer decisão anterior, inclusive o que os
documentos chamavam de "invariante". Amplitude aprovada pelo founder: **estreita** — a
identidade (paleta, trio tipográfico, voz, símbolo) resistiu à auditoria e ao benchmark; o que
falhava era a aplicação. Toda regra recebeu veredito explícito (184 regras: MANTER, ALTERAR
ou REVOGAR, com justificativa).

### O que mudou na v4.0 e por quê

| # | Mudança | Por quê |
| --- | --- | --- |
| 1 | Nenhuma regra é imune por ser "invariante": Forest, Grove e Lime ficam por terem resistido à crítica, e a §4.1 diz o que justificaria mudá-las | mandato da rodada 5; a cláusula de imunidade não era regra de cor (R-005) |
| 2 | Os canais sociais ganham documento próprio, `SOCIAL.md`, que substitui `INSTAGRAM.md` e cobre Instagram, Facebook e LinkedIn | o Facebook não existia em nenhum documento; o LinkedIn só como "distribuição editorial" (A6); o 1:1 do Instagram partia de premissa falsa — o grid é 3:4 desde jan/2025 (A2) |
| 3 | Escala medida no aparelho: o piso de texto é 12 px na tela do celular, não um número em 1080 | todas as peças sociais da v3.1 tinham texto de 7,9–10,1 px no feed; a hairline media 1,03:1 e sumia (C19, C26) |
| 4 | O contrato de camadas passa a nomear **superfícies**, não repositórios; produtor de ilustração = `pipelines/portinari` | o `pipelines/hemingway` saiu da ilustração em 09/09/2026 e a regra apontava para ele (R-054) |
| 5 | A ilustração tem **uma governança só, vinculante**: não existe "padrão sobreponível" | o Portinari tratava sombra e tetos como aviso; o bloco injetado nem carregava a regra anti-sombra (lição S7, de novo) |
| 6 | Fotografia e ilustração podem entrar em qualquer seção do app e do site (v4.1), com as regras da §5.1; imagem gerada fotorrealista conta como fotografia, com registro de origem | decisão do founder de 31/10/2026 (revoga I8 e o CP1 Q3) e CP3 Q7 |
| 7 | Tamanho do símbolo se mede pelo **glifo**, não pela caixa do SVG | o glifo ocupa 57% da caixa de `symbol-master.svg`: o "símbolo de 24 px" era um glifo de 13,8 px (§6.1) |
| 8 | Tokens v3.0.0: removidos os depreciados (sombra, `nodeBranch`, `dataGrid`, `reticula.coarse`); entram pesos 600/800, cor da retícula por tema, hairline social e o grupo `social.*` | §4, §6; changelog em `$extensions` |
| 9 | Correções: checklist com o trio de fonte antigo (A1), linha órfã de anti-padrão (A3), §0 com famílias de pattern trocadas (A4), versões de tokens divergentes entre documentos (A5) | erros, não regras |

Relatórios da rodada: `brand/revisao-2026-r5/0{0,1,2,3}-*.md`; laboratório de medição em
`brand/revisao-2026-r5/lab/`.

### Histórico de versões

| Versão | Mudança |
| --- | --- |
| v1.0 | Consolidação do pivô (newsletter → plataforma): voz, padrões geométricos, paleta Forest/Grove/Amber |
| v1.1 | Regras de composição digital: assinaturas visuais e anti-padrões de "design de IA" |
| v2.0 | Amber → Lime (Forest/Grove intocados) · cantos retos · tipografia grotesca moderna |
| v2.1 | Revisão de coerência cross-superfície; `APLICACAO.md` passa a governar superfícies de terceiros |
| v3.0 (rodadas 2 e 3) | Reescrita do zero. Patterns reconstruídos sobre a geometria medida do símbolo; contrato de camadas explícito; ilustração em collage/paper cut, restrita a canais editoriais; alvo de acessibilidade declarado; `nodeBranch` → `mesh`; trio Montserrat / Source Sans 3 / IBM Plex Mono |
| v3.1 (rodada 4) | Atualização escopada: registro de fotografia (Chassis D do Instagram); exceção nomeada da capa do livro; camada LaTeX registrada |
| v4.0 (rodada 5) | Autossuficiente. Sistema social de três canais (`SOCIAL.md`); escala medida no aparelho; contrato de camadas por superfície; ilustração vinculante; tokens v3.0.0 |
| **v4.1 (31/10–01/11/2026, este documento)** | Fotografia e ilustração liberadas em qualquer seção do app e do site (§5.1), fotografia em cor natural, nenhum hero só com o logo; mosaico Truchet (§6.6); família `grafo` com movimento (§6.7); catálogo de heros e componentes de landing (`APLICACAO.md` §1.1–1.2), a partir de mecanismos de `supahero.io` e validado pelo founder no laboratório; tokens v3.1.0 |

### O pivô de produto (mantido desde a v1.0)

| Antes (Substack de investimentos) | Agora (plataforma de treinamento) |
| --- | --- |
| Público: investidores pessoa física | Público: estagiários e analistas do mercado de capitais brasileiro |
| Promessa: conectar portfólio a objetivos de vida | Promessa: skills técnicas aplicáveis no trabalho, incluindo fluência em IA |
| Formato: newsletter editorial | Formato: aulas expositivas + cases reais + skills de IA entregáveis |
| Metodologia implícita | Metodologia explícita e rigorosa (`education/METHODOLOGY.md`) |
| Voz: analítica e humana | Voz: técnica e precisa, no estado da arte acadêmico, mas leve e bem-humorada |

---

## 1. Fundamentos da Marca

### 1.1. Essência

**Estrutura que vira competência.**

A Syntaxis existe para transformar a estrutura de uma decisão real de mercado — com toda a sua
ambiguidade institucional brasileira — em uma capacidade técnica nova e verificável no
trabalho.

### 1.2. Estrutura Estratégica

| Pilar | Definição |
| --- | --- |
| **Propósito** | Ensinar as skills técnicas que o mercado de capitais brasileiro realmente usa — modelagem, dados, renda fixa, IA aplicada — através de professores que somam carreira acadêmica sólida a experiência de mercado real. |
| **Visão** | Ser a referência brasileira em formação técnica para o mercado financeiro, reconhecida por ensinar através de decisões reais, não de exercícios de enunciado limpo. |
| **Missão** | Projetar cada aula e cada case com backward design a partir de uma competência observável no trabalho, entregando ao final de cada módulo as skills de IA e os arquivos de contexto que o aluno leva para o dia a dia. |
| **Mecanismo único** | Professor híbrido (acadêmico + mercado) · case brasileiro real com tensão institucional (CVM, CMN) · AI-first como competência entregável, não como enfeite de marketing. |

### 1.3. Promessa de Resultado

> _Skills e ferramentas de trabalho real — incluindo IA — para alcançar o próximo nível da
> carreira._

Promessa-guia de `strategy/MARKETING.md` §4 (a formulação operacional por segmento está em
`strategy/FUNIL.md` §1). Substitui qualquer formulação genérica ("aprenda finanças", "domine
investimentos") em toda peça de copy, aula ou material de curso.

**Regra de verificabilidade:** a promessa é checável na prática do próprio trabalho do aluno
(ele sabe se passou a usar a skill ou não) — nunca prometemos número de salário ou promoção que
a Syntaxis não controla. Linha vermelha, não sugestão de estilo.

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

`strategy/AUDIENCES.md` é o SSOT de segmentação para copy de vendas. Os quatro segmentos
(`#GENZ-FEAR`, `#GENZ-GREED`, `#Millennials-FEAR`, `#Millennials-GREED`) governam a estrutura
de argumento de qualquer peça comercial; `strategy/FUNIL.md` diz qual segmento é prioritário em
cada estágio.

O que este documento acrescenta é a moldura comum aos quatro:

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

> **Distinção de escopo:** esta seção é a voz de **marca e produto** — como a Syntaxis fala em
> copy, curso, peça social e material comercial. Não é a voz **autoral** de quem escreve o
> Substack, documentada em `pipelines/hemingway/estilo/estilo-autoral.md`. As duas convivem
> porque descrevem coisas diferentes: ao escrever copy, produto ou peça social, use esta seção;
> ao escrever um post de Substack, use `estilo-autoral.md`.

### 3.1. Arquétipo: O Professor Híbrido

A Syntaxis fala como a pessoa que o mecanismo único do produto descreve: alguém com carreira
acadêmica sólida **e** experiência real de mercado, que já viu a ambiguidade institucional
brasileira de perto e não tem paciência para conteúdo genérico traduzido — mas também não tem
nenhuma necessidade de provar isso sendo solene. É competência confortável consigo mesma.

### 3.2. Os Dois Eixos de Tom

**Técnico e preciso, no estado da arte da academia — sem perder a leveza e o bom humor.** Dois
eixos independentes, não um meio-termo:

| Eixo | O que significa | O que NÃO significa |
| --- | --- | --- |
| **Rigor acadêmico** | Toda afirmação tem lastro — bibliografia real, dado com fonte, verbo de Bloom correto no objetivo de aprendizado | Jargão por jargão; complicar para parecer inteligente |
| **Leveza e humor** | Analogias vívidas, autoironia ocasional sobre o próprio mercado financeiro, ritmo de frase que não cansa | Piada forçada; meme; infantilização; humor que descredibiliza o conteúdo técnico |

A regra de ouro: **o rigor nunca é sacrificado pela leveza, e a leveza nunca é sacrificada pelo
rigor.**

### 3.3. Onde o humor vive (e onde não vive)

| Local | Humor permitido? |
| --- | --- |
| Abertura de aula ("por que isso importa no trabalho") | Sim — lugar ideal para analogia leve antes do conteúdo técnico |
| Transições entre blocos de conteúdo | Sim, com moderação |
| Objeções de venda ("acho que já é tarde para mim") | Sim — reconhecer com leveza antes de responder com dado real |
| A tensão institucional de um case | **Não** — a ambiguidade regulatória é o ponto pedagógico |
| Dado numérico ou afirmação técnica | **Não** — precisão em números e fontes é inegociável |
| Nota de Ensino (documento para o professor) | Tom direto e técnico; humor mínimo |

### 3.4. Regras de Vocabulário

- **Português como padrão.** Termos técnicos em inglês quando são o termo de mercado real
  (_duration_, _case_, _asset_, _trainee_, _yield_) — nunca por afetação.
- **Nomes comerciais em português.** Nomenclatura interna de projeto pode continuar em inglês,
  mas nunca vaza para a página de vendas ou para o aluno.
- **Tratamento: "você".** Direto, sem formalidade excessiva.
- **Sem emoji em material técnico.** Emoji apenas em canais informais.
- **Todo percentual leva fonte.** Regra universal de marca — na peça social, a fonte vai no
  próprio slide.

### 3.5. A voz também é pedagógica

- **Abrir por relevância, não por definição** — nunca comece explicando "o que é" antes de "por
  que importa agora, no seu trabalho". No carrossel, é a regra do slide 1 (`SOCIAL.md` §9).
- **Reduzir carga cognitiva extrínseca** — ruído visual e jargão desnecessário são o mesmo erro
  em contextos diferentes.
- **Não infantilizar o adulto profissional** — se uma frase soaria estranha dita a um colega de
  trabalho, não deveria estar em nenhum material da Syntaxis.

### 3.6. Guia rápido Do / Don't

| Faça | Não faça |
| --- | --- |
| Abrir com o problema de mercado antes da definição técnica | Abrir com "Hoje vamos aprender sobre..." |
| Citar a fonte de todo dado numérico | Afirmar percentual sem origem rastreável |
| Usar analogia leve para destravar um conceito difícil | Usar piada que trivializa o risco ou a tensão de um case |
| Tratar o aluno como colega júnior competente | Tratar o aluno como leigo total ou como criança |
| Nomear trilhas e produtos em português | Misturar inglês de vaidade em nome comercial |
| Reconhecer a objeção do aluno com leveza antes de rebater | Ignorar a objeção e insistir só com entusiasmo |

---

## 4. Identidade Visual

### 4.1. Paleta — camada semântica, SSOT em `brand/tokens/syntaxis.tokens.json`

| Papel | Token | Hex |
| --- | --- | --- |
| Âncora institucional | `color.forest.500` | `#1B6A45` |
| Estrutura em movimento | `color.grove.500` | `#2D9E67` |
| Acento único (ação/conquista) | `color.lime.500` | `#CDF163` |
| Fundo claro | `color.neutral.chalk` | `#F7F7F5` |
| Fundo escuro (banda, prancha, peça social) | `color.neutral.deepForest` | `#0F3D27` |
| Fundo escuro máximo contraste | `color.neutral.ink` | `#141414` |
| Fundo do tema escuro do app | `color.theme.dark.background` | `#00120A` |
| Secundário / traço neutro | `color.neutral.slate` | `#4A5568` |
| Hairline do app / divisor | `color.neutral.mist` | `#E2E8F0` |
| Superfície suave | `color.neutral.mint` | `#E6F4EE` |

**O que justifica mudar uma cor-âncora.** Forest, Grove e Lime ficam porque resistiram à
auditoria da rodada 5: o benchmark de setor converge no mesmo eixo (minimalismo suíço) e o
Forest diferencia a marca do navy corporativo e do dourado do setor
(`revisao-2026-r5/01-auditoria.md` §7). Uma mudança futura exige evidência registrada de
legibilidade (contraste medido, teste no aparelho) ou de público — nunca "combinar melhor com
uma referência externa".

**Tons e escopos.**
- Rampas `forest`, `grove` e `lime` (100–900): use o tom pelo contraste medido contra o fundo
  real, nunca por estimativa.
- Eyebrow: `component.eyebrow.colorLight` (`grove.700`, 4,95:1 sobre Chalk) e `.colorOnDark`
  (`lime.300`, 10,46:1 sobre Deep Forest) no app; na peça social, no escuro,
  `social.eyebrowOnDark` (`grove.300`, 6,23:1 sobre Deep Forest), para o Lime aparecer só no CTA.
- Cores semânticas (`color.semantic.*`: success, error, warning, info) são **só estados do
  app**, nunca peça social nem ilustração.
- `#00120A` é o fundo do tema escuro do app; na peça social, só em post sobre o produto
  (`SOCIAL.md` §5.1). Mede 1,04:1 contra Ink: não serve para separar duas áreas.

**Lime — acento único.** Marca ação ou conquista real, nunca cor ambiente; uma ocorrência por
peça. Teto de área: **ilustração ≤1% do quadro** (`illustration.accentMaxCoverage`, medido
0,35% na referência aprovada); **peça de sistema ≤5%** (`social.accentMaxCoverageSystem`;
botão de CTA medido em 4,0–5,0%). O Lime do símbolo (variante escura do logo, `LOGO/README.md`)
é marca, não acento, e não conta.

### 4.2. Tipografia

| Papel | Família | Pesos |
| --- | --- | --- |
| Display (títulos) | Montserrat | 500, 600, 700, 800 |
| Corpo | Source Sans 3 | 400, 600 (700 e 800 disponíveis) |
| Dados / código / mono / eyebrow | IBM Plex Mono | 400, 500, 700 |

Trio fechado, escolhido por disponibilidade no Canva e suporte a pdfLaTeX (`montserrat`,
`sourcesanspro`, `plex` no CTAN) — `REVOGACOES.md` H10. Sem serif, sem itálico como ênfase.
Números de destaque sempre em Plex Mono (`typography.scale.statNumber`).

**Duas famílias no texto de leitura.** Uma peça usa no máximo duas famílias no texto corrido;
Plex Mono em papel de dado (eyebrow, número, rótulo de gráfico, handle) não conta.

Escala de produto: `typography.scale.*` nos tokens. Escala de peça social: `social.type.*` e
`SOCIAL.md` §4 (piso de 12 px no aparelho).

### 4.3. Geometria — camada de sistema

- **Cantos retos, 0–2px.** Exceções nomeadas: avatar, o símbolo circular do logo e os controles
  de seleção nativos (radio, ponto do switch) — nunca estendidas a checkbox, botão, card,
  input, tag ou bento.
- **Sem sombra.** Em nenhuma camada, em nenhum componente. O divisor é a hairline:
  - **app e site:** `component.hairline.colorLight` (Mist) 1 px no claro e `.colorOnDark`
    (`#25372F`, calibrado para `#00120A`) 1 px no escuro;
  - **peça social:** `component.hairline.colorSocial` (`grove.500`) 3 px a 1080, a única cor
    de token ≥3:1 nos três fundos sociais.
- **Contraste por cor chapada, nunca por luz** — exceto a camada de ambiente da §4.5. Nenhum
  brilho, nenhum halo, em componente ou texto.
- **Profundidade por degrau de tom**, nunca por sombra ou escala: um tile promovido muda de
  preenchimento (com rótulo ou marcador junto — SC 1.4.1).

### 4.4. Anti-padrões — escopados por camada

| Anti-padrão | Onde vale | Por quê |
| --- | --- | --- |
| Gradiente contínuo em componente ou atrás de texto direto | sistema | não tem par de token e sai do gate de contraste automatizado. Única exceção: camada de ambiente (§4.5) |
| Radius acima de 2px fora das exceções nomeadas | sistema | "botão pílula" e radius alto liam como template genérico |
| Sombra (difusa, chapada, de contato), glassmorphism, glow | sistema **e** ilustração | profundidade é degrau de tom (§7.1). Glow tem só a exceção de ambiente da §4.5 |
| Palavra-destaque em serif itálico | sistema | revogada na v2.0 |
| Curva orgânica livre | sistema **e** ilustração | a única curva da marca é o quarto de arco do símbolo (§6.1); corte de papel é reto ou a 45° (§7.3) |
| Texto renderizado dentro de imagem gerada | ilustração | o gerador erra tipografia; a marca tem tipografia própria — o alt-text e a faixa sólida carregam a informação verbal |
| Template de skill de terceiro aplicado sem adaptação (ex.: bento com radius e sombra) | sistema | a skill é lente, não autoridade; desvio declarado em `SOCIAL.md` §6 |

### 4.5. Exceção nomeada — gradiente e glow ambiente de fundo

Desde 04/09/2026 (`REVOGACOES.md` H8). Regras, todas obrigatórias para a exceção valer:

1. **Só como camada de ambiente**, na base do empilhamento visual (abaixo de todo conteúdo) —
   nunca em card, botão, input, badge, tag, pattern ou peça social.
2. **Nunca atrás de texto direto.** Todo texto resolve contraste contra um fundo sólido de token
   conhecido; se a região tem texto, há uma superfície sólida entre o texto e o gradiente.
3. **Radial, baixa opacidade, cor de token** — grupo `gradient.ambient.*`, alias de cor
   existente, opacidade máxima 0,25, raio generoso. Nunca hex novo.
4. **Um por seção**, no máximo dois em cantos opostos.

Isto não reabre glassmorphism nem sombra em componente.

---

## 5. O contrato de camadas

Três registros, com fronteira **checável**, decididos **por superfície e por peça** — não por
repositório.

- **Camada de sistema** — UI de `apps/skill_test`, o site, componentes, tipografia, patterns,
  tabelas, gráficos, certificado, material de curso (§9) e os slides tipográficos, de dado e de
  bento das peças sociais. Plana, geométrica, reta, sem sombra. É a moldura onde as outras duas
  camadas entram.
- **Camada de ilustração** — collage / paper cut (§7). Existe em: Substack (capa editorial,
  retrato de dado, cabeçalho de e-mail), peças sociais de Instagram, Facebook e LinkedIn, capa
  de Reels, thumbnail de YouTube e — exceção nomeada — a capa de `brand/templates/livro`
  (§7.7), **qualquer seção do app e do site** (§5.1). Produtor atual: `pipelines/portinari`.
  Nunca no miolo de material de curso.
- **Registro de fotografia** — imagem de pessoa, objeto ou cena, sem paper cut e sem
  vocabulário de UI. Existe nas peças sociais (Chassi D, `SOCIAL.md` §8) e em **qualquer seção
  do app e do site** (§5.1). Nunca em material de curso. Imagem gerada
  fotorrealista conta como fotografia, com registro de origem (modelo e prompt); depoimento
  nunca leva foto de pessoa inventada (`SOCIAL.md` §6).

**Onde dois registros se encontram, o sistema vence:** texto sobre ilustração ou foto vai numa
faixa sólida de token, nunca direto sobre a imagem. Numa peça social de vários slides, cada
slide tem **um** registro; o carrossel combina registros entre slides.

### 5.1. Imagem no app e no site

Desde a v4.1, fotografia e ilustração podem entrar em **qualquer seção** do app e do site — hero,
banner de seção, onboarding, estados (vazio, erro, carregando, conquista), resultado,
certificado — para dar impacto onde a página pede. Regras, todas obrigatórias:

1. **Um registro por bloco.** Um componente ou seção usa fotografia **ou** ilustração, nunca as
   duas na mesma imagem; pattern nunca por cima da imagem.
2. **Texto nunca direto sobre a imagem.** O texto fica ao lado (coluna própria, como no hero da
   landing) ou sobre uma superfície sólida de token. Contraste se mede contra essa superfície.
3. **Moldura reta, sem sombra.** Retângulo com radius 0–2 px; a imagem pode sangrar até a borda
   da seção (a borda da seção é o frame) ou ficar emoldurada com hairline 1 px. Nenhuma sombra,
   brilho ou desfoque.
4. **Par claro/escuro.** A ilustração tem a pilha clara e a escura. A **fotografia é em cor
   natural** — nunca monocromática nem duotone (decisão do founder, 01/11/2026) — e a mesma foto
   serve aos dois temas.
5. **A imagem nunca é a única portadora de informação.** Estado de erro, vazio ou conquista
   tem texto que diz o que aconteceu; `alt=""` quando a imagem é decorativa, alt descritivo
   quando ela informa (SC 1.1.1).
6. **A imagem não fica entre o usuário e a ação.** Nunca atrás de um controle, nunca empurra o
   CTA principal para fora da primeira tela.
7. **Escala pequena:** abaixo de 96 px é símbolo ou ícone, não ilustração (§7.4).
8. **Origem.** Ilustração pelo `_bloco-marca.md` (vinculante); fotografia gerada com o prompt
   versionado junto do asset; depoimento nunca com foto de pessoa inventada.
9. **Nenhum hero só com o logo.** O símbolo sozinho não sustenta um hero: entra foto,
   ilustração, Truchet (§6.6), grafo (§6.7) ou a tela do produto.

**Regras binárias, verificáveis:**

| Regra | Como se verifica |
| --- | --- |
| Ilustração e fotografia nunca no miolo de material de curso | binário, por superfície |
| No app e no site, imagem segue a §5.1 (texto fora da imagem, moldura reta, par claro/escuro) | binário, por componente |
| Fotografia nunca leva paper cut sobre a imagem; paper cut nunca embute fotografia | binário — um registro por peça ou slide |
| Ilustração dentro de página: frame retangular, radius 0, hairline 1 px, nada sangra. Ilustração em quadro social inteiro: a borda da peça é o frame | binário, olhando a borda |
| Texto nunca direto sobre ilustração ou foto | binário — faixa sólida de token |
| Sombra proibida nas duas camadas | binário: qualquer desfoque, sombra ou parede de recorte reprova (`checks.mjs → sem_sombra` no DOM; inspeção nas imagens geradas) |
| Amplitude cromática entre 3 e 7 cores ≥1% do quadro | numérico, por token mais próximo (`illustration.maxColors`) |
| Fundo ≥ 40% do quadro | numérico (`illustration.minBackground`) |
| Lime ≤ 1% (ilustração) / ≤ 5% (peça de sistema) | numérico, contagem de pixels |
| Um matiz de pilha por peça | numérico (`illustration.maxHues`) |
| Pattern: 0°, 90°, ±45°, comprimento múltiplo do módulo | binário, por linter |
| Foco com área de perímetro de 2px | numérico (§8) |

---

## 6. Sistema de padrões

Três famílias — `mesh`, `reticula` e `grafo` (§6.7, v4.1). `growthLine` não é pattern: é **marca de dado**, sempre a
100%, nunca atrás de texto, sempre ligada a conquista verificável (uso real em produção:
`ShareRadarButton.tsx`, o card compartilhável do resultado do Skill Check).

### 6.1. A geometria do símbolo — medida, não estimada

`brand/LOGO/symbol-master.svg`, dois `<path>` em simetria rotacional de 180°. Lido do `d=`:

| Elemento | Medida | Em módulos (M≈40,24u) |
| --- | --- | --- |
| Diagonal do chevron | 56,81u, a exatamente ±45,00° | M·√2 |
| Segmento vertical | 41,42u | 1,03 M |
| Barra horizontal | 40,45u | 1,00 M |
| Quarto de arco | raio 38,92u | 0,97 M |

Quatro medidas dentro de 3% do mesmo módulo. **O quarto de arco é a única curva que o sistema
inteiro contém.** Preenchimento sólido, sem traço.

**O glifo mede 3 M × 3 M**, e é por ele que se mede o tamanho do símbolo. O viewBox do master
(16 × 15,8) contém o glifo em (3,405; 3,40)–(12,594; 12,40): o glifo ocupa 57% da caixa, e o
respiro de ~1,12 M por lado **é a área de proteção** (clearspace ≥ 1 M, o miolo central).
"Símbolo de 48 px" quer dizer glifo de 48 px (caixa ≈ 84 px). Mínimo digital: glifo de 18 px
na tela (caixa de 32 px).

**O símbolo gera a geometria.** Quando M é múltiplo da célula do mesh, o glifo assenta na
malha — vértices do chevron, miolo e arcos em nós. No app, M = 128 px = 4 × `{spacing.lg}`
(`revisao-2026-r5/img/02-hero.png`).

### 6.2. `pattern.mesh` — malha quadriculada

| Propriedade | Regra |
| --- | --- |
| Ângulos | 0°, 90° — só linhas retas, nenhuma diagonal, nenhuma curva |
| Célula | `{spacing.lg}` = 32 px no app (`pattern.mesh.cellSize`); ×3 na peça social (96 px) |
| Traço | 1 px no app (`pattern.mesh.strokeWidth`); 3 px na peça social |
| Cor | `{color.grove.500}` — a única cor de pattern que lê sobre Chalk e Deep Forest sem token por tema |
| Opacidade atrás de texto | 0,12 |
| Opacidade decorativa | 0,25–0,40 |

### 6.3. `pattern.reticula.fine` — retícula de sistema

Ponto de 1 px a cada 14 px no app (×3 na peça social: raio 3, passo 42), opacidade 0,15–0,20,
**sempre dentro de retângulo de canto reto, nunca atrás de texto corrido**. Cor por tema:
`colorLight` = slate no claro (1,25–1,35:1) e `colorOnDark` = Mist no escuro (1,50–1,72:1).
O antigo `color` (Mist nos dois) fica `$deprecated`: sobre Chalk media 1,02–1,03:1 e sumia.

A retícula da ilustração é construída peça a peça (§7.3), não derivada deste token.

### 6.4. Matriz de uso

| Contexto | Pattern | Opacidade | Superfície |
| --- | --- | --- | --- |
| Banda escura em página | `mesh`, campo ou canto | 0,25–0,40 | app, site |
| Atrás de texto corrido | `mesh` | 0,12 | app, site |
| Respiro em conteúdo denso | `reticula.fine` | 0,15–0,20 | app, site |
| Painel/tile texturizado em retângulo reto | `reticula.fine` | 0,15–0,20 | app, site |
| Hero ou banner com grafo (§6.7) | `grafo`: rede a 1, campo a 0,35–0,60, atrás do texto 0,12 | ver §6.7 | app, site |
| Hero, banner ou CTA com Truchet (§6.6) | nenhum pattern no mesmo bloco | — | app, site |
| Certificado e card compartilhável | `mesh` de canto como moldura + `growthLine` | 1,0 | app |
| Prova social / página de vendas | nenhum | — | — |
| Slide de ideia ou número, fundo escuro | `mesh`, campo superior, nunca atrás do número | 0,25 | social (×3) |
| Cartão claro | `reticula.fine` slate, painel fora do texto | 0,20 | social (×3) |
| Capa ilustrada, bento, gráfico, CTA | nenhum | — | social |
| Capa de Reels tipográfica | `mesh`, campo | 0,25–0,40 | social (×3) |

### 6.5. Regra de uso — um pattern por peça

Se uma composição tem padrão geométrico de fundo, é **um só** (na peça social, um por slide),
na opacidade da matriz — nunca `mesh` e `reticula` sobrepostos. No certificado, `mesh` e
`growthLine` convivem por desenho: `growthLine` é marca de dado, não segundo pattern.
Verificável em CI no app: um componente não importa mais de uma família de
`@/components/patterns`.

### 6.6. Mosaico Truchet — composição de hero, banner e CTA (v4.1)

Grade de células quadradas em que cada célula leva **dois quartos de anel em cantos opostos**,
girada ao acaso (semente fixa): as células vizinhas se ligam em curvas contínuas. É o único
mosaico da marca — a única curva que ele usa é o quarto de arco do símbolo (§6.1). As outras
versões testadas (sorteio de formas, tonal, hierárquica, dissolve, super-glifo) foram rejeitadas
pelo founder em 01/11/2026. Exemplos aprovados: hero de captura (H11) e CTA final (C14) no
laboratório da rodada 5 (`/landing`).

| Regra | Valor |
| --- | --- |
| Célula | múltiplo de 8 px; 120 px no desktop, 64–72 px no celular |
| Faixa | largura 22% da célula, centrada no raio de meia célula |
| Cor | faixa `forest.500` sobre Chalk (claro) ou `grove.500` sobre Deep Forest (escuro); no máximo 1 célula em 12 em `grove.300`; **sem Lime** |
| Onde | hero, banner e CTA final de app e site; um bloco próprio, como uma imagem (§5.1) |
| Nunca | atrás de texto; na peça social; junto com `mesh`, `reticula` ou `grafo` no mesmo bloco |

### 6.7. `grafo` — rede na malha, com movimento (v4.1)

Terceira família de pattern. Revisita parte da ideia do nó-e-galho revogado em H9, com a
gramática do símbolo: nós em uma malha de 64 px, arestas só a 0°, 90° e ±45°, nó quadrado de
8 px (P1: o nó não é círculo). Aprovados pelo founder em 01/11/2026: **malha viva** (G1),
**campo de fundo** (G4) e, com o campo do G4 atrás, **rede de skills** (G2) e **nó-e-galho** (G3)
— laboratório `/grafos`.

| Propriedade | Regra |
| --- | --- |
| Malha | 64 px; arestas 0°, 90°, ±45° entre nós vizinhos |
| Traço e nó | aresta 1,5 px `grove.500` a 0,55; nó quadrado 8 px `forest.500` (claro) ou `grove.300` (escuro) |
| Opacidade | 0,12 atrás de texto (como o `mesh`); 0,35–0,60 como campo no lado sem texto; rede principal a 1 |
| Rótulos (rede de skills) | IBM Plex Mono 14 px; no celular a rede de skills cai para a malha sem rótulos |
| Movimento | pulsos de 28 px percorrendo caminhos da rede, 3–6 s por ciclo, defasados; **nada se move** com `prefers-reduced-motion`; o primeiro quadro já mostra a rede inteira |
| Nunca | Lime; junto com `mesh` ou `reticula` no mesmo bloco; animação que bloqueie leitura ou CTA |

---

## 7. Camada de ilustração — collage / paper cut

**Escopo por superfície (§5).** Este capítulo é a regra; `brand/ILUSTRACOES/` é a especificação
executável — `_bloco-marca.md` (bloco injetável no prompt), `meta-prompt-collage-paper-cut.md`
(só cor), `estilos/` (os 14 estilos de referência traduzidos para o paper cut), `FORMATOS.md`
(tamanho por uso). O produtor atual, `pipelines/portinari`, lê esses arquivos em runtime.

**Governança: tudo neste capítulo é vinculante.** Não existe "padrão sobreponível": o pedido do
autor não desliga sombra, tetos, corte, frame ou descritores. Uma exceção é pergunta ao founder
e, se aprovada, exceção nomeada aqui (como a §7.7).

### 7.1. Mecanismo de profundidade — degrau de tom, nunca sombra

A paleta já contém a escada. Luminância relativa medida dos tokens
(`revisao-2026-r5/lab/src/dados/medidas-fase2.json`):

| Papel na peça | Tokens | Degrau de luminância |
| --- | --- | --- |
| Pilha escura | Ink → Deep Forest → forest.700 → forest.500 | 0,029 · 0,028 · 0,046 |
| Pilha clara | mist → mint → Chalk | 0,075 · 0,052 |
| Figura, sobre a pilha | grove.500, grove.300 | +0,150 sobre forest.500; +0,225 sobre grove.500 — salto, não degrau |
| Acento | lime.500 (pilha escura) · lime.700 (pilha clara) | +0,283 sobre grove.300 |

O degrau entre camadas adjacentes vai de **0,028 a 0,075**; o menor, 0,028, é também o teto da
granulação. Os números de figura e acento são encadeados (cada um sobre o anterior).

### 7.2. Regras numéricas

1. Máximo um matiz de pilha por peça, mais um neutro estrutural (`illustration.maxHues`).
2. Entre 3 e 7 cores acima de 1% do quadro (`illustration.maxColors`).
3. Fundo ocupa no mínimo 40% do quadro (`illustration.minBackground`).
4. Profundidade é degrau de tom — sombra é anti-padrão, sem exceção.
5. Lime no máximo 1% do quadro, só em virada/conquista/ação (`illustration.accentMaxCoverage`).
6. Offset de registro tipo risograph, 2–4 px, cor chapada.

### 7.3. Borda, forma, textura

- **Corte a faca**: reto ou a 45°, nunca curva livre. Objeto naturalmente curvo (roda, cabeça,
  mão, moeda) é recortado como polígono, e o pedido **nomeia o polígono** — o gerador ignora um
  "sem curvas" genérico (gerações de teste da rodada 5).
- **Vista frontal, chapada**, como elevação: nada em perspectiva, nenhuma porta ou folha
  entreaberta (a folha girada mostra a espessura do papel).
- **Rasgo**: vocabulário base em capa editorial; nas demais taxonomias, um por peça.
- **Retícula**: até duas escalas de ponto na mesma peça, só quando codificam ordem de camada.
- **Granulação**: só no fundo, amplitude abaixo de 0,028; sobrevive 47–59% da amplitude à
  compressão de LinkedIn, YouTube e Instagram (medido em
  `pipelines/hemingway/pesquisa/epico-sobrevivencia-graos/00-medicao.md`) — mire a metade
  superior da faixa.

### 7.4. Escala pequena e quadro

Abaixo de 96 px não existe ilustração — existe símbolo (`brand/LOGO/`). Thumbnail de YouTube e
capa de Reels vista no grid: no máximo três camadas visíveis. Ilustração em quadro social
inteiro: a borda da peça é o frame, e o pedido declara a zona livre para a faixa de texto em
porcentagem do quadro final (`SOCIAL.md` §7).

### 7.5. Descritores proibidos no prompt

`drop shadow`, `soft shadow`, `cast shadow`, `contact shadow`, `blur`, `glow`,
`rounded corners`, `organic curve`, `gradient`, `3D`, `bevel`, `emboss`, `depth of field`,
`handwritten`, `sketchy`, `text`, `lettering`, `typography`, `caricature`, `satirical`.

São lint da parte criativa do prompt, **inclusive negados** ("no glow" reprova): as negações
moram no bloco de marca, que não passa pelo lint.

### 7.6. Estado do kit

Peça gerada quando há necessidade real de publicação — nunca para preencher amostra. O
entregável do Portinari é o prompt (um por modo, escuro e claro), validado por uma geração. O
gate de ilustração é a rubrica do Portinari; o gate da peça social que usa a ilustração são os
checks de `SOCIAL.md` §13.

### 7.7. Exceção nomeada — capa de `brand/templates/livro`

Único ponto de material de curso onde a camada de ilustração existe, por pedido do founder
(04/09/2026). Regras, todas obrigatórias:

1. Vale só para a capa (`assets/capa-collage.pdf`), nunca para o miolo — o miolo permanece
   sistema puro: nenhuma colagem, nenhuma sombra de papel, nenhuma borda rasgada.
2. O título da capa fica sobre uma **faixa sólida**, nunca direto sobre a ilustração.
3. A capa tem variante de sistema puro: `livro.pdf` (padrão) e `livro-collage.pdf`,
   selecionáveis por `\syntaxiscapavariante` (`brand/templates/livro/README.md`).
4. A exceção não se estende por semelhança a outra peça de curso — uma nova peça que queira
   collage é pergunta nova ao founder.

---

## 8. Acessibilidade — alvo declarado

**AA + SC 2.4.13.**

| Critério | Nível | O que impõe |
| --- | --- | --- |
| 1.4.1 Use of Color | A | Nenhum estado ou marcação só por cor — precisa de rótulo, número ou marcador junto |
| 1.4.3 Contrast (Minimum) | AA | 4,5:1 para texto; 3:1 para texto grande. Na peça social, "grande" se mede **no aparelho** (≥24 px, ou ≥18,66 px em 700) |
| 1.4.11 Non-text Contrast | AA | 3:1 contra cores adjacentes onde a hairline é a única fronteira de um controle |
| 2.4.11 Focus Not Obscured | AA | Nenhum elemento fixo (faixa, banda) pode esconder o componente focado |
| 2.4.13 Focus Appearance | AAA, adotado como alvo | Área do indicador ≥ perímetro de 2 px do componente não-focado; contraste ≥3:1 entre estados |
| 2.5.8 Target Size | AA | Alvo de toque mínimo 24×24 CSS px, com as cinco exceções da spec |

**Peça social:** nenhum texto abaixo de 12 px na tela do celular (34 px a 1080); alt-text em
toda imagem; gráfico com legenda e rótulo direto (§10). Nenhum dos critérios exige canto
arredondado, sombra ou gradiente.

---

## 9. Aplicação em materiais de curso

Segue `brand/APLICACAO.md`. Material de curso (slides, PDFs de aula) é camada de sistema —
plano, reto, sem collage, com a única exceção da capa do livro (§7.7). Camada LaTeX:
`brand/templates/beamer/` (`beamerthemesyntaxis.sty`) e `brand/templates/livro/`
(`syntaxis-book.sty`), com `build.sh` e `check-deps.sh` próprios.

---

## 10. Canais sociais

Instagram, Facebook e LinkedIn seguem **`brand/SOCIAL.md`** — papel de cada canal no funil,
formato-mestre 4:5 com derivação por re-renderização, elementos de reconhecimento que
sobrevivem ao recorte 3:4 do grid, escala tipográfica com piso no aparelho, chassis (A capa
ilustrada, B tipografia escura, C cartão claro, D fotografia, E bento), arquitetura do
carrossel, gráficos, legenda por canal e checks automáticos. A produção é HTML/CSS com tokens,
exportado para PNG e PDF (`brand/.claude/skills/syntaxis-social/`).

**Prioridade em conflito na peça social:** clareza ≥ consistência > reconhecimento > estética >
variedade.

**Gráficos, em qualquer superfície:** a paleta é monocromática e nenhum par de tokens passa
como paleta categórica no validador da skill `dataviz`. A forma da marca é **ênfase** — a série
que é o ponto em `grove.500`, contexto em `slate`, sobre Chalk; duas séries de peso igual viram
dois gráficos ou rótulo direto. Um gráfico por slide.

---

## 11. Checklist rápido

- [ ] Cor: só tokens de `brand/tokens/syntaxis.tokens.json` (v3.1.0)
- [ ] Tipografia: Montserrat / Source Sans 3 / IBM Plex Mono; duas famílias no texto de leitura
- [ ] Radius: 0–2px, exceções nomeadas em §4.3
- [ ] Nenhuma sombra, em nenhuma camada. Gradiente/glow só na camada de ambiente (§4.5)
- [ ] Um pattern por peça (por slide, no social), na opacidade da matriz (§6.4)
- [ ] Imagem (foto ou ilustração) no app e no site segue a §5.1: um registro por bloco, texto fora da imagem, moldura reta, par claro/escuro; nunca no miolo de curso
- [ ] Fotografia gerada só com registro de origem
- [ ] Lime: uma ocorrência; ≤1% em ilustração, ≤5% em peça de sistema
- [ ] Texto nunca renderizado dentro de imagem gerada
- [ ] Peça social: `SOCIAL.md` §13 (checks) verde
- [ ] Foco com perímetro de 2px e contraste 3:1 entre estados

---

## 12. Lacunas abertas

| # | Lacuna | Situação |
| --- | --- | --- |
| 1 | Carlito em três lockups SVG legados (`LOGO/logo_banner*.svg`) | decisão de arte, não tomada |
| 2 | Pílulas no banner do YouTube — paths com arco, invisíveis a linter | redesenho de forma, não feito |
| 3 | Nomes de arquivo errados em `LOGO/` (`logo_chalk_grove_banner.png` e `logo_ink_grove_banner.png` são idênticos e têm fundo Deep Forest) | renomear exige decidir o nome certo (`LOGO/README.md`) |
| 4 | Duas regras novas do prompt-kit (polígono nomeado, vista frontal) | sem geração de teste que as valide |
| 5 | Margens de segurança do Reels na base (420) e à direita (130) | de fontes secundárias; reverificar na primeira publicação |
| 6 | Papel do Facebook | proposto por argumento, sem dado de campanha (`[VERIFICAR]`) |
| 7 | Branches órfãs (`apps/skill_test@revisao/04-design-v21`, `pipelines/hemingway@marca/v3-camada-de-ilustracao`) | decisão do founder sobre o código, fora do escopo de marca |
| 8 | Respiro entre o mesh e o título nos slides B da peça social (crítica independente da Fase 5) | aceito na v4.0; testar mesh até a metade do quadro antes de mudar a regra |
