'use client';

import { useState } from 'react';
import { Pencil, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Profile } from '@/types/database';
import { useAuth } from '@/lib/authContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileContactInfo from '@/components/profile/ProfileContactInfo';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

export default function ProfilePageClient({ profile: initialProfile }: { profile: Profile }) {
  const { profile: myProfile, isLoggedIn, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);

  const isOwner = isLoggedIn && myProfile?.id === initialProfile.id;
  const profile = isOwner ? (myProfile ?? initialProfile) : initialProfile;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="px-4 pt-4 sm:px-8">
        <Link href="/" className="flex w-fit items-center gap-1 text-sm text-gray-400 hover:text-lime-300 transition-colors">
          <ChevronLeft className="h-4 w-4" />返回首頁
        </Link>
      </div>

      <ProfileHeader profile={profile} isOwner={isOwner} onAvatarChange={url => updateProfile({ avatar_url: url })} />

      {isOwner && (
        <div className="px-4 sm:px-8">
          <button
            onClick={() => setEditing(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 py-2.5 text-sm font-semibold text-gray-300 hover:border-lime-300/50 hover:text-lime-300 transition-colors"
          >
            <Pencil className="h-4 w-4" />編輯個人資訊
          </button>
        </div>
      )}

      <ProfileStats profile={profile} />
      <ProfileContactInfo profile={profile} />

      {editing && (
        <ProfileEditForm profile={profile} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}
