import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfilePageClient from '@/components/profile/ProfilePageClient';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = createClient();
  const { data } = await supabase.from('profiles').select('nickname').eq('id', params.id).single();
  if (!data) return { title: '找不到使用者' };
  return { title: `${data.nickname}｜PickleMatch` };
}

export default async function ProfilePage({ params }: PageProps) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', params.id).single();

  if (!profile) notFound();

  return <ProfilePageClient profile={profile} />;
}
