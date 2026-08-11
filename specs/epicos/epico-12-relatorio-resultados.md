# ÉPICO 12 — Relatório de Resultados (Radar, Diagnóstico e CTA)

**Depende de:** Épico 11 concluído. **Fonte de verdade:** `REPORT.md` (estrutura S1–S8, princípios visuais e matriz editorial) e `AVALIACAO.md` §5/§7.

## Objetivo

Reconstruir a página `/resultado` como o relatório de diagnóstico especificado em `REPORT.md`: radar de 5 eixos com linha de expectativa, score cards, pontos fortes/atenção, skills de maior impacto para promoção, gabarito comentado e CTA personalizado — tudo dentro do design system "O Sinal no Escuro".

## Escopo

- Implementar as seções S1–S8 do `REPORT.md`, nesta ordem, consumindo exclusivamente o objeto retornado pelo motor de diagnóstico (Épico 11).
- **Radar (S2):** 5 eixos com rótulos humanizados; série "Seu perfil" (área preenchida, cor primária dos tokens) sobreposta à série "Expectativa do nível" (linha tracejada neutra, default 67% por eixo, configurável); alternativa textual acessível (tabela dimensão × score × expectativa); distinção das séries por traço, não apenas cor; animação única de entrada respeitando `prefers-reduced-motion`.
- **Matriz editorial:** criar arquivo de conteúdo estático (ex.: `content/relatorio.ts|json`) com os ~85 blocos definidos em `REPORT.md` §4 (microcopies de score card, "por que importa", "primeiros passos", copies de CTA, frases-resumo). Nenhum texto do relatório é gerado em runtime; a UI apenas seleciona blocos pela chave dimensão × nível × faixa. Os textos devem ser escritos neste épico seguindo o guia de tom da marca.
- **S4 — tópicos para revisar:** renderizar `topicosParaRevisar` como temas, nunca como número de questão.
- **S6 — gabarito:** accordion fechado por padrão, agrupado por dimensão, erradas primeiro, com `explanation` integral.
- **S7 — CTA:** matriz nível × classificação já existente no app conectada à dimensão #1 de `prioridades`; botão secundário de reenvio do relatório por e-mail (MailerLite); botão "Compartilhar meu radar" gerando imagem social (radar + classificação + logo, sem dados pessoais) — via rota de OG image ou render client-side para download.
- **S8 — rodapé de método:** limitações do `AVALIACAO.md` §7 em linguagem acessível + link para página/modal "Como funciona a metodologia".
- CSS `@media print`: relatório em até 2 páginas A4, radar renderizado, gabarito expandido, CTAs suprimidos.
- Single-viewport por seção em 375px, conforme padrão do design system.

## Critérios de aceite

- Dado um diagnóstico de qualquer nível × classificação, quando `/resultado` renderiza, então todas as seções S1–S8 aparecem na ordem especificada, sem seção vazia, inclusive nos extremos 0/15 e 15/15.
- Dado o radar renderizado, quando o score de uma dimensão fica abaixo da expectativa, então o gap é visualmente identificável pela sobreposição das duas séries, e a tabela acessível reflete os mesmos valores.
- Dado um participante pleno com prioridade #1 = `dados-programacao`, quando o CTA renderiza, então a copy referencia a trilha dessa dimensão para o nível pleno (bloco correto da matriz editorial).
- Dado o botão de compartilhamento, quando acionado, então a imagem gerada contém radar, classificação e logo — e nenhum dado de contato do lead.
- Dado `prefers-reduced-motion`, quando a página carrega, então nenhuma animação do radar é executada.

## Testes obrigatórios

- Testes de componente para: radar (props → séries corretas), score cards (faixa → etiqueta e microcopy corretas), seleção de blocos editoriais (chave dimensão × nível × faixa → bloco correto, para todas as 15+25+25+15 combinações via teste tabelado).
- E2E do fluxo completo para pelo menos 3 personas: aspirante/baixo, pleno/médio, sênior/alto — verificando seções, CTA correto e ausência de texto placeholder.
- Teste E2E de acessibilidade (axe-core) na rota `/resultado` sem violações críticas.
- Snapshot/teste visual do print stylesheet (2 páginas, sem CTA).

## Gate — critério para avançar ao Épico 13

- [ ] E2E das 3 personas verdes em preview.
- [ ] Zero violações críticas de axe-core em `/resultado`.
- [ ] Matriz editorial 100% preenchida (nenhuma chave caindo em fallback/placeholder — teste automatizado disso).
- [ ] Revisão visual manual contra os tokens da marca em mobile real (375px) e desktop, documentada no PR.
- [ ] Nenhuma regressão nos gates dos Épicos 1–11.

## Boas práticas aplicadas

Conteúdo editorial separado de código (arquivo único revisável, pronto para A/B de copy); relatório renderiza a partir de um único objeto de diagnóstico (nenhum recálculo na camada de UI); acessibilidade e impressão tratadas como requisitos de primeira classe, não como polimento posterior.
