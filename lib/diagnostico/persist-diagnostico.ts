import type { Diagnostico } from './types';
import type { SeniorityLevel } from '@/lib/types';

export interface PersistDiagnosticoParams {
  seniority: SeniorityLevel;
  diagnostico: Diagnostico;
}

/**
 * Registra o diagnóstico completo e o vetor item-a-item (id do item +
 * alternativa escolhida) nos logs do servidor — base de dados para a
 * telemetria de itens e a análise psicométrica periódica do Épico 13
 * (AVALIACAO.md §6: taxa de acerto e distribuição por alternativa, por item
 * e por nível). Sem PII: nem e-mail nem nome do lead trafegam aqui.
 *
 * Interino por design: este app não tem banco de dados hoje; o Épico 13 é
 * quem decide a origem de dados real do script `item-stats` (ex.: um
 * provider de log queryable da Vercel, ou uma tabela dedicada). Até lá,
 * `console.log` estruturado em produção já é inspecionável via
 * `vercel logs` / painel de logs.
 */
export function persistDiagnostico({ seniority, diagnostico }: PersistDiagnosticoParams): void {
  console.log(
    '[diagnostico]',
    JSON.stringify({
      seniority,
      scoreGlobal: diagnostico.scoreGlobal,
      acertos: diagnostico.acertos,
      totalQuestoes: diagnostico.totalQuestoes,
      classificacao: diagnostico.classificacao,
      dimensoes: diagnostico.dimensoes,
      prioridades: diagnostico.prioridades,
      respostas: diagnostico.respostas,
    }),
  );
}
