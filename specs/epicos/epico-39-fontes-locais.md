# ÉPICO 39 — Fontes servidas do repo (build sem Google Fonts)

**Depende de:** Épico 38.

**Origem:** o deploy de produção do Épico 38 (`dpl_8yxWJKXV9rKUB5gtBJZNYivd8711`) falhou no build:
`next/font/google` não conseguiu buscar as fontes (Turbopack: `next/font/google queries have exactly
one entry`). A mesma falha derrubou o job de lighthouse do CI no PR #50, minutos antes. O código
não tinha erro: build limpo, preview e CI na segunda tentativa passaram.

## Mudanças

| Arquivo | Mudança |
| --- | --- |
| `public/fonts/*.woff2` | os mesmos arquivos (subconjunto latin) que `next/font/google` baixava, copiados do build do `main` |
| `app/globals.css` | `@font-face` com os nomes reais de família ("Montserrat", "Source Sans 3", "IBM Plex Mono"), as mesmas faces fixas e o mesmo `unicode-range`; variáveis `--font-*` em `:root` |
| `app/layout.tsx` | sem `next/font/google`; `preload` dos quatro `woff2` |
| `public/fonts/*.ttf`, `app/opengraph-image.tsx` | o card OG lê TTF do disco em vez de buscar no Google |
| `components/landing/FinalCtaSection.tsx` | `font-extrabold` → `font-bold`: só existe a face 700, e era o que já renderizava |

**Por que não `next/font/local`:** ele renomeia a família (`montserrat`, `ibmPlexMono`). As classes
de `typography.scale` (`.text-data-xl` etc.) e o Canvas do card de resultado usam o nome literal e
caíam no fallback — 6 snapshots do resultado quebraram na primeira tentativa. **Por que não o arquivo
que o Google serve ao navegador:** é outro (eixo de peso inteiro), o texto sai ~3% mais estreito e
muda quebras de linha. Detalhes em `public/fonts/README.md`.

## Critérios de aceite

- Nenhuma referência a `next/font/google`, `fonts.googleapis.com` ou `fonts.gstatic.com` no código.
- E2E completo verde **sem atualizar snapshot** (a renderização não muda).
- `/opengraph-image` idêntico byte a byte ao gerado buscando do Google.
- `prebuild`, vitest, lint, typecheck, `format:check` e build verdes.
