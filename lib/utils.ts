import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import tokens from '@/design/tokens.json';

function kebabCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// tailwind-merge não conhece as classes utilitárias que
// scripts/generate-tokens-css.mjs gera a partir de typography.scale (ex.:
// `.text-eyebrow`, `.text-data-xl`) — por padrão, seu heurístico trata
// qualquer classe `text-<palavra>` sem sufixo numérico como candidata a cor
// de texto. Resultado: `cn('text-eyebrow', 'text-grove-700')` descartava
// silenciosamente `text-eyebrow` (achado real do Épico 20 — o componente
// Eyebrow renderizava sem nenhuma das propriedades do token, só a cor).
// Registrar essas classes no grupo `font-size` (derivado do próprio
// tokens.json, nunca uma lista solta) resolve a colisão pela raiz.
const typographyScaleClasses = Object.keys(tokens.typography.scale)
  .filter((key) => !key.startsWith('$'))
  .map((key) => `text-${kebabCase(key)}`);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': typographyScaleClasses,
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
