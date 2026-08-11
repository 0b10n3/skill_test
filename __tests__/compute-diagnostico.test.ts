import { describe, expect, it } from 'vitest';
import { computeDiagnostico } from '@/lib/diagnostico';
import type { AnswerMap, KnowledgeCategory, Question } from '@/lib/types';

const DIMENSIONS: KnowledgeCategory[] = [
  'mercados-produtos',
  'matematica-quant',
  'dados-programacao',
  'ia-aplicada',
  'risco-regulacao',
];

/** Monta um banco de 15 perguntas (3 por dimensão) e as respostas que produzem `acertosPorDimensao`. */
function buildScenario(acertosPorDimensao: Record<KnowledgeCategory, number>): {
  banco: Question[];
  respostas: AnswerMap;
} {
  const banco: Question[] = [];
  const respostas: AnswerMap = {};

  for (const category of DIMENSIONS) {
    const correctCount = acertosPorDimensao[category];
    for (let i = 0; i < 3; i += 1) {
      const id = `${category}-${i}`;
      banco.push({
        id,
        type: 'knowledge',
        category,
        targetSeniority: ['pleno'],
        question: `Pergunta ${i} sobre ${category}, tema específico ${i}?`,
        options: [
          { id: 'a', text: 'A' },
          { id: 'b', text: 'B' },
          { id: 'c', text: 'C' },
          { id: 'd', text: 'D' },
        ],
        correctOptionId: 'a',
        explanation: 'explicação',
      });
      respostas[id] = i < correctCount ? 'a' : 'b';
    }
  }

  return { banco, respostas };
}

function allDimensions(value: number): Record<KnowledgeCategory, number> {
  return Object.fromEntries(DIMENSIONS.map((d) => [d, value])) as Record<KnowledgeCategory, number>;
}

/** Distribui `total` acertos entre as 5 dimensões, no máximo 3 por dimensão. */
function distribute(total: number): Record<KnowledgeCategory, number> {
  let remaining = total;
  const dist = {} as Record<KnowledgeCategory, number>;
  for (const category of DIMENSIONS) {
    const value = Math.min(3, remaining);
    dist[category] = value;
    remaining -= value;
  }
  return dist;
}

describe('computeDiagnostico — classificação global (fronteiras exatas)', () => {
  it.each([
    [0, 'baixo'],
    [6, 'baixo'],
    [7, 'medio'],
    [11, 'medio'],
    [12, 'alto'],
    [15, 'alto'],
  ] as const)('%i acertos em 15 → classificação "%s"', (totalAcertos, expected) => {
    const { banco, respostas } = buildScenario(distribute(totalAcertos));
    const diagnostico = computeDiagnostico(respostas, 'pleno', banco);

    expect(diagnostico.acertos).toBe(totalAcertos);
    expect(diagnostico.classificacao).toBe(expected);
  });
});

describe('computeDiagnostico — fórmula de prioridade (AVALIACAO.md §5.4)', () => {
  it('caso de regressão: pleno com 1/3 em dados-programacao e 0/3 em ia-aplicada → ia-aplicada é a prioridade #1', () => {
    const dist = allDimensions(3);
    dist['dados-programacao'] = 1;
    dist['ia-aplicada'] = 0;
    const { banco, respostas } = buildScenario(dist);

    const diagnostico = computeDiagnostico(respostas, 'pleno', banco);

    const dados = diagnostico.prioridades.find((p) => p.category === 'dados-programacao')!;
    const ia = diagnostico.prioridades.find((p) => p.category === 'ia-aplicada')!;

    // dados: (1 − 0.33) × 0.25 = 0.1675 | ia: (1 − 0) × 0.20 = 0.20
    expect(dados.prioridade).toBeCloseTo(0.1675, 4);
    expect(ia.prioridade).toBeCloseTo(0.2, 4);
    expect(diagnostico.prioridades[0].category).toBe('ia-aplicada');
  });

  it('prioridades sempre cobrem as 5 dimensões, ordenadas decrescente', () => {
    const { banco, respostas } = buildScenario(distribute(9));
    const diagnostico = computeDiagnostico(respostas, 'senior', banco);

    expect(diagnostico.prioridades).toHaveLength(5);
    for (let i = 1; i < diagnostico.prioridades.length; i += 1) {
      expect(diagnostico.prioridades[i - 1].prioridade).toBeGreaterThanOrEqual(
        diagnostico.prioridades[i].prioridade,
      );
    }
  });
});

describe('computeDiagnostico — fortes/atencao: regras de desempate e não-vazio', () => {
  it('quando todas as dimensões empatam, fortes e atencao são escolhidos pelo desempate de peso de impacto (nunca vazios)', () => {
    const { banco, respostas } = buildScenario(allDimensions(2)); // 2/3 = 0.67 em todas
    const diagnostico = computeDiagnostico(respostas, 'pleno', banco);

    expect(diagnostico.fortes.length).toBeGreaterThanOrEqual(1);
    expect(diagnostico.atencao.length).toBeGreaterThanOrEqual(1);
    // pleno: dados-programacao tem o maior peso de impacto (0.25) — desempate deveria favorecê-la
    expect(diagnostico.fortes).toContain('dados-programacao');
  });

  it('cobre todas as 1024 combinações possíveis de acertos por dimensão (0–3 em cada uma das 5) sem listas vazias', () => {
    const values = [0, 1, 2, 3];
    let combosChecked = 0;

    for (const a of values) {
      for (const b of values) {
        for (const c of values) {
          for (const d of values) {
            for (const e of values) {
              const dist = Object.fromEntries(
                DIMENSIONS.map((dim, i) => [dim, [a, b, c, d, e][i]]),
              ) as Record<KnowledgeCategory, number>;
              const { banco, respostas } = buildScenario(dist);
              const diagnostico = computeDiagnostico(respostas, 'junior', banco);

              expect(diagnostico.fortes.length).toBeGreaterThanOrEqual(1);
              expect(diagnostico.fortes.length).toBeLessThanOrEqual(2);
              expect(diagnostico.atencao.length).toBeGreaterThanOrEqual(1);
              expect(diagnostico.atencao.length).toBeLessThanOrEqual(2);
              combosChecked += 1;
            }
          }
        }
      }
    }

    expect(combosChecked).toBe(1024);
  });
});

describe('computeDiagnostico — extremos e pureza', () => {
  it('não lança para os extremos 0/15 e 15/15, e é pura (mesma entrada → mesma saída)', () => {
    for (const total of [0, 15]) {
      const { banco, respostas } = buildScenario(distribute(total));

      expect(() => computeDiagnostico(respostas, 'senior', banco)).not.toThrow();

      const first = computeDiagnostico(respostas, 'senior', banco);
      const second = computeDiagnostico(respostas, 'senior', banco);
      expect(second).toEqual(first);
    }
  });

  it('0/15 classifica como "baixo" e 15/15 como "alto"', () => {
    const zero = buildScenario(distribute(0));
    const full = buildScenario(distribute(15));

    expect(computeDiagnostico(zero.respostas, 'aspirante', zero.banco).classificacao).toBe('baixo');
    expect(computeDiagnostico(full.respostas, 'aspirante', full.banco).classificacao).toBe('alto');
  });
});

describe('computeDiagnostico — ordem determinística de dimensoes/prioridades (Épico 18)', () => {
  it('dimensoes/prioridades saem em ordem canônica mesmo com o banco embaralhado por categoria', () => {
    const { banco, respostas } = buildScenario(allDimensions(3));

    // Embaralha o banco por categoria (simula lib/quiz-selection.ts sorteando
    // a ordem das perguntas por sessão) — mantém as respostas intactas,
    // apenas reordena `banco`, que é o único input de onde computeDimensoes
    // deriva a ordem das categorias.
    const shuffledBanco = [...banco].sort((a, b) => (a.id < b.id ? 1 : -1));
    expect(shuffledBanco.map((q) => q.category)).not.toEqual(banco.map((q) => q.category));

    const canonical = computeDiagnostico(respostas, 'pleno', banco);
    const shuffled = computeDiagnostico(respostas, 'pleno', shuffledBanco);

    expect(shuffled.dimensoes.map((d) => d.category)).toEqual(
      canonical.dimensoes.map((d) => d.category),
    );
    expect(shuffled.prioridades.map((p) => p.category)).toEqual(
      canonical.prioridades.map((p) => p.category),
    );
  });
});

describe('computeDiagnostico — topicosParaRevisar', () => {
  it('lista temas das questões erradas nas dimensões de atenção, nunca "questão X"', () => {
    const dist = allDimensions(3);
    dist['risco-regulacao'] = 0; // toda a dimensão errada → vira atencao
    const { banco, respostas } = buildScenario(dist);

    const diagnostico = computeDiagnostico(respostas, 'senior', banco);

    expect(diagnostico.atencao).toContain('risco-regulacao');
    expect(diagnostico.topicosParaRevisar.length).toBeGreaterThan(0);
    for (const topic of diagnostico.topicosParaRevisar) {
      expect(topic).not.toMatch(/quest[aã]o/i);
    }
  });
});
