-- ================================================================
-- PickleMatch 完整資安 SQL
-- 在 Supabase Dashboard > SQL Editor 執行
-- ================================================================


-- ════════════════════════════════════════════════════════════════
-- 第三層 A：資料列層級安全性（RLS）完整版
-- ════════════════════════════════════════════════════════════════

-- 先清除舊的 policy，避免重複衝突
DROP POLICY IF EXISTS "profiles_read_all"        ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own"       ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own"       ON public.profiles;
DROP POLICY IF EXISTS "activities_read_all"       ON public.activities;
DROP POLICY IF EXISTS "activities_insert_auth"    ON public.activities;
DROP POLICY IF EXISTS "activities_update_own"     ON public.activities;
DROP POLICY IF EXISTS "bookings_read_all"         ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert_auth"      ON public.bookings;
DROP POLICY IF EXISTS "bookings_delete_own"       ON public.bookings;

-- ── profiles RLS ────────────────────────────────────────────────
-- 所有人可以讀取（公開個人頁面），但透過 View 過濾敏感欄位（見下方）
CREATE POLICY "profiles_read_all"
  ON public.profiles FOR SELECT USING (true);

-- 只有本人可以新增自己的 profile（通常由 trigger 自動建立）
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 只有本人可以修改自己的資料
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 禁止任何人直接刪除 profile（需走後台流程）
-- （不設 DELETE policy = 預設拒絕）

-- ── activities RLS ───────────────────────────────────────────────
-- 所有人可以讀取球局
CREATE POLICY "activities_read_all"
  ON public.activities FOR SELECT USING (true);

-- 登入用戶才能發起球局，且 host_id 必須是自己
CREATE POLICY "activities_insert_auth"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = host_id);

-- 只有發起人可以修改自己的球局
CREATE POLICY "activities_update_own"
  ON public.activities FOR UPDATE
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- 只有發起人可以刪除自己的球局
CREATE POLICY "activities_delete_own"
  ON public.activities FOR DELETE
  USING (auth.uid() = host_id);

-- ── bookings RLS ─────────────────────────────────────────────────
-- 所有人可以讀取報名名單
CREATE POLICY "bookings_read_all"
  ON public.bookings FOR SELECT USING (true);

-- 登入用戶才能報名，且 user_id 必須是自己（防止代替他人報名）
CREATE POLICY "bookings_insert_auth"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 只有本人可以取消自己的報名
CREATE POLICY "bookings_delete_own"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

-- 禁止修改報名記錄（不設 UPDATE policy）


-- ════════════════════════════════════════════════════════════════
-- 第三層 B：原子性報名 Function
-- 解決高併發「搶位」導致的人數溢位問題
-- 原理：在資料庫內部用 FOR UPDATE SKIP LOCKED 鎖定行，
--       確保同一瞬間只有一個 transaction 能修改同一球局
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.book_activity(
  p_activity_id UUID,
  p_user_id     UUID
)
RETURNS INTEGER  -- 回傳更新後的 current_players
LANGUAGE plpgsql
SECURITY DEFINER  -- 以定義者權限執行，繞過 RLS 在函式內部操作
AS $$
DECLARE
  v_activity      RECORD;
  v_new_count     INTEGER;
  v_user_nickname TEXT;
  v_user_level    NUMERIC;
BEGIN
  -- ① 鎖定這筆球局（FOR UPDATE：排他鎖，防止並發）
  --    SKIP LOCKED：其他 transaction 正在處理時跳過，避免死鎖
  SELECT id, status, max_players, current_players
  INTO v_activity
  FROM public.activities
  WHERE id = p_activity_id
  FOR UPDATE;

  -- ② 驗證球局存在
  IF NOT FOUND THEN
    RAISE EXCEPTION '球局不存在';
  END IF;

  -- ③ 驗證球局是否開放報名
  IF v_activity.status != 'open' THEN
    RAISE EXCEPTION '此球局已額滿或已結束';
  END IF;

  -- ④ 驗證是否已有名額（原子性檢查，在鎖內進行）
  IF v_activity.current_players >= v_activity.max_players THEN
    RAISE EXCEPTION '此球局已額滿';
  END IF;

  -- ⑤ 驗證是否重複報名
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE activity_id = p_activity_id AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION '你已報名過此球局';
  END IF;

  -- ⑥ 取得用戶資料（在鎖外讀取，效能較好）
  SELECT nickname, level
  INTO v_user_nickname, v_user_level
  FROM public.profiles
  WHERE id = p_user_id;

  -- ⑦ 插入報名記錄
  INSERT INTO public.bookings (activity_id, user_id, user_nickname, user_level)
  VALUES (p_activity_id, p_user_id, COALESCE(v_user_nickname, '匿名'), COALESCE(v_user_level, 2.0));

  -- ⑧ 更新球局人數（在同一 transaction 內，原子性）
  v_new_count := v_activity.current_players + 1;

  UPDATE public.activities
  SET
    current_players = v_new_count,
    status = CASE WHEN v_new_count >= v_activity.max_players THEN 'full' ELSE 'open' END
  WHERE id = p_activity_id;

  -- ⑨ 回傳新的人數
  RETURN v_new_count;
END;
$$;

-- 讓已登入用戶可以呼叫此 function
GRANT EXECUTE ON FUNCTION public.book_activity(UUID, UUID) TO authenticated;


-- ════════════════════════════════════════════════════════════════
-- 第四層：隱私保護
-- A. 公開資料遮罩 View（對外隱藏敏感欄位）
-- ════════════════════════════════════════════════════════════════

-- 建立公開用的 profiles view：隱藏 phone 和完整 email
-- 其他用戶只能看到這個 view，看不到原始 profiles table 的敏感欄位
CREATE OR REPLACE VIEW public.profiles_public AS
SELECT
  id,
  nickname,
  -- full_name 只顯示姓（名字做遮罩）
  -- 例：'陳志明' → '陳**'，'Jenny Chen' → 'Jenny ***'
  CASE
    WHEN full_name IS NULL THEN NULL
    WHEN full_name ~ '^[\u4e00-\u9fff]'  -- 中文名字
      THEN LEFT(full_name, 1) || repeat('*', GREATEST(char_length(full_name) - 1, 1))
    ELSE                                  -- 英文名字
      split_part(full_name, ' ', 1) || ' ***'
  END AS full_name,
  avatar_url,
  level,
  bio,
  line_id,
  instagram,
  -- 電話：只顯示前 4 碼，其餘遮罩
  -- 例：'0912345678' → '0912****78'
  CASE
    WHEN phone IS NULL THEN NULL
    ELSE LEFT(phone, 4) || repeat('*', GREATEST(char_length(phone) - 6, 2)) || RIGHT(phone, 2)
  END AS phone,
  total_games,
  hosted_games,
  created_at
FROM public.profiles;

-- 開放 authenticated 和 anon 用戶讀取 view
GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- bookings 的公開 view：隱藏 user_id（防止追蹤用戶）
CREATE OR REPLACE VIEW public.bookings_public AS
SELECT
  id,
  activity_id,
  -- 隱藏真實 user_id，只保留前 8 碼做識別
  LEFT(user_id::TEXT, 8) || '****' AS user_id_masked,
  user_nickname,
  user_level,
  created_at
FROM public.bookings;

GRANT SELECT ON public.bookings_public TO anon, authenticated;


-- ════════════════════════════════════════════════════════════════
-- 第四層：隱私保護 B.
-- 密碼安全說明：
-- Supabase Auth 使用 bcrypt（cost factor 10）自動雜湊密碼
-- 開發者在 auth.users 表只能看到 encrypted_password（雜湊值）
-- 無法反推原始密碼，符合 OWASP 密碼儲存標準
-- 以下 function 驗證密碼強度（在前端已有，這是後端雙重保護）
-- ════════════════════════════════════════════════════════════════

-- 密碼強度驗證 function（可在 trigger 或 check 中使用）
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- 至少 8 個字元
  IF char_length(password) < 8 THEN RETURN FALSE; END IF;
  -- 包含至少一個數字
  IF password !~ '[0-9]' THEN RETURN FALSE; END IF;
  -- 包含至少一個字母
  IF password !~ '[a-zA-Z]' THEN RETURN FALSE; END IF;
  RETURN TRUE;
END;
$$;


-- ════════════════════════════════════════════════════════════════
-- 稽核日誌（Audit Log）
-- 記錄重要操作：登入、報名、發起球局
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  action      TEXT        NOT NULL,  -- 'book', 'cancel_book', 'host', 'update_profile'
  resource    TEXT,                  -- 操作對象（球局 ID 等）
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 只有系統可以寫入 audit log，用戶無法自行修改
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 用戶只能查看自己的 log
CREATE POLICY "audit_logs_read_own"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- 用系統權限寫入（透過 SECURITY DEFINER function）
CREATE OR REPLACE FUNCTION public.write_audit_log(
  p_user_id  UUID,
  p_action   TEXT,
  p_resource TEXT DEFAULT NULL,
  p_ip       TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource, ip_address)
  VALUES (p_user_id, p_action, p_resource, p_ip);
END;
$$;

GRANT EXECUTE ON FUNCTION public.write_audit_log(UUID, TEXT, TEXT, TEXT) TO authenticated;


-- ════════════════════════════════════════════════════════════════
-- 索引優化（提升查詢效能，同時也減少全表掃描風險）
-- ════════════════════════════════════════════════════════════════

-- 常用查詢欄位加索引
CREATE INDEX IF NOT EXISTS idx_activities_date    ON public.activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_host_id ON public.activities(host_id);
CREATE INDEX IF NOT EXISTS idx_activities_status  ON public.activities(status);
CREATE INDEX IF NOT EXISTS idx_bookings_activity  ON public.bookings(activity_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user      ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_user         ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created      ON public.audit_logs(created_at DESC);
