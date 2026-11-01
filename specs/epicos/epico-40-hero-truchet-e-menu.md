# ÉPICO 40 — Hero no formato do CTA (Truchet) e menu C1

**Depende de:** Épico 39.

**Origem:** pedido do founder (01/11/2026): o hero passa a usar o mesmo formato e o mesmo padrão do
CTA final, e o app adota o menu (C1) aprovado no laboratório (`brand/APLICACAO.md` §1.2).

## Mudanças

| Arquivo | Mudança |
| --- | --- |
| `components/landing/HeroSection.tsx` | texto à esquerda e mosaico Truchet à direita (formato H11/C14); saem a foto e o gradiente de ambiente. Abaixo de `sm` o mosaico some (o hero cabe em 375×667, teste `landing-page.spec`); entre `sm` e `lg`, faixa de 2 linhas depois do texto |
| `components/patterns/PatternTruchet.tsx` | prop `tom`: `"escuro"` (CTA final, fixo) ou `"tema"` (hero — `forest.500` sobre Chalk no claro, `grove.500` sobre Deep Forest no escuro, `DESIGN.md` §6.6). Semente própria no hero, para não repetir o desenho do CTA |
| `components/site-header.tsx` | menu C1: marca, links "O que avaliamos" e "Metodologia" (âncoras da landing, `scroll-mt-14`) e CTA "Iniciar avaliação"; altura fixa de 56 px (`h-14`). No funil (`/quiz`, `/lead`, `/resultado`) o menu some — o CTA levaria a recomeçar |
| `components/generated-image.tsx` | removido: sem uso depois que a foto saiu do hero. Os arquivos de `hero-landing-pessoas` continuam no manifest |
| `e2e/a11y-all-routes.spec.ts` | quatro Tabs até o primeiro "Iniciar avaliação" (logo, dois links, CTA do menu) |

## Critérios de aceite

- E2E completo verde; snapshots da landing (768 e 1440, claro e escuro) atualizados depois de
  inspecionados; os do funil não mudam.
- Hero em 375×667 sem rolagem; header com a mesma altura em todas as páginas.
- `prebuild`, vitest, lint, typecheck, `format:check` e build verdes.
