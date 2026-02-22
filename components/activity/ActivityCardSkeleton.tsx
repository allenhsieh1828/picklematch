// 骨架屏：ActivityCard 的佔位動畫版本
// 在資料還沒載入時顯示，避免白屏閃爍

export default function ActivityCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-5 animate-pulse">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-800" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 rounded-full bg-gray-800" />
          <div className="h-3 w-1/3 rounded-full bg-gray-800" />
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        <div className="h-5 w-20 rounded-full bg-gray-800" />
        <div className="h-5 w-24 rounded-full bg-gray-800" />
        <div className="h-5 w-28 rounded-full bg-gray-800" />
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded-full bg-gray-800" />
          <div className="h-3 w-16 rounded-full bg-gray-800" />
        </div>
        <div className="h-1.5 rounded-full bg-gray-800" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 rounded-full bg-gray-800" />
        <div className="h-8 w-20 rounded-xl bg-gray-800" />
      </div>
    </div>
  );
}
