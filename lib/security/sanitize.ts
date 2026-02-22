// lib/security/sanitize.ts
// ══════════════════════════════════════════════════════════════════
// 第二層：輸入驗證與清洗
// 防止 XSS（跨站腳本）和特殊字元注入
// ══════════════════════════════════════════════════════════════════

/**
 * 移除 HTML 標籤，防止 XSS
 * 例：'<script>alert(1)</script>' → 'alert(1)'
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim();
}

/**
 * 清洗並驗證文字欄位
 */
export function sanitizeText(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  return stripHtml(input).slice(0, maxLength);
}

/**
 * 驗證 Email 格式
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/**
 * 驗證 URL 格式（只允許 http/https）
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * 驗證數字範圍
 */
export function isInRange(value: unknown, min: number, max: number): boolean {
  const n = Number(value);
  return !isNaN(n) && n >= min && n <= max;
}

/**
 * 清洗發起球局的 body（完整驗證所有欄位）
 * 回傳 { ok, data, error }
 */
export function sanitizeActivityBody(body: Record<string, unknown>) {
  const title = sanitizeText(body.title, 30);
  if (!title) return { ok: false, error: '活動標題不能為空' };

  const location = sanitizeText(body.location, 100);
  if (!location) return { ok: false, error: '場地名稱不能為空' };

  const locationUrl = body.locationUrl ? sanitizeText(body.locationUrl as string, 500) : '';
  if (locationUrl && !isValidUrl(locationUrl)) {
    return { ok: false, error: '地址連結格式不正確' };
  }

  const date = sanitizeText(body.date as string, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: '日期格式不正確' };

  const timeStart = sanitizeText(body.timeStart as string, 5);
  const timeEnd   = sanitizeText(body.timeEnd as string, 5);
  if (!/^\d{2}:\d{2}$/.test(timeStart) || !/^\d{2}:\d{2}$/.test(timeEnd)) {
    return { ok: false, error: '時間格式不正確' };
  }
  if (timeStart >= timeEnd) return { ok: false, error: '結束時間必須晚於開始時間' };

  if (!isInRange(body.levelMin, 2.0, 5.0)) return { ok: false, error: '最低程度範圍不合法' };
  if (!isInRange(body.levelMax, 2.0, 5.0)) return { ok: false, error: '最高程度範圍不合法' };
  if (Number(body.levelMin) > Number(body.levelMax)) return { ok: false, error: '最低程度不能高於最高程度' };

  if (!isInRange(body.maxPlayers, 4, 24)) return { ok: false, error: '人數上限須在 4～24 之間' };
  if (!isInRange(body.fee, 0, 2000))      return { ok: false, error: '費用須在 0～2000 之間' };

  const lineGroupUrl = body.lineGroupUrl ? sanitizeText(body.lineGroupUrl as string, 500) : '';
  if (lineGroupUrl && !isValidUrl(lineGroupUrl)) {
    return { ok: false, error: 'Line 群組連結格式不正確' };
  }

  return {
    ok: true,
    data: {
      title, location,
      location_url:   locationUrl || null,
      date,
      time_start:     timeStart,
      time_end:       timeEnd,
      level_min:      Number(body.levelMin),
      level_max:      Number(body.levelMax),
      max_players:    Number(body.maxPlayers),
      fee:            Number(body.fee),
      line_group_url: lineGroupUrl || null,
    },
  };
}

/**
 * 清洗個人資料更新的 body
 */
export function sanitizeProfileBody(body: Record<string, unknown>) {
  const nickname = sanitizeText(body.nickname, 20);
  if (!nickname) return { ok: false, error: '暱稱不能為空' };

  return {
    ok: true,
    data: {
      nickname,
      full_name:  body.full_name  ? sanitizeText(body.full_name  as string, 50)  : null,
      bio:        body.bio        ? sanitizeText(body.bio         as string, 120) : null,
      level:      isInRange(body.level, 2.0, 5.0) ? Number(body.level) : 2.0,
      line_id:    body.line_id    ? sanitizeText(body.line_id    as string, 50)  : null,
      instagram:  body.instagram  ? sanitizeText(body.instagram  as string, 50)  : null,
      phone:      body.phone      ? sanitizeText(body.phone       as string, 20)  : null,
      avatar_url: body.avatar_url ? sanitizeText(body.avatar_url as string, 2000): null,
    },
  };
}
