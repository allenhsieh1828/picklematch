import { MessageCircle, Instagram, Phone } from 'lucide-react';
import { Profile } from '@/types/database';

export default function ProfileContactInfo({ profile }: { profile: Profile }) {
  if (!profile.line_id && !profile.instagram && !profile.phone) return null;
  return (
    <div className="px-4 sm:px-8">
      <h2 className="mb-3 text-sm font-semibold text-gray-400">聯絡資訊</h2>
      <div className="flex flex-col gap-2 rounded-2xl border border-gray-800 bg-gray-900 p-4">
        {profile.line_id && <ContactRow icon={<MessageCircle className="h-4 w-4 text-green-400" />} label="Line ID" value={profile.line_id} />}
        {profile.instagram && <ContactRow icon={<Instagram className="h-4 w-4 text-pink-400" />} label="Instagram" value={profile.instagram} />}
        {profile.phone && <ContactRow icon={<Phone className="h-4 w-4 text-sky-400" />} label="電話" value={profile.phone} />}
      </div>
    </div>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className="truncate text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
