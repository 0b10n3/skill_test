# ÉPICO 6 — API de Submissão, Scoring e Segurança

**Depende de:** Épico 3 (funções de scoring) concluído

## Objetivo

Endpoint server-side que recebe as respostas, recalcula o score de forma confiável e retorna o resultado — o único lugar da aplicação onde o gabarito completo existe.

## Escopo

- Route Handler `POST /api/submit`, payload validado com Zod.
- Recalcula o score no servidor usando `content/questions.json` completo (com gabarito); nunca confia em um score vindo do client.
- Retorna ao client: score geral, score por categoria, classificação e narrativa personalizada (seção 6 da especificação) — nunca o gabarito.
- Rate limiting básico por IP na rota, para evitar abuso/spam de submissões.

## Critérios de aceite

- Dado um payload de respostas manipulado manualmente (ex: enviado direto para a rota, sem ter passado pelo quiz real), quando processado, então o servidor recalcula com base no `question.id` de cada resposta e no gabarito real — o resultado reflete o que foi de fato respondido, não o que o client alega.
- Dado um payload inválido (e-mail malformado, `questionId` inexistente), quando enviado, então a API retorna 400 com mensagem de validação clara, sem quebrar.

## Testes obrigatórios

- Teste de integração: POST com respostas conhecidas → o score retornado bate com o cálculo manual esperado.
- Teste de segurança: inspecionar a resposta HTTP e garantir que nenhum campo contém `correctOptionId` de qualquer pergunta.
- Teste de validação: payloads malformados retornam 400, não 500.

## Gate — não avance para o Épico 7 até que:

- [ ] Teste de integração de scoring passa com pelo menos 3 cenários (baixo/médio/alto).
- [ ] Nenhum gabarito é exposto na resposta de `/api/submit` (verificado via inspeção do JSON de resposta).
- [ ] Payloads inválidos retornam 400 de forma controlada, sem stack trace exposto ao client.

## Boas práticas aplicadas

Validação de entrada com Zod antes de qualquer processamento; nunca confiar em score calculado no client; rate limiting básico; erros tratados e logados no servidor sem vazar detalhes internos na resposta HTTP.
