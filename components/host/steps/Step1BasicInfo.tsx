import { HostFormData } from '@/lib/hostFormSchema';

interface Step1Props {
  data: HostFormData;
  onChange: (field: keyof HostFormData, value: string | number) => void;
}

const LOCATION_SUGGESTIONS = [
  '內湖運動中心',
  '大安森林公園球場',
  '南港展覽館旁球場',
  '信義運動中心',
  '松山運動中心',
];

export default function Step1BasicInfo({ data, onChange }: Step1Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-black text-white">基本資訊</h2>
        <p className="mt-0.5 text-sm text-gray-400">幫你的球局取個吸引人的名稱</p>
      </div>

      {/* 活動標題 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">
          活動標題 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="例：週末熱血雙打局、初心者友善練習賽"
          maxLength={30}
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-300 focus:ring-1 focus:ring-lime-300/30"
        />
        <div className="flex justify-end">
          <span className="text-xs text-gray-600">{data.title.length} / 30</span>
        </div>
      </div>

      {/* 場地名稱 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">
          場地名稱 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => onChange('location', e.target.value)}
          placeholder="輸入場地名稱"
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-300 focus:ring-1 focus:ring-lime-300/30"
        />
        {/* 快速選擇 */}
        <div>
          <p className="mb-2 text-xs text-gray-500">常用場地快選</p>
          <div className="flex flex-wrap gap-2">
            {LOCATION_SUGGESTIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onChange('location', loc)}
                className="rounded-full border border-gray-700 bg-gray-800 px-3 py-1 text-xs text-gray-300 transition-all hover:border-lime-300/50 hover:text-lime-300"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* 場地連結 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">
          地址連結 <span className="text-gray-500 font-normal">（選填）</span>
        </label>
        <input
          type="url"
          value={data.locationUrl}
          onChange={(e) => onChange('locationUrl', e.target.value)}
          placeholder="貼上 Google Maps 或地址連結"
          className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-lime-300 focus:ring-1 focus:ring-lime-300/30"
        />
        <p className="text-xs text-gray-500">💡 可開啟 Google Maps → 分享 → 複製連結</p>
      </div>
    </div>
  );
}
