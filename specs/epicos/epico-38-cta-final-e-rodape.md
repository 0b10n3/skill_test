# ÉPICO 38 — CTA final, rodapé e padrão Truchet (marca v4.1)

**Depende de:** Épico 37 (marca v4.1 sincronizada).

**Origem:** pedido do founder (01/11/2026): levar ao app os componentes aprovados no laboratório
da rodada 5 (`brand/APLICACAO.md` §1.1–1.2) que o app precisa.

## O que entrou

| Componente | Origem no laboratório | Onde | Por quê |
| --- | --- | --- | --- |
| `PatternTruchet` + `lib/truchet-layout.ts` | mosaico Truchet (`DESIGN.md` §6.6) | `components/patterns` | o CTA final usa; geometria pura e testada (determinística, no máximo 1 célula rara em 12) |
| `FinalCtaSection` | C14 · CTA final | landing, depois da banda da metodologia | a landing terminava sem CTA: quem rolava até o fim tinha de voltar ao hero |
| `SiteFooter` | C15 · Rodapé | landing e `/privacidade` | o app não tinha rodapé; só os links que existem (Skill Check, Privacidade). Fora do funil: quiz, lead e resultado cabem numa tela |

`PatternTruchet` entrou na lista do `lint:patterns` (nunca junto de mesh ou retícula no mesmo
arquivo). O CTA final repete "Iniciar avaliação": os e2e que clicam nele passam a usar `.first()`
(o do hero).

## O que ficou de fora, e por quê

| Padrão | Motivo |
| --- | --- |
| H2–H5, H10, H12–H16, C1–C13 | servem páginas que o app não tem (curso, evento, newsletter, institucional, venda) — entram com a página que os usar |
| H11 (captura) | é para isca; o `/lead` é um passo do funil, não uma página de captura |
| G1–G4 (grafo) | o hero da landing segue H1 (foto em caixa, "o atual" na tabela); sem lugar no app hoje |
| Estado de conquista com colagem | pede arte gerada para o resultado (Portinari), que não existe |

## Critérios de aceite

- `npm run prebuild`, `npm test`, lint, typecheck, `format:check` e build verdes.
- E2E completo: só os 6 snapshots da landing mudam, e só na região nova (diffs inspecionados).
- Renderizado em 1440 claro/escuro e 390: no celular o Truchet fica depois do texto, para não
  colar na banda Deep Forest da metodologia.
