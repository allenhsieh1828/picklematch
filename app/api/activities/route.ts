import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp, rateLimitHeaders, RATE_LIMITS } from '@/lib/security/rateLimiter';
import { sanitizeActivityBody } from '@/lib/security/sanitize';

// GET /api/activities
export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/activities — 發起球局（速率限制 + 輸入清洗）
export async function POST(request: Request) {
  const supabase = createClient();

  // ── 1. 驗證登入 ──────────────────────────────────────────────
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 });
  }

  // ── 2. 速率限制：1 小時內最多發起 10 場 ──────────────────────
  const ip = getClientIp(request);
  const rateKey = `host:${user.id}`; // 用 user ID 而不是 IP，更精準
  const rateResult = checkRateLimit(rateKey, RATE_LIMITS.hostActivity);
  const rateHeaders = rateLimitHeaders(rateResult, RATE_LIMITS.hostActivity);

  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: RATE_LIMITS.hostActivity.message },
      { status: 429, headers: rateHeaders }
    );
  }

  // ── 3. 輸入清洗與驗證 ─────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 });
  }

  const sanitized = sanitizeActivityBody(body);
  if (!sanitized.ok) {
    return NextResponse.json({ error: sanitized.error }, { status: 400 });
  }

  // ── 4. 取得用戶暱稱 ──────────────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname')
    .eq('id', user.id)
    .single();

  // ── 5. 寫入資料庫 ────────────────────────────────────────────
  const { data, error } = await supabase
    .from('activities')
    .insert({
      ...sanitized.data,
      host_id:   user.id,
      host_name: profile?.nickname ?? '匿名',
      status:    'open',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 發起人自動報名
  await supabase.from('bookings').insert({
    activity_id:   data.id,
    user_id:       user.id,
    user_nickname: profile?.nickname ?? '匿名',
    user_level:    sanitized.data!.level_min,
  });

  return NextResponse.json(data, { status: 201, headers: rateHeaders });
}
