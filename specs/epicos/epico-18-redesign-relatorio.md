# ÉPICO 18 — Redesign do Relatório de Resultados (`/resultado`)

**Depende de:** Épico 12 (estrutura e conteúdo do relatório implementados) e Épicos 15–16 concluídos. **Fontes de verdade:** `REPORT.md` (estrutura S1–S8 — permanece válida), `REDESIGN.md` §5 (precedência visual), `DESIGN.md` §§3, 5 e 6.

## Objetivo

Aplicar a identidade Syntaxis à peça mais importante do produto: o relatório. A estrutura S1–S8 e o motor de diagnóstico não mudam; muda a pele — radar, selos, cards, tipografia de métricas, o card compartilhável tratado como mini-certificado e a revisão da matriz editorial pela voz da marca.

## Escopo

- **S1 (cabeçalho):** logo por tema; título em DM Serif Display; selo de classificação com a regra de Amber: `ALTO` usa Amber (conquista real, com `shadow.amber`); `MÉDIO` e `BAIXO` usam a escala Forest/neutros — nunca Amber, nunca vermelho de reprovação (o `destructive` fica restrito a erros de sistema, não a resultado de pessoa).
- **S2 (radar):** série "Seu perfil" em Grove (área preenchida, opacidade que preserve leitura das gridlines) sobre "Expectativa do nível" tracejada em Slate; gridlines Mist; rótulos das dimensões em DM Sans, percentuais em Space Mono; dark theme com os mapeamentos semânticos (sem cor recalculada à mão); mantidas as exigências do Épico 12 (série distinguível por traço, tabela acessível, animação única respeitando `prefers-reduced-motion`).
- **S3 (score cards):** valores "N/3" em Space Mono (`dataXl` para o número); etiquetas `forte`/`neutro`/`atencao` mapeadas a tokens (forte → Grove; atenção → Amber-700 como texto de alerta construtivo, nunca `destructive`); ícones das dimensões substituídos pelas ilustrações do Épico 16 em tamanho reduzido.
- **S5 (skills de maior impacto):** `<PatternGrowthLine/>` como elemento protagonista da seção — os degraus ascendentes conectando "onde você está" → "próximo nível"; cards #1/#2 com destaque Amber apenas no marcador de prioridade; mini-gráfico de prioridades com barras Grove e valor em Space Mono.
- **S6 (gabarito):** accordion restylizado; termos técnicos, fórmulas e trechos de código nas explicações em Space Mono; correta/incorreta sinalizadas por ícone + cor semântica com contraste AA nos dois temas (nunca só cor).
- **S7 (CTA + card compartilhável):** o card social vira **mini-certificado** conforme `DESIGN.md` §6 — moldura nó-e-galho + linha de conquista protagonistas (100%), radar, classificação e logo sobre a textura de fundo aprovada no Épico 16; sem dados pessoais; gerado nos dois temas.
- **S8 + impressão:** rodapé de método restylizado; `@media print` revisto para a nova identidade (2 páginas A4, fundo claro forçado, padrões em tinta economizável, CTAs suprimidos).
- **Matriz editorial:** revisão dos ~85 blocos do Épico 12 pela voz do `DESIGN.md` §3 e pela linha vermelha da §1.3 — nenhum bloco promete promoção/salário; a promessa é sempre skill verificável no trabalho. Ajustes entram como PR na matriz (conteúdo separado de código, como estabelecido).

## Critérios de aceite

- Dado um diagnóstico `MÉDIO` ou `BAIXO`, quando o relatório renderiza, então nenhum elemento usa Amber nem `destructive` para qualificar o resultado da pessoa.
- Dado um diagnóstico `ALTO`, quando o selo renderiza, então usa Amber com `shadow.amber` (única aparição de Amber "de conquista" fora da S5).
- Dado o card compartilhável gerado, quando inspecionado, então contém moldura nó-e-galho + linha de conquista, radar, classificação e logo — e nenhum dado de contato; a linha de conquista aparece em degraus retos (nunca curva, nunca candlestick).
- Dado qualquer métrica numérica do relatório (scores, percentuais, "N de 15"), quando renderizada, então usa Space Mono.
- Dado o relatório impresso, quando gerado, então cabe em 2 páginas A4 com radar legível e sem CTAs.
- Dado o conjunto da página, quando auditado, então cada seção usa no máximo um padrão geométrico e nenhum padrão aparece atrás de texto corrido acima de 12% de opacidade.

## Testes obrigatórios

- Testes de componente atualizados (S1–S8) incluindo as regras de Amber/destructive e Space Mono em métricas.
- E2E das 3 personas do Épico 12 (aspirante/baixo, pleno/médio, sênior/alto) nos dois temas, com screenshots revisados.
- Teste do gerador do card compartilhável (dois temas; ausência de PII verificada por asserção sobre o conteúdo renderizado).
- axe-core em `/resultado` nos dois temas: zero violações críticas.
- Snapshot do print stylesheet.
- Revisão da matriz editorial documentada no PR contra o checklist `DESIGN.md` §7.

## Gate — critério para avançar ao Épico 19

- [ ] E2E das 3 personas verdes nos dois temas, screenshots aprovados.
- [ ] Regras de cor de resultado (Amber/ausência de vermelho) cobertas por teste.
- [ ] Card compartilhável aprovado no checklist de marca e sem PII.
- [ ] Matriz editorial 100% revisada pela voz da marca.
- [ ] Zero violações críticas de acessibilidade; nenhuma regressão funcional.

## Boas práticas aplicadas

O relatório trata o resultado da pessoa com a semântica de cor da marca, não com a de semáforo: vermelho é para erro de sistema, Amber é para conquista, e um diagnóstico baixo é mapa de desenvolvimento — a paleta reforça a postura pedagógica do produto em vez de contradizê-la.
