import { MapPin, Calendar, Clock, Users, ChevronLeft, ExternalLink, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Activity, Booking } from '@/types/database';
import { getLevelLabel, getLevelColorClass, getProgressColorClass, formatDate, cn } from '@/lib/utils';
import BookingButton from '@/components/activity/BookingButton';
import PlayerAvatarList from '@/components/activity/PlayerAvatarList';

interface ActivityDetailProps {
  activity: Activity;
  bookings: Booking[];
  isBooked: boolean;
}

export default function ActivityDetail({ activity, bookings, isBooked }: ActivityDetailProps) {
  const {
    id, title, location, location_url, line_group_url,
    date, time_start, time_end, level_min, level_max,
    fee, max_players, current_players, host_name, status,
  } = activity;

  const level: [number, number] = [level_min, level_max];
  const pct = Math.round((current_players / max_players) * 100);
  const isFull = status === 'full';
  const spotsLeft = max_players - current_players;

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-lime-300/10 to-transparent px-4 pb-6 pt-5 sm:px-8">
        <Link href="/" className="mb-4 flex w-fit items-center gap-1 text-sm text-gray-400 hover:text-lime-300 transition-colors">
          <ChevronLeft className="h-4 w-4" />返回球局列表
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold', getLevelColorClass(level))}>
            {getLevelLabel(level)} {level_min}–{level_max}
          </span>
          {isFull
            ? <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-xs font-semibold text-red-400">額滿</span>
            : <span className="rounded-full bg-lime-300/10 border border-lime-300/30 px-2.5 py-0.5 text-xs font-semibold text-lime-300">招募中</span>
          }
        </div>

        <h1 className="mb-1 text-xl font-black text-white leading-tight sm:text-2xl">{title}</h1>
        <p className="text-sm text-gray-400">主揪：<span className="text-gray-200 font-medium">{host_name}</span></p>
      </div>

      <div className="px-4 sm:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Info Card */}
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            <InfoBlock icon={<MapPin className="h-4 w-4 text-lime-300" />} label="場地" value={location} />
            <InfoBlock icon={<Calendar className="h-4 w-4 text-lime-300" />} label="日期" value={formatDate(date)} />
            <InfoBlock icon={<Clock className="h-4 w-4 text-lime-300" />} label="時段" value={`${time_start} - ${time_end}`} />
            <InfoBlock icon={<Users className="h-4 w-4 text-lime-300" />} label="名額" value={`${current_players} / ${max_players} 人`} />
          </div>

          {/* Progress + Fee */}
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-400">報名進度</span>
                <span className="font-bold text-white">{pct}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-800">
                <div className={cn('h-full rounded-full transition-all duration-700', getProgressColorClass(pct))} style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {isFull ? '名額已滿，請關注下次球局' : `還剩 ${spotsLeft} 個名額，手刀報名！`}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3">
              <span className="text-sm text-gray-400">費用</span>
              <div>
                <span className="text-2xl font-extrabold text-lime-300">NT$ {fee}</span>
                <span className="text-xs text-gray-500"> / 人</span>
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        {(location_url || line_group_url) && (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            {location_url && (
              <a href={location_url} target="_blank" rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 py-3 text-sm font-semibold text-sky-400 transition-colors hover:bg-sky-500/20">
                <ExternalLink className="h-4 w-4" />查看地圖
              </a>
            )}
            {line_group_url && (
              <a href={line_group_url} target="_blank" rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 py-3 text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/20">
                <MessageCircle className="h-4 w-4" />加入 Line 群組
              </a>
            )}
          </div>
        )}

        {/* Booking */}
        <div className="mt-4">
          <BookingButton activityId={id} isFull={isFull} fee={fee} isBooked={isBooked} />
        </div>

        <div className="my-6 border-t border-gray-800" />

        {/* Players */}
        <div className="pb-10">
          <PlayerAvatarList bookings={bookings} max={5} />
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-xs text-gray-500">{icon}{label}</div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
