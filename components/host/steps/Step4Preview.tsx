import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import { HostFormData, formToPreview } from '@/lib/hostFormSchema';
import { getLevelLabel, getLevelColorClass, cn, formatDate } from '@/lib/utils';

interface Step4Props {
  data: HostFormData;
}

export default function Step4Preview({ data }: Step4Props) {
  const preview = formToPreview(data);
  const levelTuple: [number, number] = [data.levelMin, data.levelMax];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-black text-white">確認球局資訊</h2>
        <p className="mt-0.5 text-sm text-gray-400">發布前再確認一次，沒問題就出發吧！</p>
      </div>

      {/* Preview Card */}
      <div className="rounded-2xl border border-lime-300/30 bg-gray-900 p-5 shadow-[0_0_20px_rgba(190,242,100,0.08)]">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-300/10 text-xl">
            🏓
          </div>
          <div>
            <h3 className="font-bold text-white text-base">{preview.title || '（未命名）'}</h3>
            <span className="text-xs text-gray-400">主揪：我</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <PreviewRow icon={<MapPin className="h-3.5 w-3.5 text-lime-300" />} label="場地" value={preview.location || '—'} />
          <PreviewRow icon={<Calendar className="h-3.5 w-3.5 text-lime-300" />} label="日期" value={preview.date ? formatDate(preview.date) : '—'} />
          <PreviewRow icon={<Clock className="h-3.5 w-3.5 text-lime-300" />} label="時段" value={preview.time} />
          <PreviewRow icon={<Users className="h-3.5 w-3.5 text-lime-300" />} label="人數" value={`最多 ${preview.maxPlayers} 人`} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={cn('rounded-full border px-2.5 py-0.5 text-xs font-semibold', getLevelColorClass(levelTuple))}>
            {getLevelLabel(levelTuple)} {data.levelMin.toFixed(1)}–{data.levelMax.toFixed(1)}
          </span>
          <span className="rounded-full border border-lime-300/30 bg-lime-300/10 px-2.5 py-0.5 text-xs font-semibold text-lime-300">
            招募中
          </span>
        </div>

        {/* Extra links */}
        {(preview.locationUrl || preview.lineGroupUrl) && (
          <div className="flex flex-col gap-2 mt-1">
            {preview.locationUrl && (
              <a
                href={preview.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2.5 text-sm text-sky-400 hover:text-sky-300 transition-colors truncate"
              >
                📍 查看地圖連結
              </a>
            )}
            {preview.lineGroupUrl && (
              <a
                href={preview.lineGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl bg-gray-800 px-4 py-2.5 text-sm text-green-400 hover:text-green-300 transition-colors truncate"
              >
                💬 加入 Line 群組
              </a>
            )}
          </div>
        )}

        {/* Fee */}
        <div className="flex items-center justify-between rounded-xl bg-gray-800 px-4 py-2.5">
          <span className="text-sm text-gray-400">每人費用</span>
          <span className="text-lg font-extrabold text-lime-300">
            {preview.fee === 0 ? '免費 🎉' : `NT$ ${preview.fee}`}
          </span>
        </div>
      </div>

      {/* 注意事項 */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 text-xs text-gray-400 leading-relaxed">
        <p className="font-semibold text-gray-300 mb-1">📋 發布前請確認</p>
        <ul className="list-disc list-inside space-y-1">
          <li>發布後可在「我的球局」中編輯或取消</li>
          <li>報名滿員後將自動關閉報名</li>
          <li>費用請自行與球友確認收取方式</li>
        </ul>
      </div>
    </div>
  );
}

function PreviewRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[11px] text-gray-500">
        {icon}{label}
      </div>
      <span className="text-sm font-semibold text-white truncate">{value}</span>
    </div>
  );
}
