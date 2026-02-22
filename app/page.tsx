import HeroSection from '@/components/home/HeroSection';
import ActivityList from '@/components/activity/ActivityList';
import { createClient } from '@/lib/supabase/server';

// 不 cache，每次請求都向 Supabase 抓最新資料
// Realtime 會在 client 端接手，保持即時更新
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = createClient();

  const { data: activities } = await supabase
    .from('activities')
    .select('*')
    .order('date', { ascending: true });

  return (
    <div className="mx-auto max-w-5xl">
      <HeroSection />
      <ActivityList activities={activities ?? []} />
    </div>
  );
}
