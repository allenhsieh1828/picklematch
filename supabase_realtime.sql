-- ================================================================
-- 在 Supabase SQL Editor 執行此檔案以開啟 Realtime 功能
-- ================================================================

-- 開啟 activities 表的 Realtime 監聽
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;

-- 開啟 bookings 表的 Realtime 監聽（讓報名名單即時更新）
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
