# ÉPICO 3 — Camada de Dados: Banco de Perguntas e Motor de Seleção Adaptativa

**Depende de:** Épico 1 concluído (pode rodar em paralelo ao Épico 2 — não depende de UI)
**Entrada:** `especificacao-quiz-avaliacao.md` (seções 2, 4, 5, 8) e `questions.json` (30 itens)

## Objetivo

Implementar e testar isoladamente, sem qualquer UI, a lógica mais sensível do produto: ler o banco de perguntas, filtrar por senioridade e montar a sessão de 14 perguntas — é a "regra de negócio" central do quiz.

## Escopo

- Copiar `questions.json` para `content/questions.json`, validado em tempo de build contra um schema Zod equivalente ao contrato da seção 8 da especificação.
- `lib/quiz-selection.ts`: dado um `SeniorityLevel`, retorna a pergunta de senioridade (fixa) + 3 perguntas de conhecimento por categoria (sorteadas entre as elegíveis, conforme `targetSeniority`) + a pergunta de autoavaliação, com alternativas embaralhadas.
- `lib/scoring.ts` (função pura, sem API ainda): `calculateScore(answers, questionsBank)` retornando score geral, score por categoria e classificação (seção 4.3 da especificação).
- Garantir por tipagem, não só por convenção, que a versão "para exibição" de uma pergunta de conhecimento nunca contenha `correctOptionId`.

## Critérios de aceite

- Dado `seniority = "aspirante"`, quando chamo a função de seleção, então recebo exatamente 3 perguntas de `produtos-renda-fixa` cujo `targetSeniority` inclui `"aspirante"` (idem para as outras 3 categorias).
- Dado qualquer `seniority`, quando chamo a função de seleção duas vezes, então a ordem das alternativas dentro de cada pergunta é diferente entre as duas chamadas (evidência de shuffle).
- Dado um conjunto de respostas com 8 acertos em 12, quando calculo o score, então `scoreGeral = 66.67` e a classificação é `"médio"` (faixa 40–69% da v2 da especificação).

## Testes obrigatórios

- Teste parametrizado rodando a seleção para os 5 níveis de senioridade, validando que todas as categorias retornam exatamente 3 perguntas elegíveis.
- Teste garantindo que a função de seleção nunca vaza `correctOptionId` no objeto voltado ao client.
- Testes de `calculateScore` cobrindo os limites exatos de faixa (39%/40%, 69%/70%), sem erro de arredondamento na fronteira.

## Gate — não avance para os Épicos 4/5 até que:

- [ ] 100% dos testes unitários de `quiz-selection.ts` e `scoring.ts` passam.
- [ ] A seleção para os 5 níveis de senioridade nunca lança erro nem retorna menos de 3 perguntas em qualquer categoria.
- [ ] Validado (via teste ou script standalone) que o objeto retornado ao "client" não contém `correctOptionId` em nenhuma pergunta.

## Boas práticas aplicadas

Lógica de negócio isolada em funções puras, testável sem subir servidor; validação de schema em tempo de build (falha o build se `questions.json` não bater com o contrato); separação de tipos entre "visão interna com gabarito" e "visão client sem gabarito" — o compilador ajuda a prevenir o vazamento, não só o revisor humano.
