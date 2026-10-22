const buckets = new Map();

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  current.count += 1;
  return { allowed: current.count <= limit, remaining: Math.max(0, limit - current.count) };
}

export function requestIp(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

export function validOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const allowed = [process.env.APP_URL, process.env.NEXTAUTH_URL, process.env.NEXT_PUBLIC_SITE_URL].filter(Boolean);
  return allowed.some((base) => {
    try { return new URL(base).origin === origin; } catch { return false; }
  });
}

export function jsonError(message, status = 400, details) {
  return Response.json({ ok: false, error: message, details }, { status });
}
