export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-6 pb-12 animate-pulse">
      {/* 返回按鈕 */}
      <div className="px-4 pt-4 sm:px-8">
        <div className="h-4 w-16 rounded-full bg-gray-800" />
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-4 px-4 pb-6 pt-8 sm:px-8">
        <div className="h-24 w-24 rounded-full bg-gray-800" />
        <div className="h-7 w-32 rounded-xl bg-gray-800" />
        <div className="h-4 w-20 rounded-full bg-gray-800" />
        <div className="h-8 w-36 rounded-full bg-gray-800" />
        <div className="h-4 w-64 rounded-full bg-gray-800" />
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-8">
        <div className="mb-3 h-4 w-16 rounded-full bg-gray-800" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 px-2 py-4">
              <div className="h-5 w-5 rounded-full bg-gray-800" />
              <div className="h-6 w-12 rounded-full bg-gray-800" />
              <div className="h-3 w-16 rounded-full bg-gray-800" />
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="px-4 sm:px-8">
        <div className="mb-3 h-4 w-16 rounded-full bg-gray-800" />
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-800" />
              <div className="space-y-1">
                <div className="h-3 w-12 rounded-full bg-gray-800" />
                <div className="h-4 w-24 rounded-full bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
