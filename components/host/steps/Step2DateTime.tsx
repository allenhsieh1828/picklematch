import { HostFormData } from '@/lib/hostFormSchema';

interface Step2Props {
  data: HostFormData;
  onChange: (field: keyof HostFormData, value: string | number) => void;
}

// 快速時段選項
const TIME_SLOTS = [
  { label: '早鳥場', start: '07:00', end: '09:00' },
  { label: '上午場', start: '09:00', end: '11:00' },
  { label: '下午場', start: '14:00', end: '16:00' },
  { label: '傍晚場', start: '17:00', end: '19:00' },
  { label: '夜間場', start: '19:30', end: '21:30' },
];

// 取得今天之後 14 天的日期清單
function getUpcomingDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }),
      weekday: d.toLocaleDateString('zh-TW', { weekday: 'short' }),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }
  return dates;
}

export default function Step2DateTime({ data, onChange }: Step2Props) {
  const upcomingDates = getUpcomingDates();

  const handleTimeSlot = (start: string, end: string) => {
    onChange('timeStart', start);
    onChange('timeEnd', end);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-black text-white">日期與時段</h2>
        <p className="mt-0.5 text-sm text-gray-400">選擇你的開打時間</p>
      </div>

      {/* 日期選擇 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">
          選擇日期 <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {upcomingDates.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => onChange('date', d.value)}
              className={`flex shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 text-xs transition-all ${
                data.date === d.value
                  ? 'border-lime-300 bg-lime-300 text-gray-900'
                  : d.isWeekend
                  ? 'border-gray-600 bg-gray-800/80 text-gray-200'
                  : 'border-gray-700 bg-gray-800 text-gray-400'
              }`}
            >
              <span className="font-semibold">{d.weekday}</span>
              <span className="mt-0.5 font-bold text-sm">{d.label}</span>
            </button>
          ))}
        </div>
        {/* 也可手動輸入 */}
        <input
          type="date"
          value={data.date}
          min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
          onChange={(e) => onChange('date', e.target.value)}
          className="mt-1 w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-lime-300"
        />
      </div>

      {/* 快速時段 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">選擇時段</label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = data.timeStart === slot.start && data.timeEnd === slot.end;
            return (
              <button
                key={slot.label}
                type="button"
                onClick={() => handleTimeSlot(slot.start, slot.end)}
                className={`flex flex-col items-center rounded-xl border px-2 py-2.5 text-xs transition-all ${
                  isSelected
                    ? 'border-lime-300 bg-lime-300/10 text-lime-300'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="font-semibold">{slot.label}</span>
                <span className="mt-0.5 text-[10px] opacity-75">{slot.start}–{slot.end}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 自訂時段 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-300">或自訂時段</label>
        <div className="flex items-center gap-3">
          <input
            type="time"
            value={data.timeStart}
            onChange={(e) => onChange('timeStart', e.target.value)}
            className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:border-lime-300"
          />
          <span className="text-gray-500">至</span>
          <input
            type="time"
            value={data.timeEnd}
            onChange={(e) => onChange('timeEnd', e.target.value)}
            className="flex-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:border-lime-300"
          />
        </div>
      </div>
    </div>
  );
}
