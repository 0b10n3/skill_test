# ÉPICO 45 — Chassi do funil: quiz, lead, cabeçalho e banner

**Depende de:** Épico 41. Independente dos Épicos 43 e 44.

**Origem:** achados F1–F10 de `revisao-2026-11-ui-ux.md`.

## Objetivo

Ninguém abandona o quiz por causa da interface: o botão principal está sempre visível, o texto é
legível no celular e um toque errado não apaga as respostas.

## Regras que não mudam

- `content/questions.json` não muda. O gabarito nunca vai ao cliente.
- Nenhuma resposta em `localStorage` ou `sessionStorage`.
- `/quiz` e `/lead` continuam sem rolagem **de página** (`h-dvh`).
- MailerLite fora de escopo: `leadSchema`, o texto e a obrigatoriedade do opt-in não mudam.

## Tarefas

### 1. Senioridade em ordem de carreira (F2)

`toClientQuestion` (`lib/quiz-selection.ts`) não embaralha as opções da pergunta de tipo
`seniority`; elas saem na ordem de `content/questions.json`. As perguntas de conhecimento
continuam embaralhadas. Conferir que a ordem no banco é aspirante → estagiário → júnior → pleno
→ sênior; se não for, relatar em vez de editar o banco.

Sob a pergunta de senioridade, uma linha de apoio: "Sua resposta calibra as perguntas para o seu
nível."

### 2. Quiz legível e com o botão no polegar (F3, F10)

Três faixas dentro de `h-dvh`, abaixo do cabeçalho:

| Faixa | Conteúdo | Comportamento |
| --- | --- | --- |
| topo | eyebrow e progresso | fixa |
| meio | pergunta e alternativas | ocupa o espaço restante; só esta faixa rola, e só quando a pergunta não cabe |
| base | botão "Próxima" | fixa; largura total no celular, à direita a partir de `sm`; hairline no topo; fundo sólido |

- Alternativas: 14 px no celular, 16 px a partir de `sm`; linha com altura mínima de 44 px; a
  linha inteira continua clicável.
- Pergunta: 18 px no celular, 20 px a partir de `sm`.
- Eyebrow: o nome da dimensão da pergunta (`CATEGORY_LABEL[question.category]`); na senioridade,
  "Antes de começar".
- Conferir com a pergunta mais longa do banco em 360×640 e 375×667: o botão fica visível e nada
  fica cortado sem rolagem na faixa do meio. A página nunca rola.

### 3. Não perder as respostas por acidente (F4, F5)

- Em `/quiz`, `/lead` e `/resultado`, o logo do `SiteHeader` não é link.
- Enquanto houver respostas e ainda não houver resultado, um `beforeunload` pede confirmação
  antes de recarregar ou fechar a aba. Sai quando o resultado chega.

### 4. Formulário de lead (F6)

- `h1`: **Seu diagnóstico está pronto.**
- Apoio: "Informe seu nome e e-mail para ver o relatório: radar das 5 dimensões, suas 2
  prioridades e o gabarito comentado."
- Campos com 44 px de altura; e-mail com `inputMode="email"`, `autoCapitalize="none"`,
  `autoCorrect="off"`, `spellCheck={false}` e `enterKeyHint="go"`.
- Cada erro ganha `id`, o campo aponta para ele com `aria-describedby`, e o erro de envio tem
  `role="alert"`.
- Botão "Ver meu resultado" com largura total no celular.
- Sob o botão, em 12 px: "Seus dados são tratados conforme a [política de privacidade]." →
  `/privacidade`, em nova aba.
- Manter `data-slot="card-title"`, `#lead-name` e `#lead-email` (seletores dos testes).

### 5. Banner de cookies (F1, F7)

- "Aceitar" passa a `secondary` e "Recusar" continua `outline`, os dois com 44 px de altura no
  celular e o mesmo tamanho. O Lime volta a ser só do CTA do produto.
- No celular, texto mais curto: "Usamos analytics para entender o uso do diagnóstico. Veja a
  [política de privacidade]." Altura total do banner de até 132 px em 375 px de largura.
- O critério de primeira tela do hero está no Épico 46: banner e botão do hero visíveis juntos
  em 375×667.

### 6. Foco visível (F8)

Medir o contraste do anel de foco (`ring-ring/50`) contra o fundo, nos dois temas, em botão,
campo, alternativa do quiz e link. Onde ficar abaixo de 3:1, trocar por anel sólido de 2 px com
`outline-offset` de 2 px, em token que passe. Registrar os valores medidos no relatório.

### 7. Página 404 (F9)

`app/not-found.tsx`: eyebrow "Erro 404", título "Esta página não existe.", botão "Ir para o
Skill Check" → `/`. `noindex`. Sem imagem.

## Testes obrigatórios

- Vitest: `quiz-selection.test.ts` — as opções de senioridade saem na ordem do banco em 50
  execuções; as de conhecimento continuam variando.
- E2E: `quiz-flow.spec.ts` — a página não rola em 360×640 e 375×667 com a pergunta mais longa, e
  o botão "Próxima" está visível; o logo não navega dentro do funil. `lead-form.spec.ts` — erros
  ligados aos campos; envio com Enter. `consent.spec.ts` continua verde com os novos botões.
- `a11y-all-routes.spec.ts` cobre a 404.
- Snapshots de `/quiz` e `/lead` regenerados e inspecionados (os atuais são de agosto).

## Gate

- [ ] Senioridade sempre na ordem de carreira.
- [ ] Nenhum texto de leitura abaixo de 14 px em `/quiz` e `/lead`; alvos de toque de 44 px.
- [ ] "Próxima" visível sem rolar em 360×640, 375×667 e 390×844, em qualquer pergunta.
- [ ] Recarregar no meio do quiz pede confirmação; o logo não leva para fora do funil.
- [ ] Anel de foco com contraste de 3:1 ou mais nos dois temas, com valores registrados.
- [ ] Banner sem Lime, com botões de mesmo tamanho.
- [ ] 404 da marca.
- [ ] `prebuild`, vitest, lint, typecheck, `format:check`, build e E2E verdes.
