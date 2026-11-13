# ÉPICO 46 — Landing: clareza e conversão

**Depende de:** Épico 45 (banner de cookies) e, para o bloco "quem escreve", Épico 44.

**Origem:** achados L1–L8 de `revisao-2026-11-ui-ux.md`.

## Objetivo

Em uma tela, o visitante entende o que é, quanto custa, quanto tempo leva e o que recebe — e vê
o botão.

## Regras que não mudam

- O hero continua no formato aprovado no Épico 40: texto à esquerda e mosaico Truchet como bloco
  próprio.
- A promessa `HERO_PROMISE` (`DESIGN.md` §1.3) não muda de sentido.
- Toda copy em `content/landing.ts`. Nenhum número sem origem no próprio produto.

## Nova ordem da página

| # | Seção | Estado |
| --- | --- | --- |
| 1 | Hero | ajustado |
| 2 | Como funciona (C5) | nova |
| 3 | O que avaliamos (bento) | copy e tipografia |
| 4 | Faixa de fatos (C2) | conteúdo trocado |
| 5 | Metodologia (banda Deep Forest) | texto reestruturado |
| 6 | Quem escreve (C8) | nova; só aparece com dados reais |
| 7 | Perguntas frequentes (C12) | nova |
| 8 | CTA final (C14) | sem mudança |
| 9 | Rodapé (C15) | link "Newsletter" (Épico 44) |

## Especificação

### 1. Hero (L1)

- `h1` em 32 px no celular (hoje 40 px); 64 px a partir de `sm`, como hoje.
- Ordem: eyebrow → `h1` → promessa → **botão** → microcopy → parágrafo de apoio. O parágrafo
  "Uma avaliação adaptativa…" desce para depois do botão.
- Microcopy: `Gratuito · 10–15 min · 15 perguntas`.
- No celular, uma faixa de Truchet de 64–72 px de altura depois do texto (célula de 64–72 px,
  `DESIGN.md` §6.6), como já acontece no CTA final.
- **Critério de primeira tela:** em 375×667, com o banner de cookies aberto, `h1`, promessa e
  botão do hero ficam inteiros acima do banner.

### 2. Como funciona (L2)

Três passos numerados em IBM Plex Mono, com hairline entre eles; três colunas no desktop,
empilhados no celular. Sem ícone decorativo.

1. **Responda 15 questões.** Múltipla escolha, calibradas para o seu nível, em 10–15 minutos.
2. **Informe nome e e-mail.** É o que libera o seu relatório.
3. **Receba o diagnóstico.** Radar das 5 dimensões contra a expectativa do seu nível, suas 2
   prioridades com o primeiro passo de cada uma e o gabarito comentado.

Âncora `#como-funciona`, com link no menu do cabeçalho.

### 3. O que avaliamos (L8)

- Apoio do título: "15 questões, 3 por dimensão, calibradas para o seu nível. Abaixo, exemplos
  reais do banco."
- Rótulos dos tiles em 12 px (hoje 11 px). Legendas e alternativas em 14 px.

### 4. Faixa de fatos (L4)

`METODO_STATS_ITEMS` passa a: `15` questões · `5` dimensões de competência · `10–15` minutos ·
`R$ 0` para fazer.

### 5. Metodologia (L3)

- Manchete em Montserrat (`METODOLOGIA_MANCHETE`, nova em `content/relatorio.ts`): **Não medimos
  quanto você sabe de finanças. Medimos a distância até o próximo degrau da sua carreira.**
- O primeiro parágrafo de `METODOLOGIA_RESUMO` desce para corpo de texto (16 px), seguido do
  terceiro, como hoje. `MethodFooter` continua.

### 6. Quem escreve (L6)

Reaproveita o componente do Épico 44 e `content/author.ts`. Enquanto `author` for `null`, a
seção não existe.

### 7. Perguntas frequentes (L5)

`details`/`summary` nativos, coluna de leitura. Âncora `#perguntas`.

- **É gratuito?** É. O diagnóstico completo não tem custo.
- **Por que pedem meu e-mail?** Para liberar o relatório e para enviar novidades de cursos e
  conteúdo técnico da Syntaxis. Você pode sair da lista a qualquer momento.
- **Quanto tempo leva?** De 10 a 15 minutos. São 15 questões de múltipla escolha.
- **Para quem é?** Para quem trabalha ou quer trabalhar no mercado financeiro brasileiro, de
  aspirante a analista sênior. As perguntas mudam conforme o nível que você declara.
- **O resultado é uma certificação?** Não. É um retrato direcional: 15 questões apontam onde
  estão os seus gaps, mas não substituem uma prova de certificação.
- **O que acontece com os meus dados?** Está na [política de privacidade].

### 8. Metadados (L7)

`description`: "Avaliação gratuita de 10 a 15 minutos sobre renda fixa, matemática financeira,
dados e IA aplicada ao mercado financeiro. Descubra seu nível e veja suas prioridades de
desenvolvimento."

## Marca

- Um pattern por bloco: Truchet no hero e no CTA final; retícula na metodologia; nenhum nas
  seções novas.
- Lime: botão do cabeçalho, marcador sob "nível", botão do hero e botão do CTA final, como hoje.
  Nenhuma ocorrência nova.
- Sem sombra, radius 0–2 px, texto de leitura a partir de 14 px.

## Testes obrigatórios

- `landing-page.spec.ts`: as três seções novas existem; as âncoras do menu levam a elas; o
  critério de primeira tela do hero em 375×667, com e sem banner; "Gratuito" visível.
- `a11y-all-routes.spec.ts` verde nos dois temas.
- Snapshots da landing regenerados e inspecionados (375, 768, 1440; claro e escuro).
- Lighthouse da home: SEO ≥ 95 e desempenho sem regressão em relação à linha de base.

## Gate

- [ ] Botão do hero visível em 375×667 com o banner aberto.
- [ ] "Gratuito" na primeira tela.
- [ ] Nenhum parágrafo em corpo de título com mais de 25 palavras.
- [ ] Nenhum texto de leitura abaixo de 14 px.
- [ ] Seção "quem escreve" ausente sem dados.
- [ ] `prebuild`, vitest, lint, typecheck, `format:check`, build, E2E e Lighthouse verdes.
