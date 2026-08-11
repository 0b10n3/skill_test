# ÉPICO 11 — Motor de Pontuação e Diagnóstico de Carreira

**Depende de:** Épico 10 concluído. **Fonte de verdade:** `AVALIACAO.md` §5 (modelo de pontuação, pesos de impacto, prioridade, fortes/fracos).

## Objetivo

Implementar a camada de diagnóstico que transforma as 15 respostas em: score por dimensão, classificação global, pontos fortes/fracos e ranking de prioridade de desenvolvimento — como módulo puro, testável e independente de UI.

## Escopo

- Módulo `lib/diagnostico/` (ou pasta equivalente do padrão do projeto) exportando uma função pura `computeDiagnostico(respostas, nivel, banco)` que retorna um objeto tipado com:
  - `scoreGlobal` (0–1) e `acertos` (0–15);
  - `classificacao` (`alto` ≥ 0.80 | `medio` 0.47–0.79 | `baixo` ≤ 0.46);
  - `dimensoes[]`: por dimensão, `acertos` (0–3), `score` (0–1), `etiqueta` (`forte` ≥ 0.67 | `neutro` | `atencao` ≤ 0.33);
  - `fortes[]` e `atencao[]` (1–2 dimensões cada, com regras de desempate por peso de impacto; nunca vazios);
  - `prioridades[]`: as 5 dimensões ordenadas por `(1 − score) × careerImpactWeight[nivel][dimensao]`, com o valor numérico exposto;
  - `topicosParaRevisar[]`: por dimensão em atenção, os temas das questões erradas (derivados de metadados dos itens — nunca o texto "você errou a questão X").
- Matriz `careerImpactWeight` (5 níveis × 5 dimensões) definida em arquivo de configuração versionado, com os valores do `AVALIACAO.md` §5.3 e comentário apontando a fonte.
- Persistir o diagnóstico completo junto ao lead (payload enviado/armazenado hoje ganha os novos campos), para permitir análises psicométricas futuras (`AVALIACAO.md` §6): registrar também, por item respondido, o id do item e a alternativa escolhida.
- Sem mudanças de UI neste épico: a página `/resultado` atual pode continuar exibindo o cálculo antigo até o Épico 12; o novo módulo é integrado por trás de flag ou em paralelo.

## Critérios de aceite

- Dado um conjunto de respostas com 12+ acertos, quando o diagnóstico é computado, então `classificacao === "alto"`; com 7–11, `"medio"`; com 0–6, `"baixo"` (fronteiras testadas: 6, 7, 11, 12).
- Dado um participante pleno com score 1/3 em `dados-programacao` (peso 0.25) e 0/3 em `ia-aplicada` (peso 0.20), quando as prioridades são computadas, então `ia-aplicada` (0.20) < `dados-programacao` (0.1667... ×) — verificar exatamente: prioridade = gap × peso → dados: (1−0.33)×0.25 = 0.1675; ia: (1−0)×0.20 = 0.20 → `ia-aplicada` é a prioridade #1. O teste deve fixar este exemplo numérico como caso de regressão.
- Dado um participante com todas as dimensões no mesmo score, quando fortes/atenção são computados, então cada lista contém ao menos 1 dimensão, selecionada pelo desempate de peso de impacto (nunca listas vazias).
- Dado qualquer combinação válida de respostas e nível, quando o diagnóstico é computado, então a função é pura (mesma entrada → mesma saída) e não lança exceção para os extremos 0/15 e 15/15.

## Testes obrigatórios

- Testes unitários do módulo cobrindo: fronteiras de classificação; fórmula de prioridade (incluindo o caso numérico acima); regras de desempate; extremos 0/15 e 15/15; empate total.
- Teste de propriedade (property-based ou tabela exaustiva) garantindo `fortes` e `atencao` nunca vazios para qualquer vetor de acertos possível (4^5 combinações de acertos por dimensão são enumeráveis — testar todas).
- Teste de integração: submissão completa do quiz persiste o diagnóstico e o vetor item-a-item junto ao lead.

## Gate — critério para avançar ao Épico 12

- [ ] 100% dos testes unitários e de propriedade verdes; cobertura do módulo de diagnóstico ≥ 90%.
- [ ] Diagnóstico persistido e verificado em ambiente de preview (payload inspecionado).
- [ ] Matriz de pesos revisada contra `AVALIACAO.md` §5.3 (conferência manual documentada no PR).
- [ ] Nenhuma regressão na suíte E2E existente.

## Boas práticas aplicadas

Lógica de diagnóstico como função pura separada da UI e da persistência: os pesos e limiares são configuração versionada (não números mágicos espalhados), o que permite recalibrar a metodologia no futuro com um PR de uma linha e re-rodar os mesmos testes.
