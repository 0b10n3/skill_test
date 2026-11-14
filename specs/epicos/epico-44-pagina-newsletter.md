# ÉPICO 44 — Página final `/newsletter`

**Depende de:** Épico 42 (`substackSubscribeUrl`, `cta_offer_click` com `posicao`) e Épico 43
(a ponte do resultado aponta para cá).

**Origem:** pedido do founder de 13/11/2026: uma página final, com estrutura de copy, que leve
ao CTA de inscrição no Substack. Decisões de 13/11/2026: o CTA é um botão com link e UTM (sem
formulário embutido); o bloco "quem escreve" usa bio e foto reais, fornecidas pelo founder.

## Objetivo

Converter o lead que acabou de ver o diagnóstico em assinante da newsletter. A página também
funciona sozinha, para quem chega por link de e-mail ou de rede social.

## Estágio e segmento (checklist de `strategy/FUNIL.md` §6)

- **Estágio:** topo gratuito. O CTA aponta para o Substack, canal do estágio.
- **Segmento:** escolhido pelo diagnóstico, um eixo por variante (`AUDIENCES.md` §2: FEAR e
  GREED nunca no mesmo bloco).

| Nível declarado | Classificação | Segmento | Gancho (`FUNIL.md` §1) |
| --- | --- | --- | --- |
| aspirante, estagiário, júnior | baixo, médio | `#GENZ-FEAR` | efetivação |
| aspirante, estagiário, júnior | alto | `#GENZ-GREED` | provar competência rápido |
| pleno, sênior | baixo, médio | `#Millennials-FEAR` | deixar de ser genérico |
| pleno, sênior | alto | `#Millennials-GREED` | virar referência |
| sem diagnóstico | — | genérico | rigor sem hype |

## Regras de copy

- Voz de marca (`DESIGN.md` §3), tratamento "você", sem emoji.
- **Nenhum percentual e nenhum número de mercado.** A copy abaixo não usa estatística; se o
  founder quiser incluir uma, ela vem de `strategy/FEAR.md` ou `strategy/GREED.md`, com a fonte
  na própria página.
- Nenhuma promessa de salário, promoção ou resultado; nenhuma contagem regressiva; nenhum número
  de assinantes; nenhuma frequência de publicação que o founder não tenha confirmado.
- Nada sobre curso, isca ou preço: não há pré-venda (`FUNIL.md` §3.4).
- A newsletter não promete fechar o gap de uma dimensão específica. Ela oferece repertório; a
  ligação com o diagnóstico é feita pela curadoria de textos do bloco 1.
- A copy abaixo é **rascunho v0**. O founder lê e aprova antes do merge (gate humano).

## Arquitetura

| Arquivo | Papel |
| --- | --- |
| `app/newsletter/page.tsx` | rota; metadata (indexável, canonical `/newsletter`); entra no `sitemap.ts` |
| `components/newsletter/*` | um componente por bloco, sem estado |
| `content/newsletter.ts` | toda a copy, as variantes e a curadoria de posts |
| `content/author.ts` | bio e foto de quem escreve (começa vazio) |
| `lib/newsletter-perfil.ts` | resolve o perfil e o segmento; função pura, com teste |

**De onde vem a personalização**, nesta ordem:

1. diagnóstico em memória (`useQuizAnswers().result`): nível, classificação, dimensão
   prioritária e primeiro nome;
2. query string `?n=<nível>&d=<dimensão>&c=<classificação>`, validada contra os enums de
   `lib/types.ts` (valor inválido é ignorado). Serve para links de e-mail do MailerLite, que tem
   esses campos no assinante. Nunca nome ou e-mail na URL;
3. nada: versão genérica.

Quem vem de `/resultado` por navegação de cliente não vê troca de conteúdo depois de carregar.

**Cabeçalho e rodapé:** em `/newsletter`, o botão do `SiteHeader` é "Assinar a newsletter"
(`posicao: 'newsletter-header'`) e os links de âncora da landing somem. `SiteFooter` aparece e
ganha o link "Newsletter" para todas as páginas.

**CTA:** todo botão de inscrição é um link para `substackSubscribeUrl(posicao)`, com
`target="_blank"` e `rel="noopener noreferrer"` (o diagnóstico continua aberto na aba original),
e dispara `track('cta_offer_click', { posicao, nivel?, classificacao?, origem })`, com `origem`
em `resultado`, `link` ou `direto`.

## Estrutura da página e copy (rascunho v0)

Coluna de leitura de até 65 caracteres; bandas em largura total. Padrões aprovados em
`brand/APLICACAO.md` §1.1–1.2 entre parênteses.

### Bloco 1 — Hero da newsletter (H14: inscrição + últimos textos)

Duas colunas no desktop: texto e CTA à esquerda, três textos reais à direita. No celular: texto,
CTA e só então os textos. O botão cabe na primeira tela em 375×667.

**Com diagnóstico**

- Linha de contexto (IBM Plex Mono): `Seu diagnóstico · {nível} · prioridade: {dimensão}`
- Eyebrow: `Próximo passo`
- H1: **Você já sabe onde está. Agora vem a parte que o diagnóstico não faz por você.**
- Apoio: Quinze questões apontam o gap. Fechar o gap pede repertório. A newsletter da Syntaxis
  entrega esse repertório: instrumentos, matemática financeira e carreira no mercado brasileiro,
  com rigor e sem hype.
- Botão Lime: **Assinar a newsletter** (`newsletter-hero`)
- Microcopy: `Gratuita · no Substack · cancele quando quiser`

**Sem diagnóstico**

- Eyebrow: `Newsletter Syntaxis`
- H1: **Finanças do mercado brasileiro, explicadas com rigor e sem hype.**
- Apoio: Instrumentos, matemática financeira e carreira, por quem dá aula e trabalha com isso.
  Direto no seu e-mail.
- Mesmo botão e microcopy.
- Link secundário, depois do bloco: `Ainda não fez o Skill Check? Descubra seu nível em 10–15
  minutos` → `/`

**Coluna de textos** — título `Leia antes de assinar`; três linhas separadas por hairline, cada
uma com a linha editorial (eyebrow), o título e o subtítulo do post, abrindo em nova aba com os
mesmos UTMs. Curadoria por dimensão prioritária, a confirmar pelo founder:

| Dimensão prioritária | Textos sugeridos |
| --- | --- |
| Mercados & Produtos | Renda Fixa, Condições Variáveis · A anatomia e o verdadeiro risco do CRA · Dividir para não correr risco |
| Matemática & Quant | A Corda e o Arco · Frequência de Capitalização · Você está contando os dias errado |
| Risco & Regulação | Renda Fixa, Condições Variáveis · A anatomia e o verdadeiro risco do CRA · Quando os Modelos se Rebelam |
| Dados & Programação | Quando os Modelos se Rebelam · Coqueiros e cacaueiros · Você está contando os dias errado |
| IA Aplicada | Quando os Modelos se Rebelam · Coqueiros e cacaueiros · A Corda e o Arco |
| sem diagnóstico | Frequência de Capitalização · A Corda e o Arco · Você está contando os dias errado |

Título, subtítulo e URL de cada post vêm de `https://syntaxis.substack.com/api/v1/archive?sort=new`
(campos `title`, `subtitle`, `canonical_url`, `section_name`), copiados para
`content/newsletter.ts`. A lista é estática de propósito: curadoria converte mais que o post
mais recente, e a página não depende de rede no build.

### Bloco 2 — Do diagnóstico ao hábito (C3, um eixo por variante)

Título e dois parágrafos. O segundo responde à objeção-mestra do segmento.

**`#GENZ-FEAR`**
- **Entrar no mercado sem base técnica custa caro. Dá para evitar.**
- Processo seletivo e primeiro ano de trabalho cobram o mesmo vocabulário: indexador, taxa,
  prazo, risco. Quem chega sem ele passa o estágio decorando o que deveria estar usando.
- Você não precisa de experiência para começar. Cada texto parte do conceito e chega no que se
  usa no trabalho, um tema por vez.

**`#GENZ-GREED`**
- **Seu resultado está acima do esperado. Use a vantagem.**
- Estar à frente no seu nível é a melhor hora para aprofundar: o que você aprende agora aparece
  na próxima entrega.
- Dá para aprender de graça no YouTube? Dá, e a newsletter também é gratuita. A diferença é a
  curadoria: um tema por texto, com a conta feita, a fonte citada e o contexto do mercado
  brasileiro.

**`#Millennials-FEAR`**
- **Depois de uma década de carreira, o risco é virar genérico.**
- Pleno e sênior não são cobrados por conhecer o produto. São cobrados por precificar, comparar
  e decidir. O gap que o diagnóstico mostrou é onde essa cobrança aperta.
- Tarde para se especializar? Você tem o repertório que falta a quem está começando. Os textos
  respeitam isso: vão ao mecanismo, com a conta e o contexto institucional.

**`#Millennials-GREED`**
- **Seu perfil está acima da expectativa. O passo seguinte é virar referência.**
- Referência técnica é quem explica o mecanismo quando o modelo e a realidade se descolam. Isso
  se constrói com profundidade, um instrumento por vez.
- Vale o tempo? Cada texto trata de um tema que você usa no trabalho. Leia os que servem à sua
  semana.

**Genérico**
- **Entre o acadêmico distante e o hype sem lastro, existe um caminho.**
- Boa parte do conteúdo financeiro erra para um de dois lados: ou é puramente acadêmico e longe
  da mesa de operações, ou é promessa de guru sem lastro técnico.
- A Syntaxis fica no meio: rigor com aplicação real.

### Bloco 3 — O que chega no seu e-mail (C4, três itens)

Sobre faixa Mint, três colunas no desktop, com hairline entre elas.

- **Notas de um Professor** — Conceitos de finanças, matemática financeira e produtos, por um
  professor que já foi aluno e não se esqueceu. Prático, sem decoreba e sem abrir mão da
  fórmula. Sempre pelos dois lados do balcão: quem compra e quem emite.
- **Spoiler** — Relatos de uma carreira no mercado financeiro, com os spoilers que evitam
  armadilhas. Não é porque alguém sofreu que você também precisa sofrer.
- **Sem hype** — Nenhuma promessa de enriquecimento rápido. Conteúdo educacional, com a fonte
  de cada número.

Depois dos três itens, botão `outline`: **Assinar a newsletter** (`newsletter-meio`).

### Bloco 4 — Quem escreve (C8)

Retrato em cor natural, moldura reta com hairline, sem sombra, ao lado de nome, 2–3 frases de
bio e a frase da essência. Dados em `content/author.ts`:

```ts
export const author: { nome: string; bio: string; foto: { src: string; alt: string } } | null = null;
```

Enquanto for `null`, o bloco não renderiza e a página vai ao ar sem ele. Nada de bio ou retrato
inventado (`DESIGN.md` §5.1 regra 8). O mesmo componente serve à landing (Épico 46).

### Bloco 5 — Perguntas (C12, `details`/`summary` nativos)

- **É gratuita mesmo?** Sim. A assinatura gratuita dá acesso aos textos por e-mail.
- **Já informei meu e-mail no Skill Check. Preciso assinar de novo?** Precisa. São listas
  separadas: o e-mail do Skill Check serve para o seu resultado e para novidades dos cursos; a
  newsletter mora no Substack e só chega a quem assina lá.
- **Posso cancelar?** A qualquer momento, com um clique no rodapé de qualquer e-mail.

### Bloco 6 — Fechamento (C13 + C14: banda Ink com Truchet)

Mesmo formato do CTA final da landing: texto à esquerda, mosaico Truchet como bloco próprio.

- H2: **O próximo texto chega no seu e-mail. O primeiro você pode ler agora.**
- Botão Lime: **Assinar a newsletter** (`newsletter-final`)
- P.S.: `P.S. Quer testar antes? Comece por «{título do primeiro texto da curadoria}».` — o
  título é link para o post. O founder pode trocar o P.S. por um texto dele.
- Nota legal, em 12 px: `Conteúdo educacional e informativo. Não é recomendação de investimento.`

## Marca

- Lime só nos botões de inscrição do hero, do fechamento e do cabeçalho; o botão do meio é
  `outline`.
- Truchet só no fechamento; nenhum outro pattern na página.
- Sem sombra, radius 0–2 px, texto sempre sobre fundo sólido de token, tema claro e escuro.
- Texto de leitura a partir de 16 px nesta página (é uma carta); 12 px só na nota legal e nos
  rótulos.

## Passo humano no MailerLite (registrar em `GOLIVE.md`, sem mexer em código)

Nos e-mails da automação do Skill Check, o link para a página pode levar os campos do assinante:
`https://skill.syntaxis.com.br/newsletter?n={$seniority}&d={$perfil_tecnico}&c={$classificacao}&utm_source=mailerlite&utm_medium=email&utm_campaign=diagnostico`.

## Testes obrigatórios

- Vitest: `lib/newsletter-perfil` — os 15 pares nível × classificação caem no segmento da
  tabela; query inválida vira genérico; toda dimensão tem três posts na curadoria; toda URL de
  post é `https://syntaxis.substack.com/p/…`.
- E2E novo, `newsletter.spec.ts`: (a) acesso direto mostra a versão genérica e o link para o
  Skill Check; (b) vindo do funil, mostra a linha de contexto com nível e dimensão; (c)
  `?n=junior&d=matematica-quant&c=baixo` mostra a variante `#GENZ-FEAR` e a curadoria de Quant;
  (d) os botões de inscrição têm `href` com `/subscribe` e os quatro UTMs, cada um com seu
  `utm_content`; (e) `cta_offer_click` dispara com `posicao`.
- `a11y-all-routes.spec.ts` e `funnel-visual.spec.ts` passam a cobrir `/newsletter` (375, 768,
  1440; claro e escuro).
- `lighthouse-flow-check.mjs` passa a auditar `/newsletter`, com SEO ≥ 95.

## Gate

- [ ] Em 375×667 e 1440×900, o botão de inscrição aparece na primeira tela, nos dois temas.
- [ ] As cinco variantes renderizam; nenhuma mistura FEAR e GREED.
- [ ] Nenhum percentual, preço, prazo ou contagem na página.
- [ ] Bloco "quem escreve" ausente enquanto `author` for `null`; presente e correto com dados.
- [ ] `/newsletter` no sitemap, indexável, com canonical sem query string.
- [ ] Copy lida e aprovada pelo founder; curadoria de posts confirmada.
- [ ] `prebuild`, vitest, lint, typecheck, `format:check`, build, E2E e Lighthouse verdes.

## Anexo — decisões do founder de 13/11/2026

- Copy do épico **aprovada**.
- **Bio** (rascunho a partir do perfil profissional enviado pelo founder; revisar no PR):

```ts
export const author = {
  nome: 'Silvano Junior',
  papel: 'Matemático e analista quantitativo',
  bio: [
    'Bacharel e mestre em matemática, deu aulas de cálculo, álgebra linear e estatística na UFES, na USF e na PUC-Campinas antes de ir para o mercado financeiro como analista quantitativo.',
    'Desenvolveu estratégias quantitativas e backtests, precificou títulos públicos e crédito privado na plataforma de consolidação de carteiras do Modal e da XP, validou modelos de risco de mercado e de precificação no Bradesco e hoje é analista sênior de preços e índices na ANBIMA.',
    'Escreve a Syntaxis para entregar o material que gostaria de ter lido quando era júnior.',
  ],
  nota: 'As opiniões publicadas são pessoais e não representam a posição de empregadores atuais ou anteriores.',
  foto: null, // retrato real entregue pelo founder; até lá, monograma do símbolo
};
```

- **Foto:** até o retrato real chegar, o bloco usa um **monograma com o símbolo da marca** no
  lugar da foto, não a foto de outra pessoa. Retrato de um desconhecido apresentado como o autor
  seria foto de pessoa inventada (`DESIGN.md` §5.1 regra 8). Quando a foto chegar, ela entra em
  `public/img/autor/` e `foto` passa a `{ src, alt: 'Retrato de Silvano Junior' }`.
- Pixel e GA4 no Substack conferidos pelo founder (Épico 42, conferência humana item 5).
