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

Cada arquivo segue o mesmo formato: Objetivo → Escopo → Critérios de aceite → Testes obrigatórios → Gate de validação → Boas práticas aplicadas.
