/**
 * Promessa de suporte da landing — DESIGN.md §1.3, verbatim. Nunca
 * substituir por formulação genérica ("aprenda finanças", "domine
 * investimentos") nem por número de salário/promoção que a Syntaxis não
 * controla (regra de verificabilidade, mesma seção).
 */
export const HERO_PROMISE =
  'Skills e ferramentas de trabalho real — incluindo IA — para o próximo nível da sua carreira.';

/**
 * Faixa de números da landing (DESIGN.md v1.1 §4.4.5) — cada item vira um
 * bloco `statNumber` (IBM Plex Mono) individual, não uma única linha de texto.
 * Os 5 níveis são os `SeniorityLevel` reais do produto (aspirante,
 * estagiário, júnior, pleno, sênior — lib/types.ts).
 */
export const METODO_STATS_ITEMS: { value: string; label: string }[] = [
  { value: '15', label: 'questões' },
  { value: '5', label: 'dimensões de competência' },
  { value: '10–15', label: 'minutos' },
  { value: 'R$ 0', label: 'para fazer' },
];

/** Épico 46 (L1): primeira tela — custo, tempo e formato junto do botão. */
export const HERO_MICROCOPY = 'Gratuito · 10–15 min · 15 perguntas';
export const HERO_APOIO =
  'Uma avaliação adaptativa sobre renda fixa, matemática financeira, dados e IA aplicada ao mercado, calibrada para o seu momento de carreira.';

/** Épico 46 (L2, C5): como funciona. */
export const COMO_FUNCIONA: { titulo: string; texto: string }[] = [
  {
    titulo: 'Responda 15 questões.',
    texto: 'Múltipla escolha, calibradas para o seu nível, em 10–15 minutos.',
  },
  { titulo: 'Informe nome e e-mail.', texto: 'É o que libera o seu relatório.' },
  {
    titulo: 'Receba o diagnóstico.',
    texto:
      'Radar das 5 dimensões contra a expectativa do seu nível, suas 2 prioridades com o primeiro passo de cada uma e o gabarito comentado.',
  },
];

/** Épico 46 (L8): apoio do título "O que o diagnóstico avalia". */
export const DIMENSOES_APOIO =
  '15 questões, 3 por dimensão, calibradas para o seu nível. Abaixo, exemplos reais do banco.';

/** Épico 46 (L5, C12): perguntas frequentes. A última resposta ganha o link da política no componente. */
export const PERGUNTAS_LANDING: { pergunta: string; resposta: string }[] = [
  { pergunta: 'É gratuito?', resposta: 'É. O diagnóstico completo não tem custo.' },
  {
    pergunta: 'Por que pedem meu e-mail?',
    resposta:
      'Para liberar o relatório e para enviar novidades de cursos e conteúdo técnico da Syntaxis. Você pode sair da lista a qualquer momento.',
  },
  {
    pergunta: 'Quanto tempo leva?',
    resposta: 'De 10 a 15 minutos. São 15 questões de múltipla escolha.',
  },
  {
    pergunta: 'Para quem é?',
    resposta:
      'Para quem trabalha ou quer trabalhar no mercado financeiro brasileiro, de aspirante a analista sênior. As perguntas mudam conforme o nível que você declara.',
  },
  {
    pergunta: 'O resultado é uma certificação?',
    resposta:
      'Não. É um retrato direcional: 15 questões apontam onde estão os seus gaps, mas não substituem uma prova de certificação.',
  },
];
export const PERGUNTA_DADOS = 'O que acontece com os meus dados?';
