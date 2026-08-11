import MailerLite from '@mailerlite/mailerlite-nodejs';
import type { Classification, SeniorityLevel } from './types';

export interface SyncLeadParams {
  email: string;
  name: string;
  seniority: SeniorityLevel;
  scoreGeral: number;
  classification: Classification;
  /**
   * Dimensão de maior prioridade de desenvolvimento (`diagnostico.prioridades[0].category`,
   * Épico 11). Reaproveita o campo `perfil_tecnico` já provisionado na conta
   * MailerLite (Épico 7) — a v1 usava esse campo para o profileTag da
   * pergunta de autoavaliação, removida no banco v2 (Épico 10).
   */
  topPriorityCategory?: string;
}

function getClient(): MailerLite | null {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return null;
  return new MailerLite({ api_key: apiKey });
}

/**
 * Sincroniza o lead com a MailerLite (upsert por e-mail). Todos os leads vão
 * para o mesmo grupo (MAILERLITE_GROUP_ID, "SYNTAXIS_SKILL_APP" na conta
 * real) — a classificação/senioridade/score são gravados como Campos
 * customizados no subscriber, não como segmentação por Grupo.
 *
 * Nunca lança para o chamador — falha aqui é sempre não-bloqueante: loga no
 * servidor e retorna, o resultado do quiz precisa ser exibido de qualquer
 * forma (regra crítica do produto).
 */
export async function syncLeadToMailerLite(params: SyncLeadParams): Promise<void> {
  const client = getClient();
  if (!client) {
    console.error(
      '[mailerlite] MAILERLITE_API_KEY não configurada — pulando sincronização do lead.',
    );
    return;
  }

  const groupId = process.env.MAILERLITE_GROUP_ID;
  const groups = groupId ? [groupId] : [];
  if (!groupId) {
    console.error('[mailerlite] MAILERLITE_GROUP_ID não configurado — subscriber sem grupo.');
  }

  try {
    await client.subscribers.createOrUpdate({
      email: params.email,
      fields: {
        name: params.name,
        seniority: params.seniority,
        score_geral: params.scoreGeral,
        classificacao: params.classification,
        perfil_tecnico: params.topPriorityCategory ?? '',
      },
      groups,
    });
  } catch (error) {
    console.error('[mailerlite] Falha ao sincronizar lead (não-bloqueante):', error);
  }
}
