# ÉPICO 37 — Sincronização com a marca v4.1 (tokens 3.1.0)

**Depende de:** `brand` PR #2 (rodada 5 da marca, DESIGN.md v4.1, tokens v3.1.0), já em `main`.

**Origem:** plano de propagação da rodada 5 (`brand/revisao-2026-r5/04-propagacao.md` §2),
aprovado pelo founder no CHECKPOINT 4. Sem este épico, o `prebuild` local quebra em
`check:brand-sync` e, depois da cópia, em `generate:tokens` (risco R1 do plano).

## Mudanças

| Arquivo | Mudança | Por quê |
| --- | --- | --- |
| `DESIGN.md`, `design/tokens.json` | cópia byte a byte de `brand/` (v4.1, tokens v3.1.0) | gate `check-brand-sync` |
| `scripts/lib/generate-tokens.mjs` | deixa de gerar `--shadow-*` | o grupo `shadow` saiu nos tokens v3.0.0; o gerador quebrava com `TypeError` |
| `app/globals.css` | remove `--shadow-syntaxis*` e `--shadow-lime` do `@theme` | tokens removidos |
| `components/analytics/ConsentBanner.tsx` | tira `shadow-syntaxis` (a borda já faz o trabalho) | sombra viva em produção, contra a regra |
| `components/result/ReportHeader.tsx` | tira `shadow-lime` do selo ALTO | idem; o Lime da variante continua |
| `scripts/check-tokens-breaking.mjs`, `design/archive/tokens-v2.7.0.json` | baseline rebaseado para v2.7.0; allowlist = remoções do changelog 3.0.0 | a regra do próprio gate para uma MAIOR |
| `components/patterns/PatternReticula.tsx` | cor por tema: `colorLight` (slate) no claro, `colorOnDark` (mist) no escuro | `pattern.reticula.fine.color` está depreciado; mist sobre Chalk era invisível (1,02:1) |
| `scripts/process-asset.mjs`, `scripts/lib/process-asset-core.mjs`, `scripts/verify-asset-palette.mjs` | `--cor natural`: publica sem duotone; o manifest marca `cor: "natural"` e a verificação de paleta pula o asset | DESIGN.md v4.1 §5.1 regra 4: fotografia em cor natural, nunca duotone |
| `public/img/hero-landing-pessoas/`, `assets/manifest.json`, `assets/prompts/hero-landing-pessoas.md` | derivados regerados do raw v3 em cor natural, um arquivo para os dois temas, 640/1024 (a caixa tem 28rem) | idem |
| `components/landing/HeroSection.tsx` | `GeneratedPicture` sem variante, no lugar de `ThemedGeneratedImage` | idem |

## Fora de escopo

Portar os heros, grafos e componentes de landing aprovados (`brand/APLICACAO.md` §1.1–1.2) para o
app: a escolha de qual padrão vai em cada página é decisão de produto, épico próprio.

## Critérios de aceite

- `npm run prebuild` verde (inclui `check:tokens-breaking`, `check:brand-sync`, `assets:verify-*`).
- `npm test`, lint e typecheck verdes.
- Nenhuma classe ou variável `shadow` em `app/` e `components/`.
