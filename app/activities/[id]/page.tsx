import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ActivityDetail from '@/components/activity/ActivityDetail';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient();
  const { data } = await supabase
    .from('activities').select('title, location, date').eq('id', params.id).single();
  if (!data) return { title: '找不到球局' };
  return { title: `${data.title}｜PickleMatch` };
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const supabase = createClient();

  // 取得球局資料
  const { data: activity } = await supabase
    .from('activities').select('*').eq('id', params.id).single();

  if (!activity) notFound();

  // 取得報名名單
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('activity_id', params.id)
    .order('created_at', { ascending: true });

  // 取得目前登入用戶（Server 端）
  const { data: { user } } = await supabase.auth.getUser();
  const isBooked = bookings?.some(b => b.user_id === user?.id) ?? false;

  return (
    <ActivityDetail
      activity={activity}
      bookings={bookings ?? []}
      isBooked={isBooked}
    />
  );
}
