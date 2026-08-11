# ÉPICO 10 — Banco de Questões v2 e Seleção por Blueprint de Senioridade

**Depende de:** Épicos 1–9 concluídos (app em produção). **Fontes de verdade:** `AVALIACAO.md` (metodologia, §3–§4) e `QUESTIONS.json` (banco v2), ambos na raiz do repositório.

## Objetivo

Substituir o banco de questões atual pelo banco v2 (49 itens + item de senioridade), com 5 dimensões de competência e seleção determinística de exatamente 15 questões por nível (3 por dimensão), preservando o fluxo existente do quiz.

## Escopo

- Migrar `QUESTIONS.json` (raiz) para o local canônico de dados do app, substituindo o banco atual. O banco antigo é aposentado (movido para `data/archive/questions-v1.json`), nunca apagado.
- Estender o schema de questão: novos valores de `category` (`mercados-produtos`, `matematica-quant`, `dados-programacao`, `ia-aplicada`, `risco-regulacao`) e novo campo opcional `cognitiveLevel` (`compreender` | `aplicar` | `analisar`). Tipagem (TypeScript/Zod ou equivalente já usado no projeto) atualizada e validada em build.
- Implementar o motor de seleção: dado o nível declarado em `q00`, montar a prova com os 15 itens cujo `targetSeniority` contém o nível — exatamente 3 por dimensão. Ordem de exibição: embaralhar itens dentro da prova, mas **nunca** embaralhar as alternativas de um item (os distratores foram escritos na ordem em que estão).
- Script de validação do banco (`scripts/validate-questions.(ts|mjs)`) executável em CI: JSON válido; ids únicos; todo item `knowledge` com 4 alternativas, `correctOptionId` existente entre as alternativas e `explanation` não vazia; para cada um dos 5 níveis, exatamente 3 itens por dimensão (15 no total); distribuição de dificuldade por nível igual à tabela do `AVALIACAO.md` §4.2.
- Nenhuma mudança de UI neste épico além do necessário para exibir 15 questões (progresso "X de 15").

## Critérios de aceite

- Dado qualquer um dos 5 níveis selecionado em `q00`, quando o quiz é montado, então ele contém exatamente 15 questões, sendo 3 de cada dimensão, todas com `targetSeniority` compatível.
- Dado o mesmo nível selecionado duas vezes, quando o quiz é montado, então o conjunto de questões é idêntico (a ordem pode variar; o conjunto, não).
- Dado o banco v2 com um item propositalmente corrompido (ex.: `correctOptionId` inexistente), quando o script de validação roda, então ele falha com mensagem apontando o item.
- Dado o fluxo completo Landing → Quiz → Lead → Resultado, quando executado com o banco v2, então nenhuma etapa quebra (o resultado pode ainda usar o cálculo antigo; o novo diagnóstico é o Épico 11).

## Testes obrigatórios

- Testes unitários do motor de seleção cobrindo os 5 níveis (contagem por dimensão, compatibilidade de `targetSeniority`, determinismo do conjunto).
- Execução do script de validação do banco em CI, bloqueante.
- Testes E2E existentes do fluxo de quiz atualizados para 15 questões e rodando verdes.

## Gate — critério para avançar ao Épico 11

- [ ] Script de validação do banco verde em CI e integrado ao pipeline.
- [ ] Testes unitários do motor de seleção verdes para os 5 níveis.
- [ ] Suíte E2E do fluxo completo verde em preview.
- [ ] Banco v1 arquivado (não deletado) com nota no README de dados.

## Boas práticas aplicadas

O banco de questões é dado versionado, não conteúdo hardcoded: toda alteração futura de item passa por PR e pelo script de validação; itens são aposentados por substituição, nunca editados silenciosamente (preserva comparabilidade histórica dos resultados, conforme `AVALIACAO.md` §6).
