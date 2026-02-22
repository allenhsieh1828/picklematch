// Next.js 自動讀取這個檔案
// 當 /activities/[id] 頁面還在載入時，自動顯示這個骨架屏

export default function ActivityDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      {/* Header 區域 */}
      <div className="bg-gradient-to-b from-lime-300/5 to-transparent px-4 pb-6 pt-5 sm:px-8">
        <div className="mb-4 h-4 w-20 rounded-full bg-gray-800" />
        <div className="mb-3 flex gap-2">
          <div className="h-5 w-16 rounded-full bg-gray-800" />
          <div className="h-5 w-16 rounded-full bg-gray-800" />
        </div>
        <div className="mb-2 h-7 w-2/3 rounded-xl bg-gray-800" />
        <div className="h-4 w-1/4 rounded-full bg-gray-800" />
      </div>

      <div className="px-4 sm:px-8">
        {/* Info grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-3 w-12 rounded-full bg-gray-800" />
                <div className="h-4 w-20 rounded-full bg-gray-800" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-16 rounded-full bg-gray-800" />
                <div className="h-4 w-10 rounded-full bg-gray-800" />
              </div>
              <div className="h-2.5 rounded-full bg-gray-800" />
              <div className="h-3 w-1/2 rounded-full bg-gray-800" />
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 flex justify-between">
              <div className="h-4 w-10 rounded-full bg-gray-800" />
              <div className="h-8 w-24 rounded-full bg-gray-800" />
            </div>
          </div>
        </div>

        {/* Booking button */}
        <div className="mt-4 h-14 rounded-2xl bg-gray-800" />

        <div className="my-6 border-t border-gray-800" />

        {/* Players */}
        <div className="space-y-3">
          <div className="h-4 w-20 rounded-full bg-gray-800" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-9 rounded-full bg-gray-800" />
            ))}
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-gray-800" />
          ))}
        </div>
      </div>
    </div>
  );
}
