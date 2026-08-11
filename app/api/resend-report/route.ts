import { NextResponse, type NextRequest } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { resendReportSchema } from '@/lib/validations';
import { syncLeadToMailerLite } from '@/lib/mailerlite';

/**
 * Botão "Receber este relatório por e-mail" (S7) — reforço do opt-in já
 * dado em /lead, não uma nova coleta. Re-sincroniza os campos do subscriber
 * na MailerLite (idempotente); o envio do e-mail em si é responsabilidade
 * da automação configurada no painel da MailerLite, disparada por essa
 * atualização de campo (ver README, seção MailerLite).
 */
export async function POST(request: NextRequest) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas em pouco tempo. Tente novamente em instantes.' },
      { status: 429 },
    );
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const parsed = resendReportSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Payload inválido', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  await syncLeadToMailerLite(parsed.data);

  return NextResponse.json({ ok: true });
}
