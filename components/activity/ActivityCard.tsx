import { MapPin, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Activity } from '@/types/database';
import { cn, getLevelLabel, getLevelColorClass, getProgressColorClass, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { id, title, location, date, time_start, time_end, level_min, level_max,
          fee, max_players, current_players, host_name, status } = activity;

  const level: [number, number] = [level_min, level_max];
  const pct = Math.round((current_players / max_players) * 100);
  const isFull = status === 'full';

  return (
    <Link href={`/activities/${id}`} className="block group">
      <article className="relative flex flex-col gap-3 rounded-2xl border border-gray-700 bg-gray-900 p-5 transition-all hover:-translate-y-1 hover:border-lime-300/50 hover:shadow-[0_0_20px_rgba(190,242,100,0.1)]">
        {isFull && (
          <Badge className="absolute right-4 top-4 bg-red-500 text-white hover:bg-red-500">
            額滿
          </Badge>
        )}

        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-300/10 text-xl">
            🏓
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white leading-snug">{title}</h3>
            <p className="mt-0.5 text-xs text-gray-400">主揪：{host_name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <InfoPill icon={<MapPin className="h-3 w-3" />} label={location} />
          <InfoPill icon={<Calendar className="h-3 w-3" />} label={formatDate(date)} />
          <InfoPill icon={<Clock className="h-3 w-3" />} label={`${time_start} - ${time_end}`} />
          <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold', getLevelColorClass(level))}>
            {getLevelLabel(level)} {level_min}–{level_max}
          </span>
        </div>

        <div>
          <div className="mb-1.5 flex justify-between text-xs">
            <span className="text-gray-400">報名人數</span>
            <span className="font-semibold text-white">{current_players} / {max_players} 人</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
            <div
              className={cn('h-full rounded-full transition-all duration-700', getProgressColorClass(pct))}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-lime-300">NT$ {fee}</span>
            <span className="text-xs text-gray-500"> / 人</span>
          </div>
          <Button
            disabled={isFull}
            size="sm"
            className={cn('rounded-xl font-bold', isFull
              ? 'cursor-not-allowed bg-gray-700 text-gray-500'
              : 'bg-lime-300 text-gray-900 hover:bg-lime-200'
            )}
          >
            {isFull ? '已額滿' : '立即報名'}
          </Button>
        </div>
      </article>
    </Link>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-300">
      <span className="text-gray-500">{icon}</span>
      {label}
    </div>
  );
}
