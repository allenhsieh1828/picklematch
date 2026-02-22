import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-5 py-24 text-center">
      <div className="text-5xl">😢</div>
      <h2 className="text-xl font-bold text-white">找不到這場球局</h2>
      <p className="text-sm text-gray-500">球局可能已結束或不存在</p>
      <Link
        href="/"
        className="mt-2 rounded-xl bg-lime-300 px-5 py-2.5 text-sm font-bold text-gray-900 hover:bg-lime-200 transition-colors"
      >
        回首頁看其他球局
      </Link>
    </div>
  );
}
