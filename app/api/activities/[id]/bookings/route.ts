import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkRateLimit, getClientIp, rateLimitHeaders, RATE_LIMITS } from '@/lib/security/rateLimiter';

// POST /api/activities/[id]/bookings — 報名（速率限制）
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  // 1. 驗證登入
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: '請先登入才能報名' }, { status: 401 });
  }

  // 2. 速率限制：1 分鐘內最多 5 次報名操作
  const rateKey = `booking:${user.id}`;
  const rateResult = checkRateLimit(rateKey, RATE_LIMITS.booking);
  const rateHeaders = rateLimitHeaders(rateResult, RATE_LIMITS.booking);

  if (!rateResult.allowed) {
    return NextResponse.json(
      { error: RATE_LIMITS.booking.message },
      { status: 429, headers: rateHeaders }
    );
  }

  // 3. 驗證 activityId 格式（UUID）
  const activityId = params.id;
  if (!/^[0-9a-f-]{36}$/i.test(activityId)) {
    return NextResponse.json({ error: '無效的球局 ID' }, { status: 400 });
  }

  // 4. 呼叫 Supabase RPC（atomic 原子性報名，防超額）
  const { data, error } = await supabase.rpc('book_activity', {
    p_activity_id: activityId,
    p_user_id:     user.id,
  });

  if (error) {
    // 把資料庫的錯誤訊息對應成中文
    const msg = error.message.includes('已額滿')   ? '此球局已額滿'
              : error.message.includes('已報名')   ? '你已經報名過此球局'
              : error.message.includes('不存在')   ? '找不到此球局'
              : '報名失敗，請再試一次';
    return NextResponse.json({ error: msg }, { status: 409, headers: rateHeaders });
  }

  return NextResponse.json({ success: true, currentPlayers: data }, { headers: rateHeaders });
}

// DELETE /api/activities/[id]/bookings — 取消報名
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: '請先登入' }, { status: 401 });
  }

  const activityId = params.id;
  if (!/^[0-9a-f-]{36}$/i.test(activityId)) {
    return NextResponse.json({ error: '無效的球局 ID' }, { status: 400 });
  }

  // RLS 已確保只能刪除自己的報名
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('activity_id', activityId)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 更新人數
  const { data: activity } = await supabase
    .from('activities')
    .select('current_players')
    .eq('id', activityId)
    .single();

  if (activity) {
    await supabase.from('activities').update({
      current_players: Math.max(0, activity.current_players - 1),
      status: 'open',
    }).eq('id', activityId);
  }

  return NextResponse.json({ success: true });
}
