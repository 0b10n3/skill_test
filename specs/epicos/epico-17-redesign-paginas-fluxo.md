# ÉPICO 17 — Redesign das Páginas do Fluxo: Landing, Quiz e Lead

**Depende de:** Épicos 15 e 16 concluídos. **Fontes de verdade:** `REDESIGN.md` §5, `DESIGN.md` §§3 e 5.3–5.4 (voz e matriz de uso de padrões).

## Objetivo

Recompor as três páginas do funil (`/`, `/quiz`, `/lead`) com a identidade Syntaxis — componentes do Épico 15, assets do Épico 16, voz do `DESIGN.md` §3 — sem alterar lógica de negócio, rotas ou contratos de dados.

## Escopo

- **Landing (`/`):**
  - Hero: título em DM Serif Display, promessa de suporte derivada do `DESIGN.md` §1.3 (nunca "aprenda finanças"); asset generativo do hero (variante por tema) com `<PatternNodeBranch/>` decorativo (25–40%) sem competir com o asset — respeitando "um padrão por peça" por seção; CTA primário Grove.
  - Seção "o que o diagnóstico avalia": as 5 dimensões com as ilustrações do lote do Épico 16; grade de dados apenas nas margens desta seção (15–20%).
  - Seção de método/credibilidade: números em Space Mono ("15 questões · 5 dimensões · por senioridade"), link para a página de metodologia.
  - Revisão integral do copy da página pela voz §3 (técnico e preciso, leve sem condescendência; nomes em português; sem promessa de salário/promoção).
- **Quiz (`/quiz`):**
  - Enunciado sobre superfície `card`, sem nenhum padrão atrás de texto; alternativas com o Radio restylizado (estados do Épico 15).
  - Progresso "N de 15" em Space Mono + barra Grove; transição entre questões ≤ 200ms, desativada sob `prefers-reduced-motion`.
  - Tela de senioridade (q00) com microcopy revisada na voz da marca.
- **Lead (`/lead`):**
  - Formulário sobre `card` com inputs/checkbox restylizados; opt-in com microcopy honesta na voz da marca (o que a pessoa vai receber, sem dark pattern); botão primário Grove; estado de erro com `destructive` dos tokens.
- Estados de carregamento, erro e vazio das três páginas usando os componentes/assets novos.
- Metadados OG/social das rotas atualizados com os assets do Épico 16.
- Sem mudanças de comportamento: mesmo fluxo, mesmos eventos/integrações (MailerLite intocado).

## Critérios de aceite

- Dado o fluxo Landing → Quiz → Lead executado nos dois temas, quando percorrido em 375/768/1440px, então cada seção respeita o single-viewport em 375px, nenhuma cor foge dos tokens e nenhum padrão viola a matriz de uso (um por peça; opacidades corretas).
- Dado o copy das três páginas, quando revisado contra o checklist do `DESIGN.md` §7, então todos os itens aplicáveis passam (verificação manual documentada no PR).
- Dado o quiz em uso, quando o participante lê um enunciado, então não há padrão geométrico nem imagem atrás do texto da questão.
- Dado `prefers-reduced-motion`, quando ativo, então as três páginas não executam animações não essenciais.
- Dado o mesmo build, quando os testes E2E funcionais rodam, então passam sem alteração de asserções de comportamento (apenas seletores/snapshots visuais atualizados).

## Testes obrigatórios

- E2E funcional completo do funil nos dois temas.
- Teste visual (screenshots por página × tema × 375/1440px) contra o baseline do Épico 15, diffs revisados.
- axe-core nas três rotas: zero violações críticas.
- Lighthouse nas três rotas em preview: Performance ≥ 90 com os novos assets (verificação antecipada do orçamento de peso).

## Gate — critério para avançar ao Épico 19

- [ ] Fluxo completo aprovado em revisão visual manual (mobile real + desktop, dois temas), documentada no PR.
- [ ] Zero violações críticas de acessibilidade nas três rotas.
- [ ] Lighthouse ≥ 90 em Performance nas três rotas em preview.
- [ ] Checklist de marca (`DESIGN.md` §7) verde para todo o copy novo.
- [ ] Nenhuma regressão funcional na suíte E2E.

## Boas práticas aplicadas

Redesign com contrato de comportamento congelado: a PR de visual não mistura mudança de lógica, o que mantém o diff revisável e permite reverter a pele sem tocar o funil; voz e visual são revisados pelo mesmo checklist, porque na Syntaxis o copy é parte do design, não enfeite posterior.
