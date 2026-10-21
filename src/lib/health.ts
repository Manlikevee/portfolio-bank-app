export type Health = { state: 'checking' | 'up' | 'down'; at: number; ms?: number; code?: number };

export const normalizeUrl = (u: string) => (/^https?:\/\//i.test(u.trim()) ? u.trim() : `https://${u.trim()}`);

/** Any HTTP response below 500 counts as reachable (APIs often answer 401/404 on "/"). */
export async function checkUrl(url: string, timeoutMs = 8000): Promise<Health> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();
  try {
    const res = await fetch(normalizeUrl(url), { method: 'GET', signal: controller.signal });
    return { state: res.status < 500 ? 'up' : 'down', at: Date.now(), ms: Date.now() - start, code: res.status };
  } catch {
    return { state: 'down', at: Date.now() };
  } finally {
    clearTimeout(timer);
  }
}
