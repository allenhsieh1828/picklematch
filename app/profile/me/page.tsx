'use client';

import { useAuth } from '@/lib/authContext';
import { redirect } from 'next/navigation';
import ProfilePageClient from '@/components/profile/ProfilePageClient';

export default function MyProfilePage() {
  const { currentUser, isLoggedIn } = useAuth();
  if (!isLoggedIn || !currentUser) redirect('/');
  return <ProfilePageClient profile={currentUser} />;
}
