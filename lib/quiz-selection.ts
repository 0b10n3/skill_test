import { questionsBank } from './questions-bank';
import type {
  ClientQuestion,
  KnowledgeCategory,
  Question,
  QuizSession,
  SeniorityLevel,
} from './types';

const KNOWLEDGE_QUESTIONS_PER_CATEGORY = 3;

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Constrói explicitamente a versão client de uma pergunta, sem o campo
 * correctOptionId — não é um cast de tipo, a chave é removida do objeto.
 */
function toClientQuestion(question: Question): ClientQuestion {
  const { correctOptionId: _correctOptionId, ...clientQuestion } = question;
  return {
    ...clientQuestion,
    options: shuffle(question.options),
  };
}

function getKnowledgeCategories(): KnowledgeCategory[] {
  const categories = new Set<KnowledgeCategory>();
  for (const question of questionsBank) {
    if (question.type === 'knowledge') {
      categories.add(question.category as KnowledgeCategory);
    }
  }
  return [...categories];
}

function selectKnowledgeQuestions(seniority: SeniorityLevel): Question[] {
  const categories = getKnowledgeCategories();
  const selected: Question[] = [];

  for (const category of categories) {
    const eligible = questionsBank.filter(
      (question) =>
        question.type === 'knowledge' &&
        question.category === category &&
        question.targetSeniority?.includes(seniority),
    );

    if (eligible.length < KNOWLEDGE_QUESTIONS_PER_CATEGORY) {
      throw new Error(
        `Banco de perguntas insuficiente: categoria "${category}" tem apenas ${eligible.length} perguntas elegíveis para "${seniority}" (mínimo ${KNOWLEDGE_QUESTIONS_PER_CATEGORY})`,
      );
    }

    selected.push(...shuffle(eligible).slice(0, KNOWLEDGE_QUESTIONS_PER_CATEGORY));
  }

  return selected;
}

/**
 * Retorna só a pergunta fixa de senioridade (q00), para renderizar a
 * primeira tela do quiz antes de sabermos a senioridade do participante.
 */
export function getSeniorityQuestion(): ClientQuestion {
  const seniorityQuestion = questionsBank.find((question) => question.type === 'seniority');

  if (!seniorityQuestion) {
    throw new Error('Banco de perguntas não contém a pergunta de senioridade (type "seniority")');
  }

  return toClientQuestion(seniorityQuestion);
}

/**
 * Monta a sessão completa do quiz para uma senioridade declarada: a pergunta
 * fixa de senioridade, 12 perguntas de conhecimento (3 por categoria, elegíveis
 * e sorteadas, embaralhadas entre categorias) e a pergunta de autoavaliação.
 * Retorna apenas ClientQuestion — nenhum correctOptionId trafega neste objeto.
 */
export function buildQuizSession(seniority: SeniorityLevel): QuizSession {
  const seniorityQuestion = questionsBank.find((question) => question.type === 'seniority');
  const selfAssessmentQuestion = questionsBank.find(
    (question) => question.type === 'self_assessment',
  );

  if (!seniorityQuestion) {
    throw new Error('Banco de perguntas não contém a pergunta de senioridade (type "seniority")');
  }
  if (!selfAssessmentQuestion) {
    throw new Error(
      'Banco de perguntas não contém a pergunta de autoavaliação (type "self_assessment")',
    );
  }

  const knowledgeQuestions = shuffle(selectKnowledgeQuestions(seniority));

  return {
    seniorityQuestion: toClientQuestion(seniorityQuestion),
    knowledgeQuestions: knowledgeQuestions.map(toClientQuestion),
    selfAssessmentQuestion: toClientQuestion(selfAssessmentQuestion),
  };
}
