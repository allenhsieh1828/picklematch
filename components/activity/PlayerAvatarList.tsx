import { Booking } from '@/types/database';
import { cn, getAvatarColorFromId, getAvatarInitialFromName } from '@/lib/utils';

interface PlayerAvatarListProps {
  bookings: Booking[];
  max?: number;
}

export default function PlayerAvatarList({ bookings, max = 6 }: PlayerAvatarListProps) {
  const visible = bookings.slice(0, max);
  const overflow = bookings.length - max;

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-400">已報名球友</h3>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex -space-x-2">
          {visible.map(b => (
            <div
              key={b.id}
              title={`${b.user_nickname}（Lv. ${b.user_level}）`}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-900 text-sm font-bold ring-1 ring-gray-700 transition-transform hover:z-10 hover:scale-110',
                getAvatarColorFromId(b.user_id)
              )}
            >
              {getAvatarInitialFromName(b.user_nickname)}
            </div>
          ))}
          {overflow > 0 && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-gray-900 bg-gray-700 text-xs font-bold text-gray-300 ring-1 ring-gray-600">
              +{overflow}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-400">
          共 <span className="font-semibold text-white">{bookings.length}</span> 位球友報名
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {bookings.map((b, i) => (
          <div key={b.id} className="flex items-center gap-3 rounded-xl bg-gray-800/60 px-3 py-2">
            <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold', getAvatarColorFromId(b.user_id))}>
              {getAvatarInitialFromName(b.user_nickname)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{b.user_nickname}</span>
                {i === 0 && (
                  <span className="rounded-full bg-lime-300/15 px-1.5 py-0.5 text-[10px] font-semibold text-lime-300">主揪</span>
                )}
              </div>
              <span className="text-xs text-gray-500">Lv. {b.user_level}</span>
            </div>
            <span className="text-xs text-gray-600">
              {new Date(b.created_at).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
