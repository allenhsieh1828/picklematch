import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// 惡意 Bot 黑名單
const BOT_BLACKLIST = ['sqlmap','nikto','nmap','masscan','zgrab','python-requests/2.18','go-http-client/1.1'];

// 簡易 API 速率限制（Middleware 層）
const apiHits = new Map<string, { count: number; resetAt: number }>();
function middlewareRateLimit(ip: string, windowMs = 60_000, max = 120): boolean {
  const now = Date.now();
  const entry = apiHits.get(ip);
  if (!entry || now > entry.resetAt) { apiHits.set(ip, { count: 1, resetAt: now + windowMs }); return true; }
  entry.count++;
  return entry.count <= max;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 惡意 Bot 過濾
  const ua = (request.headers.get('user-agent') ?? '').toLowerCase();
  if (BOT_BLACKLIST.some(bot => ua.includes(bot))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // 2. API 整體速率保護
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('cf-connecting-ip')
      || request.headers.get('x-forwarded-for')?.split(',')[0].trim()
      || '127.0.0.1';
    if (!middlewareRateLimit(ip)) {
      return NextResponse.json({ error: '請求過於頻繁，請稍後再試' }, { status: 429, headers: { 'Retry-After': '60' } });
    }
  }

  // 3. Supabase Session 刷新
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );
  await supabase.auth.getUser();
  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
