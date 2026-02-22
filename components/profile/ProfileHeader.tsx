'use client';

import { useRef, useState } from 'react';
import { Camera, Star } from 'lucide-react';
import { Profile } from '@/types/database';
import { cn, getAvatarInitialFromName, getAvatarColorFromId } from '@/lib/utils';

const LEVEL_LABELS: Record<string, string> = {
  '2.0': '新手入門', '2.5': '初學進步', '3.0': '穩定發揮',
  '3.5': '中階競技', '4.0': '進階好手', '4.5': '高手境界', '5.0': '頂尖菁英',
};

export default function ProfileHeader({
  profile, isOwner, onAvatarChange,
}: {
  profile: Profile;
  isOwner: boolean;
  onAvatarChange?: (base64: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(profile.avatar_url ?? undefined);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onAvatarChange?.(base64);
    };
    reader.readAsDataURL(file);
  }

  const levelLabel = LEVEL_LABELS[profile.level.toFixed(1)] ?? '';

  return (
    <div className="relative bg-gradient-to-b from-lime-300/10 to-transparent px-4 pb-6 pt-8 text-center sm:px-8">
      <div className="relative mx-auto mb-4 h-24 w-24 sm:h-28 sm:w-28">
        {preview ? (
          <img src={preview} alt={profile.nickname} className="h-full w-full rounded-full object-cover border-4 border-lime-300/40 shadow-lg" />
        ) : (
          <div className={cn('flex h-full w-full items-center justify-center rounded-full border-4 border-lime-300/30 text-4xl font-black shadow-lg', getAvatarColorFromId(profile.id))}>
            {getAvatarInitialFromName(profile.nickname)}
          </div>
        )}
        {isOwner && (
          <>
            <button onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-lime-300 text-gray-900 shadow-md transition-transform hover:scale-110">
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </>
        )}
      </div>

      <h1 className="text-2xl font-black text-white sm:text-3xl">{profile.nickname}</h1>
      {profile.full_name && <p className="mt-0.5 text-sm text-gray-400">{profile.full_name}</p>}

      <div className="mt-3 flex items-center justify-center">
        <div className="flex items-center gap-1.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-sm font-bold text-lime-300">
          <Star className="h-3.5 w-3.5 fill-lime-300" />
          Lv. {profile.level.toFixed(1)} · {levelLabel}
        </div>
      </div>

      {profile.bio && (
        <p className="mx-auto mt-3 max-w-xs text-sm text-gray-400 leading-relaxed sm:max-w-sm">{profile.bio}</p>
      )}
    </div>
  );
}
