import type { CategoryScore, Classification } from './types';

export interface ResultNarrative {
  headline: string;
  body: string;
}

/**
 * ⚠️ PLACEHOLDER — copy provisória, não é texto de marca final.
 *
 * A especificação (especificacao-quiz-avaliacao.md, seção 6) diz que o
 * profileTag da autoavaliação cruzado com o score de dados-tecnologia e
 * ia-aplicada-financas "alimenta a narrativa do resultado... via
 * buildResultNarrative()", mas remete à lógica da v1 do produto, que não
 * está disponível em nenhum documento em /specs. Sem esse conteúdo, os
 * textos abaixo são um placeholder estrutural (mesmo tratamento já usado em
 * content/offers.ts para as ofertas comerciais) — precisam ser substituídos
 * pela copy real antes do go-live (ver relatório do Épico 6).
 */
const CLASSIFICATION_HEADLINE: Record<Classification, string> = {
  baixo: 'Você está no começo da jornada técnica',
  medio: 'Você já tem uma base técnica sólida',
  alto: 'Você domina bem o conteúdo avaliado',
};

const PROFILE_TAG_HINT: Record<string, string> = {
  sem_experiencia_dados:
    'Vale começar a se familiarizar com ferramentas de dados (SQL, Python, Power BI) no seu dia a dia.',
  iniciante_dados:
    'Praticar mais essas ferramentas no dia a dia pode acelerar seu desenvolvimento.',
  usuario_intermediario_dados:
    'Aprofundar seu uso dessas ferramentas pode te diferenciar ainda mais no mercado.',
  usuario_avancado_dados: 'Seu domínio prático de dados já é um diferencial real no mercado.',
};

export function buildResultNarrative(params: {
  classification: Classification;
  profileTag?: string;
  scorePorCategoria: CategoryScore[];
}): ResultNarrative {
  const headline = CLASSIFICATION_HEADLINE[params.classification];

  const dadosTecnologia = params.scorePorCategoria.find(
    (category) => category.category === 'dados-tecnologia',
  );
  const iaAplicada = params.scorePorCategoria.find(
    (category) => category.category === 'ia-aplicada-financas',
  );

  const bodyParts: string[] = [];

  if (dadosTecnologia && iaAplicada) {
    bodyParts.push(
      `Em dados e tecnologia você acertou ${dadosTecnologia.correct} de ${dadosTecnologia.total}, e em IA aplicada a finanças, ${iaAplicada.correct} de ${iaAplicada.total}.`,
    );
  }

  const hint = params.profileTag ? PROFILE_TAG_HINT[params.profileTag] : undefined;
  if (hint) {
    bodyParts.push(hint);
  }

  return { headline, body: bodyParts.join(' ') };
}
