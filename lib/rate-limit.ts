const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

/**
 * Rate limiting básico em memória (por IP, janela deslizante). Suficiente
 * para conter abuso/spam de submissões no estágio atual do produto, mas tem
 * uma limitação conhecida: o Map só é compartilhado dentro de uma mesma
 * instância de servidor. Em produção serverless (Vercel), cada instância
 * fria/região tem seu próprio contador — não é uma proteção distribuída.
 * Se o abuso real justificar, evoluir para um store compartilhado
 * (ex: Upstash Redis) é o próximo passo natural.
 */
const requestTimestampsByIp = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

export function checkRateLimit(identifier: string, now: number = Date.now()): RateLimitResult {
  const recentTimestamps = (requestTimestampsByIp.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  const allowed = recentTimestamps.length < MAX_REQUESTS_PER_WINDOW;
  if (allowed) {
    recentTimestamps.push(now);
  }
  requestTimestampsByIp.set(identifier, recentTimestamps);

  return { allowed, remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - recentTimestamps.length) };
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
