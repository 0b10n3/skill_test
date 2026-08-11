import type { DimensionEtiqueta } from '@/lib/diagnostico';
import type { Classification, KnowledgeCategory, SeniorityLevel } from '@/lib/types';

/**
 * Matriz editorial do relatório de resultados (Épico 12, REPORT.md §4).
 * Nenhum texto do relatório é gerado em runtime — a UI só seleciona blocos
 * daqui por dimensão × nível × faixa. Toda alteração de copy passa por PR
 * neste arquivo, nunca por edição direta de componente.
 */

export const CATEGORY_LABEL: Record<KnowledgeCategory, string> = {
  'mercados-produtos': 'Mercados & Produtos',
  'matematica-quant': 'Matemática & Quant',
  'dados-programacao': 'Dados & Programação',
  'ia-aplicada': 'IA Aplicada',
  'risco-regulacao': 'Risco & Regulação',
};

export const CATEGORY_LABEL_SHORT: Record<KnowledgeCategory, string> = {
  'mercados-produtos': 'Mercados',
  'matematica-quant': 'Quant',
  'dados-programacao': 'Dados',
  'ia-aplicada': 'IA',
  'risco-regulacao': 'Risco',
};

export const SENIORITY_LABEL: Record<SeniorityLevel, string> = {
  aspirante: 'Aspirante / Investidor',
  estagiario: 'Estagiário',
  junior: 'Analista Júnior',
  pleno: 'Analista Pleno',
  senior: 'Analista Sênior',
};

/** "Próximo degrau" usado no título da S5 — aspirante→primeira vaga; sênior→liderança. */
export const NEXT_LEVEL_LABEL: Record<SeniorityLevel, string> = {
  aspirante: 'sua primeira posição no mercado',
  estagiario: 'analista júnior',
  junior: 'analista pleno',
  pleno: 'analista sênior',
  senior: 'liderança técnica',
};

export const CLASSIFICATION_LABEL: Record<Classification, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
};

/** S1 — microcopy de uma linha ao lado do selo, sempre com a moldura "para [nível]". */
export const CLASSIFICATION_CONTEXT: Record<Classification, (nivelLabel: string) => string> = {
  alto: (nivel) => `Perfil acima da expectativa para ${nivel}.`,
  medio: (nivel) => `Perfil dentro da expectativa para ${nivel}, com gaps específicos.`,
  baixo: (nivel) => `Gaps estruturais em relação à expectativa para ${nivel}.`,
};

/**
 * S2 — expectativa fixa por eixo do radar (o "contorno alvo"): 2 de 3
 * itens, igual em todas as dimensões/níveis por ora (REPORT.md §2, S2) —
 * fica pronta para configuração por nível/eixo se o instrumento crescer.
 */
export const EXPECTATIVA_DO_NIVEL = 0.67;

/** S3 — 15 microcopies de score card (5 dimensões × 3 faixas). */
export const SCORE_CARD_COPY: Record<KnowledgeCategory, Record<DimensionEtiqueta, string>> = {
  'mercados-produtos': {
    forte:
      'Você lê produtos de renda fixa e crédito com domínio acima do esperado para o seu nível.',
    neutro:
      'Base de produtos em formação — misture teoria com casos reais de mesa para consolidar.',
    atencao:
      'Fundamentos de produtos de renda fixa e crédito ainda pedem reforço antes do próximo degrau.',
  },
  'matematica-quant': {
    forte:
      'Matemática financeira e leitura quantitativa de risco já são um ponto forte do seu perfil.',
    neutro:
      'Você aplica os conceitos quantitativos básicos — duration, convexidade e estatística pedem mais prática.',
    atencao:
      'Matemática financeira e estatística aplicada são a lacuna mais urgente do seu perfil hoje.',
  },
  'dados-programacao': {
    forte:
      'SQL, Python e pipeline de dados já funcionam como ferramenta de trabalho no seu perfil.',
    neutro:
      'Você já usa dados no dia a dia — falta consolidar SQL/Python como ferramenta autônoma.',
    atencao:
      'Dados e programação (SQL, Python, Excel avançado) são o maior gap técnico do seu perfil hoje.',
  },
  'ia-aplicada': {
    forte:
      'Você distingue caso de uso real de exagero em IA aplicada a finanças — raro no seu nível.',
    neutro:
      'Você reconhece o potencial da IA aplicada, mas ainda não tem critério firme sobre limites e riscos.',
    atencao:
      'IA aplicada a finanças (casos de uso, limites, viés) ainda é território pouco explorado.',
  },
  'risco-regulacao': {
    forte: 'Risco, marcação a mercado e regulação já entram na sua leitura de qualquer produto.',
    neutro:
      'Você reconhece os riscos principais, mas a leitura de regulação/compliance ainda é superficial.',
    atencao:
      'Risco e regulação (marcação a mercado, CVM/BCB/ANBIMA) são um ponto cego que pesa no seu nível.',
  },
};

/** S4/S5 — 25 textos de "por que importa" (5 dimensões × 5 níveis), sempre na moldura do próximo degrau. */
export const POR_QUE_IMPORTA: Record<KnowledgeCategory, Record<SeniorityLevel, string>> = {
  'mercados-produtos': {
    aspirante:
      'Para conseguir a primeira posição no mercado, entender como renda fixa, tributação e garantias funcionam na prática é o vocabulário mínimo que qualquer processo seletivo técnico cobra.',
    estagiario:
      'Do estágio para júnior, o que separa quem decora produto de quem entende produto é ler indexador, tributação e estrutura de garantia sem depender de decoreba.',
    junior:
      'Do júnior ao pleno, a régua sobe de "conhecer o produto" para "precificar e comparar risco de crédito entre estruturas" — debênture, CRI/CRA, FIDC.',
    pleno:
      'Do pleno ao sênior, mercados e produtos deixa de ser sobre características do papel e passa a ser sobre estruturação e trade-off de alocação.',
    senior:
      'Na liderança técnica, profundidade em produtos vira critério estratégico de alocação — quem decide precisa enxergar o mercado além do produto individual, com visão de portfólio.',
  },
  'matematica-quant': {
    aspirante:
      'Valor do dinheiro no tempo e juros compostos são a base de qualquer decisão financeira — sem isso, entender qualquer produto de investimento vira ato de fé.',
    estagiario:
      'Matemática financeira aplicada — não só a fórmula, mas quando usar cada uma — é o que diferencia quem calcula de quem só reproduz planilha pronta.',
    junior:
      'Do júnior ao pleno, estatística descritiva e inferencial deixa de ser conteúdo de prova para virar ferramenta de leitura de risco e retorno.',
    pleno:
      'Duration, convexidade e modelagem de risco são o que permitem ao pleno migrar de executar cálculo para desenhar a análise.',
    senior:
      'No topo da carreira técnica, julgamento quantitativo sob incerteza — não a fórmula em si — é o que sustenta decisão de alocação que ninguém mais vai validar por você.',
  },
  'dados-programacao': {
    aspirante:
      'SQL, Python e Excel avançado não são mais diferencial — são o idioma básico do mercado financeiro brasileiro hoje.',
    estagiario:
      'Do estágio para júnior, sair de "sei usar Excel" para "sei escrever uma query e automatizar uma rotina" é hoje um dos critérios que mais desempata processo seletivo técnico.',
    junior:
      'Do júnior ao pleno, dados e programação é o maior diferenciador competitivo do mercado brasileiro atual — SQL de verdade, Python para análise e noção de engenharia de dados.',
    pleno:
      'Do pleno ao sênior, a régua passa de "analisar com dados" para "desenhar o pipeline e garantir a qualidade dos dados que sustentam a análise de outras pessoas".',
    senior:
      'Na liderança técnica, dados deixa de ser sobre a query certa e passa a ser sobre governança: garantir que o time inteiro trabalhe sobre dado confiável e rastreável.',
  },
  'ia-aplicada': {
    aspirante:
      'Entender para que serve IA generativa no mercado financeiro — e onde ela não deveria ser usada sem supervisão — já é parte do que qualquer entrada no mercado espera hoje.',
    estagiario:
      'Produtividade real com IA generativa (não só "saber usar um chat") já aparece como competência técnica esperada em processos seletivos de estágio/júnior no setor financeiro.',
    junior:
      'Do júnior ao pleno, usar IA para acelerar análise começa a valer mais do que fazer tudo manualmente — mas exige saber quando não confiar cegamente no resultado.',
    pleno:
      'Do pleno ao sênior, avaliação crítica de modelo de IA — explicabilidade, viés, limites — é o que separa quem usa a ferramenta de quem consegue validar se ela está certa.',
    senior:
      'Na liderança técnica, IA aplicada vira decisão estratégica: quando adotar, como governar e como responder por um modelo perante risco e compliance.',
  },
  'risco-regulacao': {
    aspirante:
      'Saber que existem FGC, marcação a mercado e regulação — mesmo sem profundidade — evita os erros mais comuns de quem está começando a entender investimentos.',
    estagiario:
      'Noção de compliance e dos riscos básicos de cada produto é o que diferencia quem só executa tarefa de quem entende o motivo por trás da regra.',
    junior:
      'Do júnior ao pleno, entender o risco do que você mesmo opera — de mercado, crédito e liquidez — é o que permite assumir mais autonomia sem virar um problema para a área de risco.',
    pleno:
      'Do pleno ao sênior, interlocução real com risco e compliance — discutir o trade-off, não só seguir a regra — é parte do que se espera de quem estrutura operações mais complexas.',
    senior:
      'Na liderança técnica, regulação deixa de ser checklist e vira variável estratégica: governança de modelo e de dado é o que separa quem decide de quem só executa.',
  },
};

/** S5 — 25 "primeiros passos" (5 dimensões × 5 níveis), sempre uma ação concreta de 1 linha. */
export const PRIMEIRO_PASSO: Record<KnowledgeCategory, Record<SeniorityLevel, string>> = {
  'mercados-produtos': {
    aspirante:
      'Compare um CDB, uma LCI e um Tesouro Direto de mesmo valor e prazo e anote as diferenças reais.',
    estagiario:
      'Leia a lâmina de uma debênture recente e identifique garantia, indexador e tributação sozinho.',
    junior:
      'Precifique manualmente uma debênture simples a partir da curva de juros e compare com o mercado.',
    pleno:
      'Monte a estrutura de subordinação de uma operação de crédito estruturado e explique o waterfall.',
    senior:
      'Documente o trade-off de alocação entre dois produtos de risco/retorno parecido para uma decisão real.',
  },
  'matematica-quant': {
    aspirante:
      'Calcule na mão o valor futuro de um investimento com juros compostos antes de conferir na calculadora.',
    estagiario:
      'Refaça o cálculo de rentabilidade líquida de um CDB, com IR pela tabela regressiva, sem planilha pronta.',
    junior:
      'Calcule duration e convexidade de um título simples e explique o que cada número significa na prática.',
    pleno:
      'Estruture uma análise de risco de uma carteira simples usando estatística — não só a média, a dispersão.',
    senior:
      'Desafie uma decisão de alocação do seu time só com os números, sem intuição, e veja se ela se sustenta.',
  },
  'dados-programacao': {
    aspirante:
      'Monte uma tabela dinâmica no Excel a partir de uma planilha de dados financeiros real.',
    estagiario:
      'Escreva sua primeira query SQL de verdade — um SELECT com JOIN — sobre uma base de dados financeiros.',
    junior:
      'Automatize com Python uma rotina real sua que hoje você faz manualmente, mesmo que pequena.',
    pleno:
      'Desenhe o pipeline de dados de uma análise recorrente sua, da fonte bruta até o dashboard final.',
    senior:
      'Audite a qualidade de dados de um processo do seu time e documente onde a confiabilidade quebra.',
  },
  'ia-aplicada': {
    aspirante:
      'Peça a um assistente de IA para explicar um conceito financeiro que você não entende e confira contra uma fonte confiável.',
    estagiario:
      'Use IA generativa para acelerar uma tarefa repetitiva sua esta semana e meça quanto tempo você ganhou de verdade.',
    junior:
      'Use IA para gerar uma primeira versão de análise e revise criticamente cada número antes de aceitar.',
    pleno:
      'Avalie um modelo de IA usado no seu time quanto a viés e explicabilidade — não só quanto a acurácia.',
    senior:
      'Escreva um critério de governança (quando usar, quando não usar) para IA aplicada no seu time.',
  },
  'risco-regulacao': {
    aspirante:
      'Descubra o limite real de cobertura do FGC hoje e o que ele cobre — e o que não cobre.',
    estagiario:
      'Identifique, num produto que você já usa, qual risco (crédito, mercado ou liquidez) é o mais relevante.',
    junior:
      'Explique para um colega o que muda no valor de um título quando ele é marcado a mercado.',
    pleno:
      'Mapeie o descasamento de liquidez de um fundo real entre o prazo de resgate e o prazo dos ativos.',
    senior:
      'Revise a governança de um modelo do seu time sob a ótica regulatória — não só a técnica.',
  },
};

type CtaHeadline = (dimensaoLabel: string) => string;

/** S7 — 15 copies de CTA (5 níveis × 3 classificações), referenciando a dimensão #1 de prioridade em runtime. */
export const CTA_HEADLINE: Record<SeniorityLevel, Record<Classification, CtaHeadline>> = {
  aspirante: {
    baixo: (d) =>
      `O primeiro passo para entrar no mercado é fechar a base em ${d} — comece por aí.`,
    medio: (d) =>
      `Sua base já existe — ${d} é onde fechar o gap muda o tipo de vaga que você consegue.`,
    alto: (d) =>
      `Sua base já está forte — hora de aprofundar em ${d} para chegar na frente na primeira posição.`,
  },
  estagiario: {
    baixo: (d) => `${d} é o gap mais urgente para sair do estágio para júnior — comece por aí.`,
    medio: (d) =>
      `Você já executa no estágio — reforçar ${d} é o que acelera a virada para júnior.`,
    alto: (d) =>
      `Você já está à frente do esperado no estágio — aprofundar em ${d} adianta o salto para júnior.`,
  },
  junior: {
    baixo: (d) => `${d} é hoje o que mais separa você do próximo degrau (pleno) — vale priorizar.`,
    medio: (d) => `Do júnior ao pleno, ${d} é o gap que mais pesa na sua evolução técnica.`,
    alto: (d) => `Você já opera com autonomia — aprofundar em ${d} é o que te aproxima do pleno.`,
  },
  pleno: {
    baixo: (d) =>
      `${d} é a lacuna que mais trava sua evolução de pleno para sênior — comece por aí.`,
    medio: (d) =>
      `Do pleno ao sênior, fechar o gap em ${d} é o que muda o tipo de análise que você entrega.`,
    alto: (d) =>
      `Você já estrutura análise complexa — aprofundar em ${d} te aproxima da cadeira de sênior.`,
  },
  senior: {
    baixo: (d) => `${d} é o que mais separa você da liderança técnica hoje — vale priorizar.`,
    medio: (d) => `Rumo à liderança técnica, ${d} é onde fechar o gap tem mais retorno.`,
    alto: (d) =>
      `Você já decide com autonomia — aprofundar em ${d} é o que sustenta a liderança técnica.`,
  },
};

/** S2 — 5 frases-resumo de formato de radar, por dimensão dominante (`diagnostico.fortes[0]`). */
export const RADAR_SUMMARY: Record<KnowledgeCategory, string> = {
  'mercados-produtos':
    'Seu perfil é mais forte em mercados e produtos — vale usar essa base para avançar nas demais dimensões avaliadas.',
  'matematica-quant':
    'Seu perfil é mais forte em matemática e leitura quantitativa — a oportunidade é levar esse rigor para as outras dimensões.',
  'dados-programacao':
    'Seu perfil é mais forte em dados e programação — um diferencial real que vale reforçar nas demais competências.',
  'ia-aplicada':
    'Seu perfil é mais forte em IA aplicada — uma frente ainda escassa no mercado, que vale sustentar com as demais dimensões.',
  'risco-regulacao':
    'Seu perfil é mais forte em risco e regulação — uma base sólida de governança para evoluir nas demais competências.',
};

/** S8 — rodapé de método (limitações declaradas, AVALIACAO.md §7), em linguagem acessível. */
export const METODOLOGIA_LIMITACOES =
  'Este diagnóstico usa 15 questões — suficiente para um retrato direcional, não para uma medida de precisão certificatória (a confiabilidade de um teste cresce com o número de itens; instrumentos certificatórios usam de 50 a 120). Múltipla escolha mede conhecimento e julgamento aplicado, não a habilidade prática de programar, modelar ou comunicar — por isso as recomendações são passos práticos, não um veredito de aprovação. A senioridade é autodeclarada: leia o resultado sempre em relação à expectativa do nível que você informou.';

/** S8 — corpo do modal/página "Como funciona a metodologia", condensado de AVALIACAO.md. */
export const METODOLOGIA_RESUMO: string[] = [
  'O Syntaxis Skill Check não mede "quanto você sabe de finanças" em abstrato — mede a distância entre o seu perfil atual e o perfil que o mercado espera para o próximo degrau da sua carreira. É essa moldura, "para um analista do seu nível, o mercado espera...", que dá sentido ao resultado.',
  'As 15 questões cobrem 5 dimensões de competência (Mercados & Produtos, Matemática & Quant, Dados & Programação, IA Aplicada e Risco & Regulação), com 3 itens por dimensão, calibradas para a expectativa de cada nível declarado — de aspirante a sênior.',
  'O quadro de competências foi ancorado em referenciais reconhecidos do mercado brasileiro: a nova grade de certificações da ANBIMA (por competência prática, não por cargo), o Candidate Body of Knowledge do CFA Institute e levantamentos de demanda técnica do setor financeiro, que combinam análise de dados, gestão de risco, regulação e IA aplicada.',
  'Cada dimensão carrega um peso de impacto diferente por nível — o quanto ela pesa para o próximo degrau, não para o nível atual. É esse peso, multiplicado pelo gap entre o seu score e a expectativa, que define as duas dimensões apontadas como prioridade no relatório.',
];
