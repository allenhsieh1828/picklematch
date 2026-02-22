import { Trophy, Calendar, Zap } from 'lucide-react';
import { Profile } from '@/types/database';

export default function ProfileStats({ profile }: { profile: Profile }) {
  const joinedDate = new Date(profile.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
  const STATS = [
    { icon: <Zap className="h-5 w-5 text-lime-300" />, label: '總參賽場次', value: profile.total_games },
    { icon: <Trophy className="h-5 w-5 text-orange-400" />, label: '發起球局', value: profile.hosted_games },
    { icon: <Calendar className="h-5 w-5 text-sky-400" />, label: '加入時間', value: joinedDate },
  ];
  return (
    <div className="px-4 sm:px-8">
      <h2 className="mb-3 text-sm font-semibold text-gray-400">參賽紀錄</h2>
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(({ icon, label, value }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 rounded-2xl border border-gray-800 bg-gray-900 px-2 py-4 text-center">
            {icon}
            <span className="text-lg font-black text-white sm:text-xl">{value}</span>
            <span className="text-[11px] leading-tight text-gray-500 sm:text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
