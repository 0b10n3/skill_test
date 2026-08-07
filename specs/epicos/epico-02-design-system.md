# ÉPICO 2 — Design System: Tokens de Marca e Componentes Base

**Depende de:** Épico 1 concluído
**Entrada:** `prompt-syntaxis-skill-check.md` (seção 3), `tokens.json` da marca "O Sinal no Escuro"

## Objetivo

Implementar o sistema de marca como tokens reutilizáveis e componentes shadcn/ui restilizados, antes de construir qualquer tela real do produto.

## Escopo

- Tailwind v4 configurado com paleta em OKLCH derivada do `tokens.json` (incluindo `volt-800` para texto AA-safe sobre fundo escuro).
- Space Grotesk, Inter e JetBrains Mono carregadas via `next/font`.
- Instalar e restilizar componentes shadcn/ui: Button, Card, Progress, RadioGroup, Dialog, Input, Checkbox, Badge, Separator.
- Rota interna de QA visual (`/dev/design-system`, não linkada publicamente) exibindo todos os componentes lado a lado — substitui um Storybook completo, mais leve para este escopo.
- Dark-mode-first aplicado (sem toggle de tema).

## Critérios de aceite

- Dado que acesso `/dev/design-system`, quando a página carrega, então vejo todos os componentes-base já estilizados com a paleta volt green sobre fundo escuro.
- Dado qualquer texto de destaque sobre fundo escuro, quando comparo com WCAG AA, então o contraste usa `volt-800`, nunca `volt-700` puro em texto pequeno.

## Testes obrigatórios

- Teste automatizado de contraste (axe-core) rodando contra `/dev/design-system`, sem violações de contraste.
- Snapshot visual (Playwright ou equivalente já disponível no ambiente) dos componentes-base, para detectar regressão visual futura.

## Gate — não avance para o Épico 3 até que:

- [ ] `/dev/design-system` renderiza todos os componentes-base sem erro.
- [ ] axe-core não aponta nenhuma violação de contraste na página de QA visual.
- [ ] Space Grotesk/Inter/JetBrains Mono carregam corretamente (sem fallback de fonte de sistema, verificável via devtools).

## Boas práticas aplicadas

Tokens como única fonte de verdade (nenhuma cor hardcoded fora do arquivo de tokens); componentes shadcn customizados via tokens/CSS variables, não forkados manualmente, para facilitar updates futuros da biblioteca.
