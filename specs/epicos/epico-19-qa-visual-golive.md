# ÉPICO 19 — QA Visual, Acessibilidade, Performance e Go-Live do Redesign

**Depende de:** Épicos 17 e 18 concluídos.

## Objetivo

Validar o redesign de ponta a ponta com o mesmo rigor dos Épicos 9 e 13 — agora em dois temas — e concluir o go-live da nova identidade, incluindo a incorporação da documentação de design ao repositório e a limpeza dos arquivos de spec da raiz.

## Escopo

- **Auditoria completa nas 4 rotas públicas × 2 temas:** Lighthouse (Performance/Acessibilidade/Boas práticas/SEO), axe-core, navegação por teclado, leitor de tela em `/quiz` e `/resultado` (as rotas de maior interação), cross-device 375/768/1440px + 1 mobile real.
- **Auditoria de marca:** varredura final contra os invariantes do `REDESIGN.md` §2 — lint de cor hardcoded, um padrão por peça, opacidades, Amber restrito a conquista, Space Mono em métricas, checklist `DESIGN.md` §7 sobre todo copy — com evidências no PR.
- **Performance dos assets:** verificação do orçamento de peso por página (manifest do Épico 16) em conexão limitada (throttling 4G) — LCP do hero da landing dentro da meta do Lighthouse ≥ 90.
- **Regressão total:** suíte completa de TODOS os épicos (1–18) verde em CI contra preview — inclusive os gates funcionais da v2 (banco de questões, diagnóstico, MailerLite), que não podem ter regredido com a troca de pele.
- **Documentação viva:** criar/atualizar `docs/design-system.md` com o que é referência permanente: como regenerar tokens, como usar os padrões e suas travas, como rodar o pipeline agy de assets (prompts → revisão → publicação), mapa de uso dos logos e a pendência do SVG master (se ainda aberta). `GOLIVE.md` atualizado com os passos visuais.
- **Limpeza final:** após gates verdes e deploy em produção, remover da raiz `REDESIGN.md` e os arquivos `epico-14` a `epico-19` — somente depois de `docs/design-system.md` incorporar o conteúdo permanente. (`DESIGN.md` e `tokens.json` NÃO são removidos: são SSOT vivos da marca, não specs temporárias.)

## Critérios de aceite

- Dado o app em produção, quando rodo Lighthouse em qualquer rota pública, em qualquer tema, então as 4 categorias ficam ≥ 90.
- Dado o fluxo completo executado manualmente em mobile real nos dois temas, quando concluído, então nenhuma tela quebra o single-viewport, o tema persiste entre rotas e o relatório correto é exibido.
- Dado o lint de marca em CI, quando o pipeline roda, então zero cores hardcoded e zero assets fora do manifest.
- Dado o commit de limpeza, quando inspeciono o repositório, então os arquivos de spec do redesign saíram da raiz, `docs/design-system.md` existe e `DESIGN.md`/`tokens.json` permanecem como SSOT.

## Testes obrigatórios

- Suíte completa (unit + componente + visual + E2E) de todos os épicos, verde em CI contra preview.
- Lighthouse documentado para as 4 rotas × 2 temas.
- axe-core sem violações críticas nas 4 rotas × 2 temas.
- Execução manual documentada: teclado + leitor de tela em `/quiz` e `/resultado`.

## Gate — critério de Go-Live do redesign

- [ ] Todos os gates dos Épicos 1–18 seguem válidos (sem regressão).
- [ ] Lighthouse ≥ 90 nas 4 categorias, nas 4 rotas, nos 2 temas.
- [ ] Zero violações críticas de acessibilidade nas 4 rotas × 2 temas.
- [ ] Fluxo completo validado manualmente em mobile real nos 2 temas.
- [ ] Auditoria de marca verde (lint + checklist §7) com evidências no PR.
- [ ] `docs/design-system.md` criado; specs do redesign removidas da raiz no último commit.

## Boas práticas aplicadas

O go-live de identidade é tratado com o mesmo padrão de gate dos go-lives funcionais: nenhum gate anterior é aceito "porque já passou uma vez" — a suíte inteira roda de novo; e a distinção entre spec temporária (épicos, REDESIGN.md — saem da raiz) e SSOT vivo (DESIGN.md, tokens.json — ficam) é explícita, para que a limpeza nunca apague a fonte da verdade junto com o andaime.
