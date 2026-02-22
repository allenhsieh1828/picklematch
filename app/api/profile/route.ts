import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizeProfileBody } from '@/lib/security/sanitize';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: '未登入' }, { status: 401 });

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: '未登入' }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 }); }

  // 輸入清洗
  const sanitized = sanitizeProfileBody(body);
  if (!sanitized.ok) return NextResponse.json({ error: sanitized.error }, { status: 400 });

  // RLS 確保只能更新自己的資料
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...sanitized.data, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
