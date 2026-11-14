import { describe, expect, it } from 'vitest';
import { CURADORIA, DO_DIAGNOSTICO_AO_HABITO, POSTS, postsDaCuradoria } from '@/content/newsletter';
import {
  PERFIL_VAZIO,
  perfilDaQuery,
  segmentoDe,
  temDiagnostico,
  type PerfilNewsletter,
} from '@/lib/newsletter-perfil';
import type { Classification, SeniorityLevel } from '@/lib/types';

const NIVEIS: SeniorityLevel[] = ['aspirante', 'estagiario', 'junior', 'pleno', 'senior'];
const CLASSIFICACOES: Classification[] = ['baixo', 'medio', 'alto'];

// Tabela do Épico 44.
function esperado(nivel: SeniorityLevel, c: Classification): string {
  const geracao = ['aspirante', 'estagiario', 'junior'].includes(nivel) ? 'genz' : 'millennials';
  return `${geracao}-${c === 'alto' ? 'greed' : 'fear'}`;
}

describe('segmentoDe (Épico 44)', () => {
  it.each(NIVEIS.flatMap((n) => CLASSIFICACOES.map((c) => [n, c] as const)))(
    '%s × %s cai no segmento da tabela',
    (nivel, classificacao) => {
      const perfil: PerfilNewsletter = { ...PERFIL_VAZIO, nivel, classificacao };
      expect(segmentoDe(perfil)).toBe(esperado(nivel, classificacao));
    },
  );

  it('sem nível ou sem classificação é genérico', () => {
    expect(segmentoDe(PERFIL_VAZIO)).toBe('generico');
    expect(segmentoDe({ ...PERFIL_VAZIO, nivel: 'junior' })).toBe('generico');
  });

  it('toda variante tem título e dois parágrafos', () => {
    for (const bloco of Object.values(DO_DIAGNOSTICO_AO_HABITO)) {
      expect(bloco.titulo.length).toBeGreaterThan(0);
      expect(bloco.paragrafos).toHaveLength(2);
    }
  });
});

describe('perfilDaQuery', () => {
  it('lê n, d e c válidos como diagnóstico vindo de link', () => {
    const perfil = perfilDaQuery({ n: 'junior', d: 'matematica-quant', c: 'baixo' });
    expect(perfil).toEqual({
      nivel: 'junior',
      dimensao: 'matematica-quant',
      classificacao: 'baixo',
      origem: 'link',
    });
    expect(temDiagnostico(perfil)).toBe(true);
    expect(segmentoDe(perfil)).toBe('genz-fear');
  });

  it('ignora valores fora dos enums e vira genérico', () => {
    const perfil = perfilDaQuery({ n: 'diretor', d: '<script>', c: ['alto', 'baixo'] });
    expect(perfil).toEqual(PERFIL_VAZIO);
    expect(segmentoDe(perfil)).toBe('generico');
  });
});

describe('curadoria de posts', () => {
  it('toda dimensão e o genérico têm três posts distintos', () => {
    for (const ids of Object.values(CURADORIA)) {
      expect(new Set(ids).size).toBe(3);
    }
  });

  it('toda URL de post é da publicação Syntaxis', () => {
    for (const post of Object.values(POSTS)) {
      expect(post.url).toMatch(/^https:\/\/syntaxis\.substack\.com\/p\/[a-z0-9-]+$/);
    }
  });

  it('sem dimensão usa a curadoria genérica', () => {
    expect(postsDaCuradoria(null).map((p) => p.titulo)).toEqual(
      CURADORIA.generico.map((id) => POSTS[id].titulo),
    );
  });
});
