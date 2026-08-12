const WINDOW_MS = 60_000;
// RATE_LIMIT_MAX_REQUESTS (Épico 19): só é setada pelo `webServer.command`
// do playwright.config.ts, para o servidor local que o próprio Playwright
// sobe — nunca por um deployment real (Vercel/produção, alvo do
// PLAYWRIGHT_BASE_URL em test:e2e:remote). Motivo: toda a suíte e2e
// roda de um único IP (localhost), então o volume normal e legítimo de
// submissões de teste (~20 por rodada completa, todas de rotas
// diferentes) passou a colidir com o limite de produção — achado real ao
// rodar a suíte completa após somar cobertura de tema escuro (Épico 19).
const MAX_REQUESTS_PER_WINDOW = process.env.RATE_LIMIT_MAX_REQUESTS
  ? Number(process.env.RATE_LIMIT_MAX_REQUESTS)
  : 10;

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
