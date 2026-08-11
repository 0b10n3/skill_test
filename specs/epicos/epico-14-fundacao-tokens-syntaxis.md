# ÉPICO 14 — Fundação: Tokens Syntaxis, Tipografia, Temas e Logos

**Depende de:** Épico 13 concluído (ou Épico 9, se a v2 funcional ainda não tiver iniciado — neste caso, replanejar a ordem com o founder antes de começar). **Fontes de verdade:** `tokens.json` v1.1.0, `DESIGN.md` §4, `REDESIGN.md` §§2–3.

## Objetivo

Substituir a camada visual anterior pela fundação do sistema Syntaxis: tokens v1.1.0 como única origem de estilo no código, tipografia da marca carregada corretamente, temas light/dark funcionais e logos integrados — sem redesenhar nenhuma página ainda (as telas podem ficar temporariamente "estranhas"; a fidelidade página a página vem nos Épicos 17–18).

## Escopo

- Copiar `tokens.json` v1.1.0 para o local canônico do projeto (ex.: `design/tokens.json`) e criar o passo de build que o transforma em CSS custom properties (`:root` light + `.dark`/`[data-theme=dark]`) e na configuração do Tailwind — geração automatizada (script versionado), não transcrição manual. A camada semântica (`color.theme.light|dark`) vira as variáveis `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--destructive`, `--border`, `--input`, `--ring` etc.; primitivos ficam disponíveis mas seu uso direto em componentes é proibido por lint (regra de CI que falha em cor hex/rgb hardcoded fora dos arquivos gerados).
- Tokens não-cor: espaçamento (grid 8px), radius (6/8/10), sombras (`syntaxisSm|syntaxis|syntaxisLg|amber`) e escala tipográfica (`typography.scale.*`) mapeados para utilitários/classes do projeto.
- Tipografia: carregar DM Serif Display, DM Sans e Space Mono via `next/font` (self-hosted, com fallbacks Georgia/system-ui/Courier New conforme tokens), expostas como `--font-display`, `--font-body`, `--font-data`. Aplicar globalmente: display nos headings editoriais, body como padrão, `--font-data` numa classe utilitária `.metric` usada em todo número-métrica.
- Temas: alternância light/dark respeitando `prefers-color-scheme` com toggle persistido; dark implementa as inversões intencionais dos tokens (primary=Grove, secondary=Mint com foreground Forest, fundo `#00120A`, superfícies calculadas `#0A1F15`/`#15281F`/borda `#25372F`).
- Logos: criar `public/brand/` com os PNGs renomeados (`logo-forest-*`, `logo-grove-*` conforme `REDESIGN.md` §3.1); componente `<Logo/>` que resolve a variante pelo tema; favicon e ícones de app atualizados; metadados OG apontando para asset provisório da marca. Abrir a pendência do SVG master (vetorizar ou obter original) como tarefa rastreada — bloqueia apenas usos acima de 96px.
- Aposentar a camada visual anterior: tokens antigos movidos para `design/archive/` com nota de substituição no README.

## Critérios de aceite

- Dado o build do projeto, quando os tokens são regenerados a partir do `tokens.json`, então nenhum arquivo gerado é editado à mão e o diff é determinístico (rodar duas vezes → zero diff).
- Dado qualquer componente do app, quando inspecionado, então toda cor computada resolve para uma variável derivada dos tokens (lint de cor hardcoded verde em CI).
- Dado o toggle de tema, quando alternado, então `--primary` muda de Forest-500 (light) para Grove-500 (dark) e o logo troca de variante — sem flash de tema incorreto no primeiro paint.
- Dado um número-métrica (ex.: progresso do quiz), quando renderizado, então usa Space Mono via `--font-data`.
- Dado `prefers-color-scheme: dark` sem preferência salva, quando o app carrega, então abre no tema escuro.

## Testes obrigatórios

- Teste do script de geração de tokens (entrada v1.1.0 → saída esperada, incluindo resolução de aliases `{color.forest.500}`).
- Lint de cores hardcoded integrado ao CI, bloqueante.
- Testes E2E de fumaça do fluxo completo nos dois temas (nada quebra funcionalmente com a nova fundação).
- Auditoria automatizada de contraste (script sobre os pares texto/fundo da camada semântica nos dois temas) com relatório versionado — falhas conhecidas documentadas com o token substituto (ex.: Amber-700 para texto pequeno).

## Gate — critério para avançar aos Épicos 15/16

- [ ] Pipeline tokens→CSS/Tailwind gerado, determinístico e documentado no README.
- [ ] Lint de cor hardcoded verde; zero exceções não justificadas.
- [ ] Dois temas funcionais sem flash e com logos corretos por tema.
- [ ] Relatório de contraste sem par AA reprovado em uso real.
- [ ] Suíte E2E existente verde nos dois temas.

## Boas práticas aplicadas

Tokens como código gerado a partir de um SSOT versionado: qualquer evolução futura da marca (v1.2.0) entra por PR no `tokens.json` e se propaga por rebuild — nunca por caça manual a valores espalhados; o sistema anterior é arquivado, não apagado, preservando a arqueologia das decisões.
