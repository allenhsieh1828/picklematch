// 首頁載入骨架屏

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-800" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 rounded-full bg-gray-800" />
          <div className="h-3 w-1/3 rounded-full bg-gray-800" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-20 rounded-full bg-gray-800" />
        <div className="h-5 w-28 rounded-full bg-gray-800" />
        <div className="h-5 w-16 rounded-full bg-gray-800" />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <div className="h-3 w-12 rounded-full bg-gray-800" />
          <div className="h-3 w-16 rounded-full bg-gray-800" />
        </div>
        <div className="h-1.5 rounded-full bg-gray-800" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-6 w-20 rounded-full bg-gray-800" />
        <div className="h-8 w-20 rounded-xl bg-gray-800" />
      </div>
    </div>
  );
}

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero 骨架 */}
      <div className="px-4 pb-8 pt-10 text-center animate-pulse sm:px-6">
        <div className="mx-auto mb-4 h-6 w-40 rounded-full bg-gray-800" />
        <div className="mx-auto mb-3 h-10 w-64 rounded-xl bg-gray-800" />
        <div className="mx-auto mb-6 h-4 w-80 rounded-full bg-gray-800" />
      </div>

      {/* 列表骨架 */}
      <div className="px-4 sm:px-6">
        <div className="mb-4 flex justify-between">
          <div className="h-5 w-20 rounded-full bg-gray-800 animate-pulse" />
          <div className="h-5 w-10 rounded-full bg-gray-800 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}
