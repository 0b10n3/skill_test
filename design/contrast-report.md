# Relatório de contraste — design/tokens.json

> Gerado por `npm run audit:contrast` (Épico 14, pares do lime no Épico 22).
> Não editar à mão — regenerar após qualquer mudança em `design/tokens.json`.

## Tema light

| Par | Fundo | Texto | Contraste | AA texto normal (4.5:1) | AA texto grande/UI (3:1) |
| --- | --- | --- | --- | --- | --- |
| `background/foreground` | `#F7F7F5` | `#141414` | 17.17:1 | ✅ | ✅ |
| `card/cardForeground` | `#FFFFFF` | `#141414` | 18.42:1 | ✅ | ✅ |
| `popover/popoverForeground` | `#FFFFFF` | `#141414` | 18.42:1 | ✅ | ✅ |
| `primary/primaryForeground` | `#1B6A45` | `#F7F7F5` | 6.13:1 | ✅ | ✅ |
| `secondary/secondaryForeground` | `#1E7A4F` | `#F7F7F5` | 4.95:1 | ✅ | ✅ |
| `accent/accentForeground` | `#CDF163` | `#141414` | 14.35:1 | ✅ | ✅ |
| `muted/mutedForeground` | `#E6F4EE` | `#4A5568` | 6.64:1 | ✅ | ✅ |
| `destructive/destructiveForeground` | `#EF4444` | `#F7F7F5` | 3.51:1 | ❌ | ✅ |

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

- `destructive/destructiveForeground` (3.51:1): Uso pretendido é superfície/traço com texto grande (≥18px) ou elemento de UI, não texto corrido pequeno — ok pelo limiar de 3:1.

## Tema dark

| Par | Fundo | Texto | Contraste | AA texto normal (4.5:1) | AA texto grande/UI (3:1) |
| --- | --- | --- | --- | --- | --- |
| `background/foreground` | `#00120A` | `#F7F7F5` | 17.95:1 | ✅ | ✅ |
| `card/cardForeground` | `#0A1F15` | `#F7F7F5` | 16.05:1 | ✅ | ✅ |
| `popover/popoverForeground` | `#0A1F15` | `#F7F7F5` | 16.05:1 | ✅ | ✅ |
| `primary/primaryForeground` | `#1E7A4F` | `#F7F7F5` | 4.95:1 | ✅ | ✅ |
| `secondary/secondaryForeground` | `#E6F4EE` | `#1B6A45` | 5.80:1 | ✅ | ✅ |
| `accent/accentForeground` | `#CDF163` | `#141414` | 14.35:1 | ✅ | ✅ |
| `muted/mutedForeground` | `#15281F` | `#94A3B8` | 6.04:1 | ✅ | ✅ |
| `destructive/destructiveForeground` | `#D54444` | `#F7F7F5` | 4.13:1 | ❌ | ✅ |

### Falhas conhecidas (abaixo de 4.5:1) e substituto/justificativa

- `destructive/destructiveForeground` (4.13:1): Uso pretendido é superfície/traço com texto grande (≥18px) ou elemento de UI, não texto corrido pequeno — ok pelo limiar de 3:1.

## Regras duras do Lime (Épico 22, DESIGN.md v2.0 §4.1/§4.4/§4.6)

Pares fixos (não dependem de tema) que provam a regra "lime-500 nunca é
texto pequeno sobre fundo claro; texto sobre superfície lime é sempre Ink":

| Par | Fundo | Texto | Contraste | Limiar exigido | Resultado |
| --- | --- | --- | --- | --- | --- |
| lime-500 (superfície) × Ink (texto) — CTA primário, bloco de highlight | `#CDF163` | `#141414` | 14.35:1 | 4.5:1 | ✅ |
| lime-300 (superfície, hover) × Ink (texto) — hover do CTA primário | `#DFF7A1` | `#141414` | 15.75:1 | 4.5:1 | ✅ |
| White/card claro × lime-700 (texto) — attentionText, texto real sobre superfície clara | `#FFFFFF` | `#5F7D1C` | 4.73:1 | 4.5:1 | ✅ |
| Deep Forest (banda) × lime-300 (texto) — eyebrow/número sobre banda escura | `#0F3D27` | `#DFF7A1` | 10.46:1 | 4.5:1 | ✅ |
| Ink (fundo dark) × lime-300 (texto) — eyebrow sobre Dark Mode | `#141414` | `#DFF7A1` | 15.75:1 | 4.5:1 | ✅ |
| Chalk × lime-700 (traço, growthLine.colorOnLight) — elemento gráfico, limiar UI 3:1, não texto | `#F7F7F5` | `#5F7D1C` | 4.41:1 | 3:1 | ✅ |
| Chalk (fundo claro) × lime-500 (texto pequeno) — NUNCA deve passar (prova da regra dura) | `#F7F7F5` | `#CDF163` | 1.20:1 | 4.5:1 | ✅ (falha esperada) |
