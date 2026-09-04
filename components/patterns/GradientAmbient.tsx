import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export type GradientAmbientTone = 'forest' | 'lime';
export type GradientAmbientCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface GradientAmbientProps {
  tone: GradientAmbientTone;
  corner: GradientAmbientCorner;
  className?: string;
}

const CORNER_POSITION: Record<GradientAmbientCorner, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
};

/**
 * Nomes de variável escritos por extenso, um bloco por tom — nunca
 * `` `--gradient-ambient-${tone}-color` ``. O build (Tailwind v4 /
 * Lightning CSS) elimina do `:root` qualquer variável de `@theme` que não
 * consiga achar como string literal em algum arquivo fonte; um nome
 * montado em template literal não é uma string literal e a variável some
 * silenciosamente (achado real desta implementação — o glow renderizava
 * com `width:auto`/`height:auto` em cima de um valor vazio, ou seja,
 * 0×0, sem nenhum erro).
 */
const TONE_STYLE: Record<GradientAmbientTone, CSSProperties> = {
  forest: {
    width: 'var(--gradient-ambient-forest-radius)',
    height: 'var(--gradient-ambient-forest-radius)',
    background: 'radial-gradient(circle, var(--gradient-ambient-forest-color) 0%, transparent 70%)',
    opacity: 'var(--gradient-ambient-forest-opacity-max)',
  },
  lime: {
    width: 'var(--gradient-ambient-lime-radius)',
    height: 'var(--gradient-ambient-lime-radius)',
    background: 'radial-gradient(circle, var(--gradient-ambient-lime-color) 0%, transparent 70%)',
    opacity: 'var(--gradient-ambient-lime-opacity-max)',
  },
};

/**
 * Camada de ambiente de fundo — exceção nomeada de gradiente/glow
 * (DESIGN.md v3.0 §4.5, `gradient.ambient.*`, tokens v2.4.0). Regras que
 * este componente garante por construção, não por disciplina de quem o
 * usa: radial, cor de token (nunca hex novo), opacidade travada no teto
 * do token, `pointer-events-none` + `aria-hidden` (é decoração, nunca
 * conteúdo). O que o componente NÃO garante — cabe a quem o posiciona —
 * é a regra "nunca atrás de texto direto sem superfície sólida entre os
 * dois": use como camada mais baixa (`-z-10`) e confirme que o texto da
 * seção tem um fundo sólido próprio.
 */
export function GradientAmbient({ tone, corner, className }: GradientAmbientProps) {
  return (
    <div
      aria-hidden="true"
      data-gradient-ambient={tone}
      className={cn('pointer-events-none absolute -z-10', CORNER_POSITION[corner], className)}
      style={TONE_STYLE[tone]}
    />
  );
}
