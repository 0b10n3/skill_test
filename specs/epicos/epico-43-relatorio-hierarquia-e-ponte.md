# ÉPICO 43 — Relatório de resultado: hierarquia e ponte

**Depende de:** Épico 42 (evento `next_step_click`).

**Origem:** pedido do founder de 13/11/2026 (finalizar a página de resultado, levando a uma
página final). Achados R1–R9 de `revisao-2026-11-ui-ux.md`.

## Objetivo

O lead entende o veredito na primeira tela, encontra a orientação logo em seguida e chega ao
botão que leva à página final sem precisar rolar o relatório inteiro.

## Regras que não mudam

- Nenhum cálculo em `lib/diagnostico/` muda. Este épico é apresentação e copy.
- Toda copy mora em `content/relatorio.ts`; componente só seleciona.
- O resultado continua só em memória; acesso direto a `/resultado` continua voltando para `/`.
- A impressão continua cabendo em ~2 páginas A4, com tema claro forçado e CTAs ocultos.
- MailerLite fora de escopo: o botão de reenvio por e-mail continua chamando a mesma rota, com o
  mesmo payload.

## Nova ordem da página

| # | Bloco | Componente | Mudança |
| --- | --- | --- | --- |
| 1 | Veredito + radar | `ReportHeader`, `RadarSection` | lado a lado em `lg`; empilhados no celular |
| 2 | Prioridades | `PriorityCareerSkills` | sobe para logo depois do radar (banda Deep Forest, como hoje) |
| 3 | Ponte para a página final | `NextStepBand` (novo, substitui `CtaSection` e `OfferBlock`) | banda Ink, um único botão Lime |
| 4 | Por dimensão | `DimensionScoreCards` | compacto no celular |
| 5 | Fortes e atenção | `StrengthsAndFocus` | corrige nota zero; "Vale revisitar" vira lista |
| 6 | Gabarito | `AnswerReview` | sem mudança |
| 7 | Guardar e compartilhar | `SaveShareRow` (novo, pequeno) | reenviar por e-mail, compartilhar radar, salvar em PDF |
| 8 | Repetição do convite | linha simples | botão `outline` para a página final |
| 9 | Metodologia | `MethodFooter` | sem mudança |

Largura única: todos os blocos em `max-w-4xl` (R5). Texto corrido dentro dos blocos limitado a
~65 caracteres por linha.

## Especificação por bloco

### 1. Veredito

- `main` com `pt-24` (o cabeçalho fixo tem 56 px) — R2.
- O `<Logo />` do `ReportHeader` passa a `hidden print:block`: na tela, o cabeçalho já mostra a
  marca; na impressão, o cabeçalho some e o logo do relatório aparece.
- Estrutura, alinhada à esquerda:
  - eyebrow: `Diagnóstico de competências · {nível} · {data}`;
  - `h1` em Montserrat, 28 px no celular e 36 px no desktop, com o primeiro nome do
    participante (primeira palavra, no máximo 24 caracteres):
    - alto: "{Nome}, seu perfil está acima da expectativa para {nível}."
    - médio: "{Nome}, seu perfil está dentro da expectativa para {nível}, com gaps específicos."
    - baixo: "{Nome}, seu perfil ainda tem gaps estruturais para {nível}."
  - número em `statNumber` (IBM Plex Mono): `{acertos} de 15`, com "questões · {N}% de acerto"
    ao lado em texto;
  - selo com rótulo relativo ao nível: "Acima da expectativa", "Dentro da expectativa", "Abaixo
    da expectativa" (`CLASSIFICATION_LABEL_LONGO`, novo). O rótulo curto continua valendo para o
    cartão compartilhável. Lime só no selo de "Acima da expectativa".
- Manter `data-testid="score-classificacao"`, `score-geral` e `report-participant-name`.

### 2. Radar

- Cartão ocupa a coluna direita em `lg`; o gráfico cresce até 320 px de altura.
- R3: a frase-resumo só afirma um ponto forte quando a dimensão dominante tem etiqueta `forte`.
  Caso contrário: "Nenhuma dimensão passou da expectativa do seu nível desta vez — as
  prioridades abaixo mostram por onde começar." (`RADAR_SUMMARY_SEM_DESTAQUE`, novo).

### 3. Prioridades

- R6: o gráfico "Impacto no próximo degrau" perde os rótulos numéricos. Entra uma legenda de uma
  linha ("Quanto cada dimensão pesa para o próximo degrau, já considerando o seu gap") e uma
  tabela equivalente em `sr-only`.

### 4. Ponte (`NextStepBand`)

Banda Ink em largura total, logo depois da banda Deep Forest das prioridades (transição por
degrau de luminância, como na landing). Texto sobre fundo sólido, sem pattern.

- eyebrow (`onDark`): "Próximo passo";
- `h2`: a frase de `CTA_HEADLINE[nível][classificação]` (copy já aprovada);
- apoio: "A newsletter gratuita da Syntaxis é onde esse caminho continua.";
- botão Lime, tamanho `lg`, largura total no celular: **"Ver o próximo passo"** → `Link` para
  `/newsletter` (navegação de cliente, para o diagnóstico chegar à página final);
- no clique: `track('next_step_click', { nivel, classificacao, posicao: 'meio' })`.

`CtaSection.tsx` e `OfferBlock.tsx` saem; `content/offers.ts` sai junto se nada mais o importar.

### 5. Por dimensão

No celular, as cinco dimensões viram linhas de um único cartão (ícone e nome, `N/3`, barra,
etiqueta, microcopy), separadas por hairline. No desktop, a grade de cinco cartões continua.

### 6. Fortes e atenção

- R3: "O que te destaca" lista só dimensões com pelo menos um acerto. Sem nenhuma: "Ainda não há
  um ponto forte claro — é comum em quem está começando. As prioridades acima são o melhor ponto
  de partida."
- R7: "Vale revisitar" vira `<ul>`, um tópico por item, sem ponto e vírgula.

### 7. Guardar e compartilhar

Linha de botões `outline`, fora de qualquer cartão: "Receber por e-mail" (mesma chamada e
estados de hoje), "Compartilhar meu radar" (`ShareRadarButton`, inalterado) e "Salvar em PDF"
(`window.print()`). `print:hidden`.

### 8. Repetição do convite

Uma linha no fim: "Leu tudo? O próximo passo está aqui." + botão `outline` "Ver o próximo passo"
→ `/newsletter`, com `posicao: 'fim'`. Não usa Lime: a página já tem o botão da ponte.

## Tipografia e marca

- Texto de leitura a partir de 14 px no celular; 12 px só em rótulo, eyebrow, legenda de gráfico
  e nota de metodologia.
- Sem sombra, radius 0–2 px, hairline de 1 px, uma família de pattern por arquivo.
- Lime na página: botão da ponte e, quando houver, o selo de "Acima da expectativa".

## Testes obrigatórios

- Vitest: `report-header.test.tsx` (três frases de veredito, primeiro nome truncado, rótulo
  longo); `radar-section.test.tsx` (frase sem destaque); teste novo de `StrengthsAndFocus` com
  nota zero; `priority-career-skills.test.tsx` (tabela `sr-only`, sem rótulo numérico).
- E2E: `full-flow-resultado.spec.ts` — o botão da ponte leva a `/newsletter` (até o Épico 44
  existir, afirmar só o `href`); `resultado-a11y.spec.ts` verde nos dois temas;
  `resultado-visual.spec.ts` com snapshots novos, inspecionados um a um (alto, baixo, tablet,
  impressão).
- Um caso E2E novo com zero acertos: nenhuma frase de ponto forte aparece.

## Gate

- [ ] Em 375×667, a primeira tela mostra veredito, número e selo, sem nada cortado.
- [ ] Em 1440×900, veredito e radar aparecem lado a lado na primeira tela.
- [ ] O botão da ponte fica a no máximo três telas do topo em 375×667 (antes: ~6).
- [ ] Zero acertos: nenhum texto afirma ponto forte.
- [ ] Nenhum número cru de peso na tela.
- [ ] Impressão em ~2 páginas A4, sem botões.
- [ ] `next_step_click` dispara uma vez por clique, com `posicao` correto.
- [ ] `prebuild`, vitest, lint, typecheck, `format:check`, build e E2E verdes.
