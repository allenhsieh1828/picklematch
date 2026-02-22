-- ================================================================
-- PickleMatch — Supabase 資料庫建表腳本
-- 在 Supabase Dashboard > SQL Editor 執行此檔案
-- ================================================================

-- ── 1. profiles 表（用戶個人資料）──────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname      TEXT        NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  level         NUMERIC(2,1) NOT NULL DEFAULT 2.0 CHECK (level >= 2.0 AND level <= 5.0),
  bio           TEXT        CHECK (char_length(bio) <= 120),
  line_id       TEXT,
  instagram     TEXT,
  phone         TEXT,
  total_games   INTEGER     NOT NULL DEFAULT 0,
  hosted_games  INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. activities 表（球局）────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activities (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL CHECK (char_length(title) <= 30),
  location        TEXT        NOT NULL,
  location_url    TEXT,
  date            DATE        NOT NULL,
  time_start      TIME        NOT NULL,
  time_end        TIME        NOT NULL,
  level_min       NUMERIC(2,1) NOT NULL CHECK (level_min >= 2.0 AND level_min <= 5.0),
  level_max       NUMERIC(2,1) NOT NULL CHECK (level_max >= 2.0 AND level_max <= 5.0),
  max_players     INTEGER     NOT NULL CHECK (max_players >= 4 AND max_players <= 24),
  current_players INTEGER     NOT NULL DEFAULT 0,
  fee             INTEGER     NOT NULL DEFAULT 0 CHECK (fee >= 0),
  line_group_url  TEXT,
  host_id         UUID        NOT NULL REFERENCES public.profiles(id),
  host_name       TEXT        NOT NULL,
  status          TEXT        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'ended')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3. bookings 表（報名記錄）──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id   UUID        NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES public.profiles(id),
  user_nickname TEXT        NOT NULL,
  user_level    NUMERIC(2,1) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, user_id)  -- 防止重複報名
);

-- ================================================================
-- Row Level Security（RLS）
-- 控制誰可以讀取、修改哪些資料
-- ================================================================

-- 啟用 RLS
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings   ENABLE ROW LEVEL SECURITY;

-- ── profiles 的權限規則 ──
-- 所有人都可以讀取個人資料（公開頁面）
CREATE POLICY "profiles_read_all"
  ON public.profiles FOR SELECT
  USING (true);

-- 只有本人可以修改自己的資料
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── activities 的權限規則 ──
-- 所有人（含未登入）都可以讀取球局
CREATE POLICY "activities_read_all"
  ON public.activities FOR SELECT
  USING (true);

-- 登入用戶才能發起球局
CREATE POLICY "activities_insert_auth"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = host_id);

-- 只有發起人可以修改自己的球局
CREATE POLICY "activities_update_own"
  ON public.activities FOR UPDATE
  USING (auth.uid() = host_id);

-- ── bookings 的權限規則 ──
-- 所有人可以讀取報名名單
CREATE POLICY "bookings_read_all"
  ON public.bookings FOR SELECT
  USING (true);

-- 登入用戶才能報名
CREATE POLICY "bookings_insert_auth"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 只有本人可以取消自己的報名
CREATE POLICY "bookings_delete_own"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================================
-- 自動觸發器
-- ================================================================

-- 新用戶註冊時，自動在 profiles 表建立一筆記錄
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname, level, total_games, hosted_games)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    2.0, 0, 0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 綁定觸發器到 auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- 測試資料（選填，可跳過）
-- ================================================================
-- 如果你想加入一些示範球局，可以先用真實帳號登入後，
-- 再從 Supabase Dashboard > Table Editor 手動新增，
-- 或是從前端發起球局功能新增。
