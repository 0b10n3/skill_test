import type { Classification, KnowledgeCategory, SeniorityLevel } from './types';

/**
 * Perfil da página /newsletter (Épico 44): de onde vem a personalização e qual
 * segmento de `strategy/AUDIENCES.md` a copy usa. Função pura, sem React.
 */

export type Segmento =
  'genz-fear' | 'genz-greed' | 'millennials-fear' | 'millennials-greed' | 'generico';

export type Origem = 'resultado' | 'link' | 'direto';

export interface PerfilNewsletter {
  nivel: SeniorityLevel | null;
  classificacao: Classification | null;
  dimensao: KnowledgeCategory | null;
  origem: Origem;
}

const NIVEIS: readonly SeniorityLevel[] = ['aspirante', 'estagiario', 'junior', 'pleno', 'senior'];
const CLASSIFICACOES: readonly Classification[] = ['baixo', 'medio', 'alto'];
const DIMENSOES: readonly KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];
const GENZ: readonly SeniorityLevel[] = ['aspirante', 'estagiario', 'junior'];

function valido<T extends string>(lista: readonly T[], valor: unknown): T | null {
  return typeof valor === 'string' && (lista as readonly string[]).includes(valor)
    ? (valor as T)
    : null;
}

export const PERFIL_VAZIO: PerfilNewsletter = {
  nivel: null,
  classificacao: null,
  dimensao: null,
  origem: 'direto',
};

/**
 * `?n=<nível>&d=<dimensão>&c=<classificação>` — usado em links de e-mail do
 * MailerLite. Valor fora dos enums é ignorado. Nunca nome ou e-mail na URL.
 */
export function perfilDaQuery(
  query: Record<string, string | string[] | undefined>,
): PerfilNewsletter {
  const perfil: PerfilNewsletter = {
    nivel: valido(NIVEIS, query.n),
    classificacao: valido(CLASSIFICACOES, query.c),
    dimensao: valido(DIMENSOES, query.d),
    origem: 'direto',
  };
  const algum = perfil.nivel || perfil.classificacao || perfil.dimensao;
  return algum ? { ...perfil, origem: 'link' } : PERFIL_VAZIO;
}

/** Com diagnóstico = nível, classificação e dimensão conhecidos. */
export function temDiagnostico(perfil: PerfilNewsletter): boolean {
  return Boolean(perfil.nivel && perfil.classificacao && perfil.dimensao);
}

/** Tabela do Épico 44: nível escolhe a geração, classificação escolhe o eixo. */
export function segmentoDe(perfil: PerfilNewsletter): Segmento {
  if (!perfil.nivel || !perfil.classificacao) return 'generico';
  const geracao = GENZ.includes(perfil.nivel) ? 'genz' : 'millennials';
  const eixo = perfil.classificacao === 'alto' ? 'greed' : 'fear';
  return `${geracao}-${eixo}`;
}
