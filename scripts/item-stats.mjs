#!/usr/bin/env node
/**
 * Telemetria de itens (Épico 13, docs/metodologia.md §7): agrega os logs
 * estruturados `[diagnostico]` (gravados por lib/diagnostico/persist-diagnostico.ts
 * a cada submissão) em taxa de acerto e distribuição por alternativa, por
 * item e por nível — a base de dados para a análise psicométrica periódica.
 *
 * Uso:
 *   node scripts/item-stats.mjs caminho/para/logs.ndjson
 *   vercel logs --json <deployment> | node scripts/item-stats.mjs
 *   (sem argumento, lê de stdin)
 *
 * Cada linha de entrada pode ser: (a) uma linha de log crua contendo
 * "[diagnostico] {...}" em algum ponto do texto (ex.: `vercel logs` prefixa
 * timestamp/nível), ou (b) o JSON puro em si. Linhas sem o marcador são
 * ignoradas silenciosamente — logs de produção têm muito ruído não relacionado.
 *
 * Saída: CSV em stdout, uma linha por (item × nível), pronta para abrir em
 * planilha ou redirecionar para arquivo.
 */
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const DIAGNOSTICO_MARKER = '[diagnostico]';

function extractDiagnosticoPayload(line) {
  const markerIndex = line.indexOf(DIAGNOSTICO_MARKER);
  if (markerIndex === -1) return null;

  const jsonStart = line.indexOf('{', markerIndex);
  if (jsonStart === -1) return null;

  try {
    return JSON.parse(line.slice(jsonStart));
  } catch {
    return null;
  }
}

async function readInput(path) {
  const source = path ? createReadStream(path, { encoding: 'utf-8' }) : process.stdin;
  const rl = createInterface({ input: source, crlfDelay: Infinity });

  const records = [];
  for await (const line of rl) {
    const payload = extractDiagnosticoPayload(line);
    if (payload?.seniority && Array.isArray(payload?.respostas)) {
      records.push(payload);
    }
  }
  return records;
}

function aggregate(records) {
  /** @type {Map<string, { questionId: string, seniority: string, category: string, total: number, correct: number, options: Map<string, number> }>} */
  const stats = new Map();

  for (const record of records) {
    for (const resposta of record.respostas) {
      const key = `${resposta.questionId}::${record.seniority}`;
      let entry = stats.get(key);
      if (!entry) {
        entry = {
          questionId: resposta.questionId,
          seniority: record.seniority,
          category: resposta.category,
          total: 0,
          correct: 0,
          options: new Map(),
        };
        stats.set(key, entry);
      }

      entry.total += 1;
      if (resposta.correct) entry.correct += 1;
      if (resposta.optionId) {
        entry.options.set(resposta.optionId, (entry.options.get(resposta.optionId) ?? 0) + 1);
      }
    }
  }

  return [...stats.values()].sort(
    (a, b) => a.questionId.localeCompare(b.questionId) || a.seniority.localeCompare(b.seniority),
  );
}

function formatOptionDistribution(options) {
  return [...options.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([optionId, count]) => `${optionId}:${count}`)
    .join(' ');
}

function toCsv(rows) {
  const header = [
    'item',
    'nivel',
    'dimensao',
    'respostas',
    'acertos',
    'taxa_acerto',
    'distribuicao_alternativas',
  ];
  const lines = [header.join(',')];

  for (const row of rows) {
    const taxaAcerto = row.total === 0 ? 0 : Math.round((row.correct / row.total) * 1000) / 10;
    lines.push(
      [
        row.questionId,
        row.seniority,
        row.category,
        row.total,
        row.correct,
        `${taxaAcerto}%`,
        `"${formatOptionDistribution(row.options)}"`,
      ].join(','),
    );
  }

  return lines.join('\n');
}

const inputPath = process.argv[2];
const records = await readInput(inputPath);

if (records.length === 0) {
  console.error(
    'Nenhum registro "[diagnostico]" encontrado na entrada. Verifique a fonte dos logs (vercel logs, arquivo salvo, etc.).',
  );
  process.exitCode = 1;
} else {
  const rows = aggregate(records);
  console.log(toCsv(rows));
  console.error(
    `\n${records.length} submissões processadas, ${rows.length} combinações item×nível. ` +
      'Revisão sugerida (docs/metodologia.md §7): item com taxa_acerto > 90% ou < 25% no nível-alvo, ' +
      'ou alguma alternativa escolhida por < 5% dos respondentes (distrator morto).',
  );
}
