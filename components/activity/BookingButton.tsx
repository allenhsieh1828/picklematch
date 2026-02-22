'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, LogIn, X } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { cn } from '@/lib/utils';

type BookingState = 'idle' | 'loading' | 'success';

interface BookingButtonProps {
  activityId: string;
  isFull: boolean;
  fee: number;
  isBooked?: boolean;
}

export default function BookingButton({ activityId, isFull, fee, isBooked = false }: BookingButtonProps) {
  const { isLoggedIn } = useAuth();

  // Optimistic UI：先假設成功，再送 API
  // 點下去「立刻」變成功狀態，不用等 API 回應
  const [state, setState] = useState<BookingState>(isBooked ? 'success' : 'idle');
  const [error, setError] = useState('');

  // ── 未登入 ───────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-gray-700 bg-gray-800 text-sm font-semibold text-gray-400">
        <LogIn className="h-4 w-4" />
        請先登入才能報名
      </div>
    );
  }

  // ── 額滿 ─────────────────────────────────────────────────────
  if (isFull && state !== 'success') {
    return (
      <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-gray-800 text-sm font-semibold text-gray-500">
        此球局已額滿
      </div>
    );
  }

  // ── 已報名 ───────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-lime-300 text-gray-900">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-black text-base">已報名！球局見 🏓</span>
        </div>
        <button
          onClick={handleCancel}
          className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          <X className="h-3 w-3" /> 取消報名
        </button>
      </div>
    );
  }

  // ── 報名主函式（Optimistic：先改 UI，背景送 API）───────────────
  async function handleBook() {
    if (state !== 'idle') return;
    setError('');

    // 1. 立刻把 UI 改成 loading（視覺回饋）
    setState('loading');

    // 2. 100ms 後假設成功，先讓用戶看到成功畫面
    //    這就是 Optimistic UI 的核心：「樂觀地」假設 API 會成功
    const optimisticTimer = setTimeout(() => setState('success'), 100);

    try {
      const res = await fetch(`/api/activities/${activityId}/bookings`, { method: 'POST' });
      const json = await res.json();

      if (!res.ok) {
        // API 失敗 → 取消樂觀更新，恢復原狀並顯示錯誤
        clearTimeout(optimisticTimer);
        setState('idle');
        setError(json.error ?? '報名失敗，請再試一次');
      }
      // API 成功 → 什麼都不用做，畫面早就已經是成功狀態了
    } catch {
      clearTimeout(optimisticTimer);
      setState('idle');
      setError('網路錯誤，請確認連線後再試');
    }
  }

  // ── 取消報名（Optimistic：先改 UI，背景送 API）─────────────────
  async function handleCancel() {
    // 先立刻把 UI 恢復成可報名狀態
    setState('idle');
    // 背景靜默送出取消請求
    await fetch(`/api/activities/${activityId}/bookings`, { method: 'DELETE' }).catch(() => {});
  }

  // ── 預設按鈕 ─────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleBook}
        disabled={state === 'loading'}
        className={cn(
          'relative flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-black text-base transition-all',
          state === 'loading'
            ? 'bg-lime-300/80 text-gray-900/80 cursor-not-allowed'
            : 'bg-lime-300 text-gray-900 hover:bg-lime-200 active:scale-95 shadow-[0_0_24px_rgba(190,242,100,0.35)] hover:shadow-[0_0_32px_rgba(190,242,100,0.55)]'
        )}
      >
        {state === 'loading' ? (
          <><Loader2 className="h-5 w-5 animate-spin" /><span>報名中…</span></>
        ) : (
          <><span>立即報名</span><span className="ml-1 rounded-lg bg-gray-900/15 px-2 py-0.5 text-sm font-bold">NT$ {fee}</span></>
        )}
      </button>
      {error && <p className="text-center text-xs text-red-400">⚠️ {error}</p>}
    </div>
  );
}
