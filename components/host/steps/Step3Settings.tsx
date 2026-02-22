'use client';

import { HostFormData, LEVEL_OPTIONS } from '@/lib/hostFormSchema';
import { cn } from '@/lib/utils';

interface Step3Props {
  data: HostFormData;
  onChange: (field: keyof HostFormData, value: string | number) => void;
}

export default function Step3Settings({ data, onChange }: Step3Props) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-black text-white">球局設定</h2>
        <p className="mt-0.5 text-sm text-gray-400">設定人數、程度與費用</p>
      </div>

      {/* ── 人數滑桿 ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-300">報名人數上限</label>
          <span className="rounded-lg bg-lime-300/10 px-2.5 py-0.5 text-base font-black text-lime-300">
            {data.maxPlayers} 人
          </span>
        </div>
        <input
          type="range"
          min={4}
          max={24}
          step={2}
          value={data.maxPlayers}
          onChange={(e) => onChange('maxPlayers', Number(e.target.value))}
          className="slider w-full accent-lime-300"
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>4 人</span>
          <span>24 人</span>
        </div>
      </div>

      {/* ── 程度範圍 ── */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-300">接受程度範圍</label>
        <div className="grid grid-cols-2 gap-3">
          {/* 最低程度 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500">最低</span>
            <div className="flex flex-wrap gap-1.5">
              {LEVEL_OPTIONS.map((lv) => (
                <button
                  key={`min-${lv}`}
                  type="button"
                  disabled={lv > data.levelMax}
                  onClick={() => onChange('levelMin', lv)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all',
                    data.levelMin === lv
                      ? 'border-lime-300 bg-lime-300 text-gray-900'
                      : lv > data.levelMax
                      ? 'cursor-not-allowed border-gray-800 bg-gray-900 text-gray-700'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                  )}
                >
                  {lv.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
          {/* 最高程度 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-500">最高</span>
            <div className="flex flex-wrap gap-1.5">
              {LEVEL_OPTIONS.map((lv) => (
                <button
                  key={`max-${lv}`}
                  type="button"
                  disabled={lv < data.levelMin}
                  onClick={() => onChange('levelMax', lv)}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all',
                    data.levelMax === lv
                      ? 'border-lime-300 bg-lime-300 text-gray-900'
                      : lv < data.levelMin
                      ? 'cursor-not-allowed border-gray-800 bg-gray-900 text-gray-700'
                      : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                  )}
                >
                  {lv.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 py-2 text-sm">
          <span className="text-gray-400">接受程度</span>
          <span className="font-bold text-lime-300">
            {data.levelMin.toFixed(1)} – {data.levelMax.toFixed(1)}
          </span>
        </div>
      </div>

      {/* ── 費用輸入 ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-300">每人費用（TWD）</label>
          <span className="text-xs text-gray-500">輸入 0 表示免費</span>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">NT$</span>
          <input
            type="number"
            min={0}
            max={2000}
            step={50}
            value={data.fee}
            onChange={(e) => onChange('fee', Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-12 pr-4 text-base font-bold text-white outline-none transition-colors focus:border-lime-300 focus:ring-1 focus:ring-lime-300/30"
          />
        </div>
        {/* 快速金額 */}
        <div className="flex gap-2 flex-wrap">
          {[0, 100, 150, 200, 300, 500].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onChange('fee', amount)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold transition-all',
                data.fee === amount
                  ? 'border-lime-300 bg-lime-300/10 text-lime-300'
                  : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
              )}
            >
              {amount === 0 ? '免費' : `$${amount}`}
            </button>
          ))}
        </div>
      </div>
      {/* ── Line 群組連結 ── */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-300">
          Line 社群 / 群組連結 <span className="text-gray-500 font-normal">（選填）</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 text-base">💬</span>
          <input
            type="url"
            value={data.lineGroupUrl}
            onChange={(e) => onChange('lineGroupUrl', e.target.value)}
            placeholder="https://line.me/ti/g2/..."
            className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-300 focus:ring-1 focus:ring-lime-300/30"
          />
        </div>
        <p className="text-xs text-gray-500">💡 開啟 Line 群組 → 設定 → 邀請連結 → 複製</p>
      </div>
    </div>
  );
}
