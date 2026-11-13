# ÉPICO 47 — QA visual, acessibilidade, desempenho e go-live

**Depende de:** Épicos 42–46 concluídos e aprovados.

**Origem:** fechamento da revisão de novembro de 2026 (`revisao-2026-11-ui-ux.md`).

## Objetivo

Provar que o app inteiro está na marca, funciona no celular e no desktop, nos dois temas, e que
a medição em produção bate com o que o código envia.

## Tarefas

### 1. Regressão completa

```bash
npm run prebuild && npm run lint && npm run typecheck && npm run format:check
npm test
MAILERLITE_API_KEY=e2e-invalid npm run test:e2e
MAILERLITE_API_KEY=e2e-invalid npm run test:lighthouse:flow
```

Tudo verde. Nenhum snapshot atualizado sem inspeção visual do diff.

### 2. Matriz visual

Capturar e inspecionar cada rota em cada combinação; guardar as capturas como snapshots dos
testes visuais.

| Rota | 360×640 | 375×667 | 390×844 | 768×1024 | 1440×900 |
| --- | --- | --- | --- | --- | --- |
| `/` | claro, escuro | claro, escuro | claro, escuro | claro, escuro | claro, escuro |
| `/quiz` (senioridade, `q27`, pergunta curta) | idem | idem | idem | idem | idem |
| `/lead` (vazio e com erros) | idem | idem | idem | idem | idem |
| `/resultado` (alto, baixo, zero acertos) | — | claro, escuro | — | claro | claro, escuro |
| `/newsletter` (genérica e as 4 variantes) | — | claro, escuro | — | claro | claro, escuro |
| `/privacidade`, 404 | — | claro | — | — | claro |

Em toda captura: sem rolagem horizontal, sem texto cortado, sem conteúdo atrás do cabeçalho
fixo, botão principal visível na primeira tela onde o épico de origem exige.

### 3. Auditoria de marca (`DESIGN.md` §11)

- `lint:colors`, `lint:radius`, `lint:patterns`, `audit:contrast`, `check:brand-sync` verdes.
- Varredura manual, rota por rota, registrada numa tabela no relatório:
  - Lime só em ação ou conquista; listar cada ocorrência por rota;
  - nenhuma sombra, nenhum gradiente fora da camada de ambiente, nenhum radius acima de 2 px;
  - um pattern por bloco; Truchet nunca atrás de texto;
  - trio de fontes; nenhum itálico de ênfase; números de destaque em IBM Plex Mono;
  - texto de leitura a partir de 14 px; nada abaixo de 12 px.

### 4. Acessibilidade (`DESIGN.md` §8)

- axe sem violações em todas as rotas, nos dois temas.
- Funil completo só com teclado: da landing ao clique no botão de inscrição da `/newsletter`.
- Foco nunca escondido pelo cabeçalho fixo, pelo banner ou pela faixa do botão do quiz
  (SC 2.4.11).
- `prefers-reduced-motion`: nenhuma animação.
- Zoom de 200% em 1280 px de largura: nada some, nada se sobrepõe.

### 5. Desempenho

Lighthouse do fluxo, nos dois temas: nenhuma categoria abaixo do limite atual do script; SEO ≥
95 em `/` e `/newsletter`. Comparar LCP e CLS da landing com a linha de base medida antes do
Épico 42 e registrar os dois valores.

### 6. Documentação

- `specs/epicos/00-indice.md`: Fase 6 marcada como concluída.
- `GOLIVE.md`: seção "Go-live da revisão de novembro de 2026", com o resultado de cada item
  deste épico e as pendências humanas.
- `README.md`: rotas (inclui `/newsletter`), eventos de analytics e o aviso do
  `MAILERLITE_API_KEY=e2e-invalid`.
- `docs/design-system.md`: componentes novos (`NextStepBand`, blocos da `/newsletter`, "como
  funciona", perguntas frequentes).
- No relatório final, listar o que o founder deve atualizar em `PROJECT_MAP.md`, na raiz (outro
  repositório git; o agente não edita).

## Conferência humana (o agente pede e espera a resposta)

1. Em produção, depois do deploy: funil completo até o clique no botão de inscrição, com o
   **Testar eventos** do Meta e o **DebugView** do GA4 abertos. Esperado: um `PageView` por
   tela, `Lead`, `report_viewed`, `next_step_click`, `cta_offer_click`.
2. No Substack, uma inscrição de teste vinda do botão: conferir que a origem aparece com
   `utm_source=skill-check`.
3. Um iPhone (Safari) e um Android (Chrome), nos dois temas: quiz inteiro, formulário,
   resultado, página final. Atenção ao teclado virtual sobre o formulário e à faixa do botão do
   quiz com a barra do navegador.
4. Leitor de tela (VoiceOver ou TalkBack) no quiz e no resultado.
5. Bio e foto de quem escreve entregues ou registradas como pendência.

## Gate

- [ ] Suíte completa verde.
- [ ] Matriz visual inspecionada, sem defeito aberto.
- [ ] Tabela de auditoria de marca no relatório, sem violação.
- [ ] axe limpo; funil navegável só com teclado.
- [ ] Lighthouse dentro dos limites; LCP e CLS registrados contra a linha de base.
- [ ] Documentação atualizada.
- [ ] Itens 1–4 da conferência humana confirmados pelo founder.
