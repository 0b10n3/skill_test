# ÉPICO 15 — Padrões Geométricos e Restyle da Biblioteca de Componentes

**Depende de:** Épico 14 concluído. **Fontes de verdade:** `DESIGN.md` §5 (sistema de padrões, matriz de uso, regras), `tokens.json` `pattern.*`, `REDESIGN.md` §2.

## Objetivo

Implementar as três famílias de padrão geométrico como componentes paramétricos e aplicar a nova identidade a toda a biblioteca de componentes do app — de modo que os Épicos 17–18 componham páginas apenas com peças já aderentes à marca.

## Escopo

- **Padrões como componentes SVG/CSS paramétricos** (`components/patterns/`), consumindo exclusivamente os tokens `pattern.*`:
  - `<PatternNodeBranch/>` — nós r=2.5px conectados por traços 0.75px em estrutura ramificada (árvore sintática/AST), tom único Grove (sobre claro) ou conforme tema; props: densidade, âncora (canto/campo), opacidade limitada por contexto — `onText` trava em ≤ 0.12, `decorative` em 0.25–0.40, conforme tokens.
  - `<PatternDataGrid/>` — dot-grid 14px, pontos r=1px em Mist, opacidade 0.15–0.20; nunca atrás de texto denso (a API do componente só oferece slots de margem/cabeçalho).
  - `<PatternGrowthLine/>` — polilinha em degraus ascendentes, traço 2px Amber, opacidade 1.0; **sempre protagonista, nunca fundo** (sem prop de opacidade); proibido qualquer easing que a curve — degraus retos por construção. Nunca candlestick.
  - Regra "um padrão por peça" verificada por teste de composição (as páginas dos Épicos 17–18 herdam a garantia).
- **Restyle dos componentes base** (mapear o inventário real do app; mínimo esperado): Button (primário Grove, secundário outline Forest, destructive), Card (superfície `card` + `shadow.syntaxis`), Input/Select/Checkbox (border/ring dos tokens), Progress (barra Grove, trilha Mist, valor em Space Mono), Badge/Selo (variantes de classificação — Amber reservado ao caso de conquista), Accordion, Radio de alternativas do quiz (estados: default, hover, selecionada, correta/incorreta no gabarito), Tabs/âncoras de seção, Toast/feedback.
- Estados completos por componente: hover, focus-visible (ring dos tokens), active, disabled, loading — nos dois temas.
- Catálogo vivo: rota interna `/dev/ui` (ou Storybook, se já for padrão do projeto) exibindo todos os componentes e padrões em light e dark, usada como base do teste visual.
- Documentar no catálogo a matriz de uso dos padrões (`DESIGN.md` §5.3) como referência de composição para os próximos épicos.

## Critérios de aceite

- Dado qualquer padrão renderizado, quando inspecionado, então raio de nó, traço, espaçamento e cores batem exatamente com os tokens `pattern.*` (teste de snapshot do SVG gerado).
- Dado `<PatternNodeBranch context="onText"/>`, quando renderizado, então a opacidade computada nunca excede 0.12, mesmo que um consumidor passe valor maior.
- Dado o catálogo `/dev/ui`, quando percorrido nos dois temas, então todos os componentes exibem todos os estados sem cor fora dos tokens e com focus-visible perceptível.
- Dado o componente Badge de classificação, quando a classificação não é ALTO, então nenhum uso de Amber aparece (regra de conquista real).
- Dado `prefers-reduced-motion`, quando ativo, então nenhum componente executa animação não essencial.

## Testes obrigatórios

- Snapshots dos SVGs dos três padrões (parâmetros → geometria).
- Testes de componente dos estados (inclusive trava de opacidade e restrição de Amber).
- Teste visual (screenshots do catálogo em light/dark, 375px e 1440px) com diffs revisados em PR.
- axe-core no catálogo: zero violações críticas.

## Gate — critério para avançar ao Épico 17

- [ ] Três padrões implementados, com travas de uso funcionando e snapshots verdes.
- [ ] 100% do inventário de componentes do app restylizado e presente no catálogo, nos dois temas.
- [ ] Teste visual de referência aprovado e versionado (baseline do redesign).
- [ ] Zero violações críticas de acessibilidade no catálogo.
- [ ] Nenhuma regressão funcional na suíte E2E.

## Boas práticas aplicadas

As regras de marca viram restrições de API, não convenções de disciplina: a opacidade máxima atrás de texto, o Amber exclusivo de conquista e o "um padrão por peça" são impossíveis de violar por descuido, porque o próprio componente os impõe — o guia de estilo deixa de depender de memória humana.
