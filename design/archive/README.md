# Sistemas visuais aposentados

Camadas visuais substituídas ficam aqui, nunca são apagadas — preserva a
arqueologia das decisões de marca.

| Arquivo                          | Substituído em | Motivo                                                                                                                                                                                                                                                                                                                           |
| -------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens-v1-sinal-no-escuro.json` | Épico 14       | Sistema "O Sinal no Escuro" (dark-first, paleta Volt green, tipografia Space Grotesk/Inter/JetBrains Mono). Substituído pelo sistema de marca Syntaxis (`design/tokens.json`, paleta Forest/Grove/Amber, temas light/dark de primeira classe), conforme `specs/epicos/epico-14-fundacao-tokens-syntaxis.md`.                     |
| `tokens-v1.2.0.json`             | Épico 22       | Snapshot da v1.2.0 real deste repositório (paleta Forest/Grove/Amber, cantos arredondados, DM Serif Display/DM Sans) — baseline usado por `scripts/check-tokens-breaking.mjs` para provar que o bump MAIOR para v2.0.0 (Amber→Lime, cantos retos, Space Grotesk/Hanken Grotesk) só alterou exatamente o que o changelog declara. |

O catálogo `/dev/design-system` (Épico 2) também foi removido no Épico 14 —
era inteiramente sobre o sistema aposentado acima (paleta e classes
utilitárias que deixaram de existir). O catálogo novo (`/dev/ui`, já sobre
o sistema Syntaxis) é entregue no Épico 15.
