# Índice de Épicos — Syntaxis Skill Check

Ordem de execução recomendada (cada épico tem seu próprio gate de validação — não pular etapas):

1. `epico-01-fundacao.md` — Repositório GitHub, scaffold Next.js, pipeline de deploy Vercel
2. `epico-02-design-system.md` — Tokens de marca "O Sinal no Escuro" e componentes base
3. `epico-03-motor-selecao.md` — Banco de perguntas e seleção adaptativa por senioridade (sem UI)
4. `epico-04-landing-page.md` — Página inicial ("Hello")
5. `epico-05-fluxo-quiz.md` — UI do quiz, pergunta a pergunta
6. `epico-06-api-scoring.md` — API de submissão, cálculo de score no servidor, segurança
7. `epico-07-mailerlite.md` — Captura de lead e integração com a API do MailerLite
8. `epico-08-pagina-resultado.md` — Score cards, gráficos e oferta personalizada
9. `epico-09-qa-golive.md` — QA final, acessibilidade, performance e critério de go-live

Épicos 2 e 3 podem ser executados em paralelo (nenhum depende do outro, ambos dependem só do Épico 1). Todos os demais são sequenciais — os gates existem justamente para impedir avançar com uma base não validada.

### Fase 2 — Quiz v2 (banco de questões, diagnóstico de carreira e relatório) — ✅ concluída

**Fonte de verdade viva:** [`docs/metodologia.md`](../../docs/metodologia.md) (incorporado do `AVALIACAO.md`/`QUESTIONS.json`/`REPORT.md` originais, removidos da raiz no Épico 13 após o go-live — ver `GOLIVE.md`).

10. ~~`epico-10-banco-questoes-v2.md`~~ — Banco de questões v2 (49 itens, 5 dimensões) e seleção por blueprint de senioridade (arquivo removido da raiz no Épico 13; histórico no git)
11. ~~`epico-11-motor-diagnostico.md`~~ — Motor de pontuação e diagnóstico de carreira (função pura) (arquivo removido da raiz no Épico 13; histórico no git)
12. ~~`epico-12-relatorio-resultados.md`~~ — Relatório de resultados v2 (radar, diagnóstico e CTA) (arquivo removido da raiz no Épico 13; histórico no git)
13. ~~`epico-13-qa-regressao-golive-v2.md`~~ — QA de regressão, telemetria de itens e go-live da v2 (arquivo removido da raiz no Épico 13; histórico no git)

### Fase 3 — Redesign de identidade (marca Syntaxis) — ✅ concluída

**Fonte de verdade viva:** [`docs/design-system.md`](../../docs/design-system.md) (incorporado do `REDESIGN.md` original, removido da raiz no Épico 19 após o go-live — ver `GOLIVE.md`). `DESIGN.md` e `design/tokens.json` continuam no repo como SSOT vivos de marca/tokens.

14. ~~`epico-14-fundacao-tokens-syntaxis.md`~~ — Fundação: tokens Syntaxis, tipografia, temas light/dark e logos (arquivo removido da raiz no Épico 19; histórico no git)
15. ~~`epico-15-padroes-componentes.md`~~ — Padrões geométricos e restyle da biblioteca de componentes (arquivo removido da raiz no Épico 19; histórico no git)
16. ~~`epico-16-assets-generativos-agy.md`~~ — Pipeline de assets generativos (Nano Banana Pro via agy) (arquivo removido da raiz no Épico 19; histórico no git)
17. ~~`epico-17-redesign-paginas-fluxo.md`~~ — Redesign das páginas do fluxo: landing, quiz e lead (arquivo removido da raiz no Épico 19; histórico no git)
18. ~~`epico-18-redesign-relatorio.md`~~ — Redesign do relatório de resultados (`/resultado`) (arquivo removido da raiz no Épico 19; histórico no git)
19. ~~`epico-19-qa-visual-golive.md`~~ — QA visual, acessibilidade, performance e go-live do redesign (arquivo removido da raiz no Épico 19; histórico no git)

Épicos 15 e 16 podem ser executados em paralelo (ambos dependem só do Épico 14). Todos os demais da Fase 2 e Fase 3 são sequenciais pelos mesmos motivos da Fase 1.

Épicos 20–22 (refinamento anti-genérico, SEO técnico/analytics, Design v2.0 — Lime/cantos retos/tipografia grotesca) e 23 (transições explícitas) seguiram o mesmo ciclo; `epico-23-transicao-explicita.md` é o único arquivo de épico dessa faixa que continua na pasta.

### Fase 4 — Sincronização com a marca reconstruída do zero (rodada 3, `brand/`) — em andamento

**Fonte de verdade viva:** `brand/DESIGN.md` v3.0 e `brand/tokens/syntaxis.tokens.json` v2.3.0, no repositório `Syntaxis/` (raiz), reconstruídos do zero em `brand/revisao-2026/`. Mudança central: a camada de ilustração (collage/paper cut) passa a existir só em `pipelines/hemingway` — este app nunca a consumiu, então não há migração de ilustração aqui, só de patterns e tokens.

24. `epico-24-sincronizacao-marca-v3.md` — Sincronização byte a byte de `DESIGN.md` e `tokens.json` com o SSOT
25. `epico-25-simbolo-oficial.md` — Símbolo oficial (`symbol-master.svg`) substitui o wordmark placeholder, fecha lacuna aberta desde o Épico 14
26. `epico-26-gramatica-node-branch.md` — `pattern.nodeBranch` reconstruído sobre a geometria medida do símbolo (0°/90°/±45°, módulo, quarto de arco)
27. `epico-27-reticula.md` — `PatternDataGrid` renomeado para `PatternReticula` (rename puro, sem mudança visual)
28. `epico-28-qa-golive-v3.md` — QA final, confirmação de zero regressão em GA4/Meta Pixel, deploy

Épicos 24 → 25 → 26 → 27 → 28 são sequenciais: cada um depende do estado sincronizado do anterior. Nenhum é candidato a paralelismo — a mudança de símbolo (25) e de pattern (26) tocam os mesmos arquivos de referência visual que o QA final (28) precisa comparar.

Cada arquivo segue o mesmo formato: Objetivo → Escopo → Critérios de aceite → Testes obrigatórios → Gate de validação → Boas práticas aplicadas.
