import type { KnowledgeCategory } from '@/lib/types';
import type { Segmento } from '@/lib/newsletter-perfil';

/**
 * Copy da página /newsletter (Épico 44), aprovada pelo founder em 13/11/2026.
 * Regras: nenhum percentual, preço, prazo ou número de assinantes; nada sobre
 * curso; um eixo (FEAR ou GREED) por variante — `strategy/AUDIENCES.md` §2.
 * Estágio do funil: topo gratuito. Segmento: escolhido pelo diagnóstico
 * (`lib/newsletter-perfil.ts`).
 */

export const CTA_INSCRICAO = 'Assinar a newsletter';
export const MICROCOPY_INSCRICAO = 'Gratuita · no Substack · cancele quando quiser';

export const HERO = {
  comDiagnostico: {
    eyebrow: 'Próximo passo',
    titulo: 'Você já sabe onde está. Agora vem a parte que o diagnóstico não faz por você.',
    apoio:
      'Quinze questões apontam o gap. Fechar o gap pede repertório. A newsletter da Syntaxis entrega esse repertório: instrumentos, matemática financeira e carreira no mercado brasileiro, com rigor e sem hype.',
  },
  generico: {
    eyebrow: 'Newsletter Syntaxis',
    titulo: 'Finanças do mercado brasileiro, explicadas com rigor e sem hype.',
    apoio:
      'Instrumentos, matemática financeira e carreira, por quem dá aula e trabalha com isso. Direto no seu e-mail.',
  },
  linkSkillCheck: 'Ainda não fez o Skill Check? Descubra seu nível em 10–15 minutos',
  tituloPosts: 'Leia antes de assinar',
};

/** Bloco 2 — um eixo por variante; o segundo parágrafo responde à objeção-mestra do segmento. */
export const DO_DIAGNOSTICO_AO_HABITO: Record<
  Segmento,
  { titulo: string; paragrafos: [string, string] }
> = {
  'genz-fear': {
    titulo: 'Entrar no mercado sem base técnica custa caro. Dá para evitar.',
    paragrafos: [
      'Processo seletivo e primeiro ano de trabalho cobram o mesmo vocabulário: indexador, taxa, prazo, risco. Quem chega sem ele passa o estágio decorando o que deveria estar usando.',
      'Você não precisa de experiência para começar. Cada texto parte do conceito e chega no que se usa no trabalho, um tema por vez.',
    ],
  },
  'genz-greed': {
    titulo: 'Seu resultado está acima do esperado. Use a vantagem.',
    paragrafos: [
      'Estar à frente no seu nível é a melhor hora para aprofundar: o que você aprende agora aparece na próxima entrega.',
      'Dá para aprender de graça no YouTube? Dá, e a newsletter também é gratuita. A diferença é a curadoria: um tema por texto, com a conta feita, a fonte citada e o contexto do mercado brasileiro.',
    ],
  },
  'millennials-fear': {
    titulo: 'Depois de uma década de carreira, o risco é virar genérico.',
    paragrafos: [
      'Pleno e sênior não são cobrados por conhecer o produto. São cobrados por precificar, comparar e decidir. O gap que o diagnóstico mostrou é onde essa cobrança aperta.',
      'Tarde para se especializar? Você tem o repertório que falta a quem está começando. Os textos respeitam isso: vão ao mecanismo, com a conta e o contexto institucional.',
    ],
  },
  'millennials-greed': {
    titulo: 'Seu perfil está acima da expectativa. O passo seguinte é virar referência.',
    paragrafos: [
      'Referência técnica é quem explica o mecanismo quando o modelo e a realidade se descolam. Isso se constrói com profundidade, um instrumento por vez.',
      'Vale o tempo? Cada texto trata de um tema que você usa no trabalho. Leia os que servem à sua semana.',
    ],
  },
  generico: {
    titulo: 'Entre o acadêmico distante e o hype sem lastro, existe um caminho.',
    paragrafos: [
      'Boa parte do conteúdo financeiro erra para um de dois lados: ou é puramente acadêmico e longe da mesa de operações, ou é promessa de guru sem lastro técnico.',
      'A Syntaxis fica no meio: rigor com aplicação real.',
    ],
  },
};

/** Bloco 3 — o que chega no e-mail. */
export const O_QUE_CHEGA = {
  eyebrow: 'O que chega no seu e-mail',
  itens: [
    {
      titulo: 'Notas de um Professor',
      texto:
        'Conceitos de finanças, matemática financeira e produtos, por um professor que já foi aluno e não se esqueceu. Prático, sem decoreba e sem abrir mão da fórmula. Sempre pelos dois lados do balcão: quem compra e quem emite.',
    },
    {
      titulo: 'Spoiler',
      texto:
        'Relatos de uma carreira no mercado financeiro, com os spoilers que evitam armadilhas. Não é porque alguém sofreu que você também precisa sofrer.',
    },
    {
      titulo: 'Sem hype',
      texto:
        'Nenhuma promessa de enriquecimento rápido. Conteúdo educacional, com a fonte de cada número.',
    },
  ],
};

/** Bloco 5 — perguntas. */
export const PERGUNTAS: { pergunta: string; resposta: string }[] = [
  {
    pergunta: 'É gratuita mesmo?',
    resposta: 'Sim. A assinatura gratuita dá acesso aos textos por e-mail.',
  },
  {
    pergunta: 'Já informei meu e-mail no Skill Check. Preciso assinar de novo?',
    resposta:
      'Precisa. São listas separadas: o e-mail do Skill Check serve para o seu resultado e para novidades dos cursos; a newsletter mora no Substack e só chega a quem assina lá.',
  },
  {
    pergunta: 'Posso cancelar?',
    resposta: 'A qualquer momento, com um clique no rodapé de qualquer e-mail.',
  },
];

/** Bloco 6 — fechamento. O P.S. cita o primeiro texto da curadoria. */
export const FECHAMENTO = {
  titulo: 'O próximo texto chega no seu e-mail. O primeiro você pode ler agora.',
  psAntes: 'P.S. Quer testar antes? Comece por «',
  psDepois: '».',
  notaLegal: 'Conteúdo educacional e informativo. Não é recomendação de investimento.',
};

export interface Post {
  titulo: string;
  subtitulo: string;
  url: string;
  linha: 'Notas de um Professor' | 'Spoiler';
}

/**
 * Posts reais, copiados de https://syntaxis.substack.com/api/v1/archive em
 * 13/11/2026. Lista estática de propósito: a página não depende de rede no build.
 */
export const POSTS = {
  rendaFixaCondicoes: {
    titulo: 'Renda Fixa, Condições Variáveis',
    subtitulo: 'Debêntures, escritura e quem decide quando a empresa não paga',
    url: 'https://syntaxis.substack.com/p/renda-fixa-condicoes-variaveis',
    linha: 'Notas de um Professor',
  },
  anatomiaCra: {
    titulo: 'A anatomia e o verdadeiro risco do CRA',
    subtitulo: 'Debênture disfarçada ou título do agro?',
    url: 'https://syntaxis.substack.com/p/a-anatomia-e-o-verdadeiro-risco-do',
    linha: 'Notas de um Professor',
  },
  dividirRisco: {
    titulo: 'Dividir para não correr risco',
    subtitulo: 'Não é favor, é spread. E o risco que sobra nunca desaparece, só muda de endereço.',
    url: 'https://syntaxis.substack.com/p/dividir-para-nao-correr-risco',
    linha: 'Notas de um Professor',
  },
  cordaArco: {
    titulo: 'A Corda e o Arco',
    subtitulo: 'Juro simples, composto e contínuo além dos livros',
    url: 'https://syntaxis.substack.com/p/a-corda-e-o-arco',
    linha: 'Notas de um Professor',
  },
  frequenciaCapitalizacao: {
    titulo: 'Frequência de Capitalização',
    subtitulo: 'A frequência muda a etiqueta, não o motor',
    url: 'https://syntaxis.substack.com/p/frequencia-de-capitalizacao',
    linha: 'Notas de um Professor',
  },
  contandoDias: {
    titulo: 'Você está contando os dias errado',
    subtitulo: 'e isso pode estar custando dinheiro',
    url: 'https://syntaxis.substack.com/p/voce-esta-contando-os-dias-errado',
    linha: 'Notas de um Professor',
  },
  modelosRebelam: {
    titulo: 'Quando os Modelos se Rebelam',
    subtitulo: 'Por que o descolamento entre modelo e realidade é esperado.',
    url: 'https://syntaxis.substack.com/p/quando-os-modelos-se-rebelam',
    linha: 'Spoiler',
  },
  coqueiros: {
    titulo: 'Coqueiros e cacaueiros',
    subtitulo:
      'Skills nativas, skills importadas e por que a sua melhor nota pode estar mentindo para você',
    url: 'https://syntaxis.substack.com/p/coqueiros-e-cacaueiros',
    linha: 'Spoiler',
  },
} satisfies Record<string, Post>;

type PostId = keyof typeof POSTS;

/** Curadoria por dimensão prioritária (sugestão do Épico 44; o founder confirma ou troca). */
export const CURADORIA: Record<KnowledgeCategory | 'generico', [PostId, PostId, PostId]> = {
  'mercados-produtos': ['rendaFixaCondicoes', 'anatomiaCra', 'dividirRisco'],
  'matematica-quant': ['cordaArco', 'frequenciaCapitalizacao', 'contandoDias'],
  'risco-regulacao': ['rendaFixaCondicoes', 'anatomiaCra', 'modelosRebelam'],
  'dados-programacao': ['modelosRebelam', 'coqueiros', 'contandoDias'],
  'ia-aplicada': ['modelosRebelam', 'coqueiros', 'cordaArco'],
  generico: ['frequenciaCapitalizacao', 'cordaArco', 'contandoDias'],
};

export function postsDaCuradoria(dimensao: KnowledgeCategory | null): Post[] {
  return CURADORIA[dimensao ?? 'generico'].map((id) => POSTS[id]);
}
