'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Activity } from '@/types/database';
import ActivityCard from '@/components/activity/ActivityCard';
import FilterBar, { LevelFilter } from '@/components/home/FilterBar';
import { createClient } from '@/lib/supabase/client';

interface ActivityListProps {
  activities: Activity[];
}

function filterActivities(activities: Activity[], filter: LevelFilter): Activity[] {
  if (filter === '全部') return activities;
  return activities.filter(a => {
    if (filter === '初級') return a.level_max <= 3.0;
    if (filter === '進階') return a.level_min >= 3.5;
    if (filter === '中級') return a.level_min < 3.5 && a.level_max > 3.0;
    return true;
  });
}

type RealtimeStatus = 'connecting' | 'connected' | 'error';

export default function ActivityList({ activities: initial }: ActivityListProps) {
  const [filter, setFilter] = useState<LevelFilter>('全部');
  const [activities, setActivities] = useState<Activity[]>(initial);
  const [realtimeStatus, setRealtimeStatus] = useState<RealtimeStatus>('connecting');
  const [isPending, startTransition] = useTransition();

  // ── Supabase Realtime 訂閱 ────────────────────────────────────
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('activities-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activities' },
        (payload) => {
          // 新球局：加到列表頭部，加入淡入動畫 class
          setActivities(prev => [payload.new as Activity, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'activities' },
        (payload) => {
          // 球局更新（人數、狀態）：只更新那一筆
          setActivities(prev =>
            prev.map(a => a.id === payload.new.id ? (payload.new as Activity) : a)
          );
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected');
        else if (status === 'CHANNEL_ERROR') setRealtimeStatus('error');
      });

    return () => { supabase.removeChannel(channel); };
  }, []);

  function handleFilterChange(f: LevelFilter) {
    startTransition(() => setFilter(f));
  }

  const filtered = filterActivities(activities, filter);

  // 即時狀態指示燈樣式
  const dotStyle = {
    connecting: 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)] animate-pulse',
    connected:  'bg-lime-400  shadow-[0_0_6px_rgba(163,230,53,0.8)]',
    error:      'bg-red-400   shadow-[0_0_6px_rgba(248,113,113,0.8)]',
  }[realtimeStatus];

  const dotTitle = {
    connecting: '連線中…',
    connected:  '即時更新中',
    error:      '即時連線失敗，請重新整理',
  }[realtimeStatus];

  return (
    <section className="px-4 pb-12 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-white text-base sm:text-lg">
          近期球局
          {/* 即時狀態指示燈 */}
          <span
            className={`inline-block h-2 w-2 rounded-full ${dotStyle}`}
            title={dotTitle}
          />
        </h2>
        <span className="text-xs text-gray-500">{filtered.length} 場</span>
      </div>

      <div className="mb-4">
        <FilterBar value={filter} onChange={handleFilterChange} />
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-500">
          😢 目前沒有符合的球局
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
          {filtered.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="mb-3 text-xs text-gray-500">沒找到想打的球局？</p>
        <Link
          href="/host"
          className="inline-block rounded-xl border border-lime-300 px-6 py-3 text-sm font-bold text-lime-300 transition-colors hover:bg-lime-300/10 w-full sm:w-auto"
        >
          🏓 自己發起一場球局
        </Link>
      </div>
    </section>
  );
}
