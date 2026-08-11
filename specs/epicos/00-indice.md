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

### Fase 2 — Quiz v2 (banco de questões, diagnóstico de carreira e relatório)

**Fontes de verdade:** `AVALIACAO.md` e `QUESTIONS.json` (raiz do repositório).

10. `epico-10-banco-questoes-v2.md` — Banco de questões v2 (49 itens, 5 dimensões) e seleção por blueprint de senioridade
11. `epico-11-motor-diagnostico.md` — Motor de pontuação e diagnóstico de carreira (função pura)
12. `epico-12-relatorio-resultados.md` — Relatório de resultados v2 (radar, diagnóstico e CTA), conforme `REPORT.md`
13. `epico-13-qa-regressao-golive-v2.md` — QA de regressão, telemetria de itens e go-live da v2 (remove `AVALIACAO.md`, `REPORT.md`, `QUESTIONS.json` da raiz e os épicos 10–13 após incorporar o conteúdo permanente a `docs/metodologia.md`)

### Fase 3 — Redesign de identidade (marca Syntaxis)

**Fontes de verdade:** `DESIGN.md` (SSOT de marca, permanece no repo) e `REDESIGN.md` + `tokens.json` v1.1.0 (SSOT de tokens, permanece no repo).

14. `epico-14-fundacao-tokens-syntaxis.md` — Fundação: tokens Syntaxis, tipografia, temas light/dark e logos
15. `epico-15-padroes-componentes.md` — Padrões geométricos e restyle da biblioteca de componentes
16. `epico-16-assets-generativos-agy.md` — Pipeline de assets generativos (Nano Banana Pro via agy)
17. `epico-17-redesign-paginas-fluxo.md` — Redesign das páginas do fluxo: landing, quiz e lead
18. `epico-18-redesign-relatorio.md` — Redesign do relatório de resultados (`/resultado`)
19. `epico-19-qa-visual-golive.md` — QA visual, acessibilidade, performance e go-live do redesign (remove `REDESIGN.md` e os épicos 14–19 da raiz após incorporar o conteúdo permanente a `docs/design-system.md`; `DESIGN.md` e `tokens.json` continuam no repo como SSOT vivos)

Épicos 15 e 16 podem ser executados em paralelo (ambos dependem só do Épico 14). Todos os demais da Fase 2 e Fase 3 são sequenciais pelos mesmos motivos da Fase 1.

Cada arquivo segue o mesmo formato: Objetivo → Escopo → Critérios de aceite → Testes obrigatórios → Gate de validação → Boas práticas aplicadas.
