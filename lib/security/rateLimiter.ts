// lib/security/rateLimiter.ts
// ══════════════════════════════════════════════════════════════════
// 第二層：應用層防護 — 速率限制（Rate Limiting）
// 使用「滑動視窗」演算法，比固定視窗更精準
//
// 原理：記錄每個 IP 在「過去 N 秒內」的請求時間戳
//       若超過上限就拒絕，時間戳過期就自動清除
// ══════════════════════════════════════════════════════════════════

interface WindowEntry {
  timestamps: number[]; // 請求時間戳陣列（ms）
}

// 記憶體儲存：ip → 時間戳紀錄
// 注意：這是單機方案，多機部署請換成 Redis
const store = new Map<string, WindowEntry>();

// 定期清理過期 IP（避免記憶體洩漏）
setInterval(() => {
  const now = Date.now();
  // 使用 forEach 以避免編譯器需要 downlevelIteration
  store.forEach((entry, key) => {
    // 如果最後一筆請求超過 10 分鐘前，刪除整筆記錄
    if (entry.timestamps.length === 0 || now - entry.timestamps[entry.timestamps.length - 1] > 600_000) {
      store.delete(key);
    }
  });
}, 60_000); // 每分鐘清理一次

export interface RateLimitConfig {
  windowMs: number; // 時間視窗（毫秒）
  max:      number; // 視窗內最大請求數
  message:  string; // 超限時的錯誤訊息
}

// 預設設定組合
export const RATE_LIMITS = {
  // 登入 API：15 分鐘內最多嘗試 10 次（防暴力破解）
  login: {
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: '登入嘗試次數過多，請 15 分鐘後再試',
  },

  // 報名 API：1 分鐘內最多 5 次（防惡意刷票）
  booking: {
    windowMs: 60 * 1000,
    max: 5,
    message: '操作過於頻繁，請稍後再試',
  },

  // 發起球局 API：1 小時內最多 10 場（防洗版）
  hostActivity: {
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: '發起球局次數過多，請 1 小時後再試',
  },

  // 一般 API：1 分鐘內最多 60 次（整體保護）
  general: {
    windowMs: 60 * 1000,
    max: 60,
    message: '請求過於頻繁，請稍後再試',
  },
} satisfies Record<string, RateLimitConfig>;

/**
 * 檢查 IP 是否超過速率限制
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(ip: string, config: RateLimitConfig) {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // 取得或建立該 IP 的記錄
  const entry = store.get(ip) ?? { timestamps: [] };

  // 移除視窗外的舊時間戳（滑動視窗的核心）
  entry.timestamps = entry.timestamps.filter(t => t > windowStart);

  const count = entry.timestamps.length;
  const allowed = count < config.max;

  if (allowed) {
    // 允許：記錄這次請求
    entry.timestamps.push(now);
    store.set(ip, entry);
  }

  // 計算重置時間：最舊的時間戳 + 視窗長度
  const resetAt = entry.timestamps.length > 0
    ? entry.timestamps[0] + config.windowMs
    : now + config.windowMs;

  return {
    allowed,
    remaining: Math.max(0, config.max - entry.timestamps.length),
    resetAt,
    retryAfter: Math.ceil((resetAt - now) / 1000), // 秒
  };
}

/**
 * 從 Request 取得真實 IP
 * 部署在 Vercel / Cloudflare 等反向代理後，IP 在 header 裡
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;

  // Cloudflare
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  // Vercel / 一般反向代理
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  // 本機開發 fallback
  return '127.0.0.1';
}

/**
 * 建立速率限制的 Response Headers
 * 讓前端知道剩餘次數和重置時間
 */
export function rateLimitHeaders(result: ReturnType<typeof checkRateLimit>, config: RateLimitConfig) {
  return {
    'X-RateLimit-Limit':     String(config.max),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset':     String(Math.ceil(result.resetAt / 1000)),
    ...(result.allowed ? {} : { 'Retry-After': String(result.retryAfter) }),
  };
}
