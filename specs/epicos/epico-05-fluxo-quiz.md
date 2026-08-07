# ÉPICO 5 — Fluxo do Quiz (UI)

**Depende de:** Épico 3 (motor de seleção) e Épico 4 (entrada vinda da landing) concluídos

## Objetivo

Renderizar a sessão de 14 perguntas gerada pelo Épico 3, uma por vez, com progresso visível e sem persistência indevida de respostas.

## Escopo

- Rota `/quiz`, client component com estado local (Context ou `useReducer`) guardando respostas em memória.
- Uma pergunta por tela; avanço só após seleção de alternativa; sem opção de voltar.
- Barra de progresso ("Pergunta X de 14"), números em JetBrains Mono.
- Ao responder a última pergunta (autoavaliação), navega para `/lead`.
- Nenhuma resposta gravada em `localStorage`/`sessionStorage`.

## Critérios de aceite

- Dado que estou na pergunta 1 (senioridade), quando seleciono "Júnior", então as perguntas seguintes carregadas são as elegíveis para `junior` (verificável via categoria + `targetSeniority` no payload recebido).
- Dado que respondo todas as 14 perguntas, quando termino, então sou redirecionado para `/lead` e nenhuma resposta está salva em `localStorage`/`sessionStorage` (inspecionável via devtools).
- Dado `prefers-reduced-motion: reduce` no navegador, quando avanço entre perguntas, então nenhuma animação de transição é aplicada.

## Testes obrigatórios

- Teste E2E completo do fluxo: responder as 14 perguntas em sequência, chegar em `/lead`.
- Teste de acessibilidade de teclado: completar o quiz inteiro só com Tab + Enter/Space, sem mouse.
- Teste explícito checando `localStorage`/`sessionStorage` vazios após completar o quiz.

## Gate — não avance para o Épico 6 até que:

- [ ] Teste E2E do fluxo completo (14 perguntas → `/lead`) passa.
- [ ] Quiz é 100% navegável por teclado.
- [ ] Nenhuma resposta persistida em storage do navegador.

## Boas práticas aplicadas

`aria-live="polite"` na barra de progresso; foco de teclado movido para a nova pergunta a cada avanço; nenhum dado sensível (gabarito) chega ao bundle client, garantido já no Épico 3.
