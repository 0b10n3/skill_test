# Relatório de contraste — design/tokens.json

> Gerado por `npm run audit:contrast` (Épico 14). Não editar à mão —
> regenerar após qualquer mudança em `design/tokens.json`.

## Tema light

| Par | Fundo | Texto | Contraste | AA texto normal (4.5:1) | AA texto grande/UI (3:1) |
| --- | --- | --- | --- | --- | --- |
| `background/foreground` | `#F7F7F5` | `#141414` | 17.17:1 | ✅ | ✅ |
| `card/cardForeground` | `#FFFFFF` | `#141414` | 18.42:1 | ✅ | ✅ |
| `popover/popoverForeground` | `#FFFFFF` | `#141414` | 18.42:1 | ✅ | ✅ |
| `primary/primaryForeground` | `#1B6A45` | `#F7F7F5` | 6.13:1 | ✅ | ✅ |
| `secondary/secondaryForeground` | `#1E7A4F` | `#F7F7F5` | 4.95:1 | ✅ | ✅ |
| `accent/accentForeground` | `#C9832A` | `#F7F7F5` | 2.89:1 | ❌ | ❌ |
| `muted/mutedForeground` | `#E6F4EE` | `#4A5568` | 6.64:1 | ✅ | ✅ |
| `destructive/destructiveForeground` | `#EF4444` | `#F7F7F5` | 3.51:1 | ❌ | ✅ |

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

- `accent/accentForeground` (2.89:1): Para texto (não superfície), usar amber-700/900 em vez de accent — ver DESIGN.md nota de contraste.
- `destructive/destructiveForeground` (3.51:1): Uso pretendido é superfície/traço com texto grande (≥18px) ou elemento de UI, não texto corrido pequeno — ok pelo limiar de 3:1.

## Tema dark

| Par | Fundo | Texto | Contraste | AA texto normal (4.5:1) | AA texto grande/UI (3:1) |
| --- | --- | --- | --- | --- | --- |
| `background/foreground` | `#00120A` | `#F7F7F5` | 17.95:1 | ✅ | ✅ |
| `card/cardForeground` | `#0A1F15` | `#F7F7F5` | 16.05:1 | ✅ | ✅ |
| `popover/popoverForeground` | `#0A1F15` | `#F7F7F5` | 16.05:1 | ✅ | ✅ |
| `primary/primaryForeground` | `#1E7A4F` | `#F7F7F5` | 4.95:1 | ✅ | ✅ |
| `secondary/secondaryForeground` | `#E6F4EE` | `#1B6A45` | 5.80:1 | ✅ | ✅ |
| `accent/accentForeground` | `#C9832A` | `#141414` | 5.93:1 | ✅ | ✅ |
| `muted/mutedForeground` | `#15281F` | `#94A3B8` | 6.04:1 | ✅ | ✅ |
| `destructive/destructiveForeground` | `#D54444` | `#F7F7F5` | 4.13:1 | ❌ | ✅ |

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

- `destructive/destructiveForeground` (4.13:1): Uso pretendido é superfície/traço com texto grande (≥18px) ou elemento de UI, não texto corrido pequeno — ok pelo limiar de 3:1.
