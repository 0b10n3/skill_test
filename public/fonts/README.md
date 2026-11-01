# Fontes da marca, servidas do próprio repo (Épico 39)

O build deixou de baixar fontes do Google: `next/font/google` falhava de forma intermitente
(Turbopack: `next/font/google queries have exactly one entry`) e derrubou um deploy de produção.

| Arquivo                                                                                      | Uso                                                                   |
| -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `montserrat-latin.woff2`, `source-sans-3-latin.woff2`, `ibm-plex-mono-{400,700}-latin.woff2` | site — `@font-face` em `app/globals.css`, preload em `app/layout.tsx` |
| `montserrat-700.ttf`, `source-sans-3-400.ttf`                                                | `app/opengraph-image.tsx` (o Satori não lê woff2)                     |

Os `woff2` são **os mesmos arquivos** que `next/font/google` baixava até o Épico 38 (subconjunto
latin), copiados do build, com os mesmos nomes de família e as mesmas faces fixas: a renderização
em produção não muda. Não use `next/font/local`: ele renomeia a família (`montserrat`,
`ibmPlexMono`), e as classes de `typography.scale` e o Canvas do card de resultado usam o nome
literal ("IBM Plex Mono"). O arquivo que o Google serve hoje a um navegador também é outro (eixo de
peso inteiro, texto ~3% mais estreito): trocá-lo muda quebras de linha e os snapshots visuais.

Licença: SIL Open Font License 1.1 (`OFL-*.txt`).
