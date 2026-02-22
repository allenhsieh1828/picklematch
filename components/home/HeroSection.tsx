import { Zap, Trophy, MapPin } from 'lucide-react';

const FEATURES = [
  { icon: Zap, label: '即時媒合' },
  { icon: Trophy, label: '分級賽事' },
  { icon: MapPin, label: '附近球場' },
];

export default function HeroSection() {
  return (
    <section className="relative px-4 pb-8 pt-10 text-center sm:px-6 sm:pt-14 lg:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(190,242,100,0.12),transparent)]"
      />
      <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-lime-300/30 bg-lime-300/10 px-3 py-1 text-xs font-semibold tracking-widest text-lime-300">
        🏓 PICKLEBALL MATCH
      </span>
      <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        找到你的
        <br className="sm:hidden" />
        <span className="sm:ml-2">下一個</span>
        <span className="text-lime-300 drop-shadow-[0_0_24px_rgba(190,242,100,0.5)]">球局</span>
      </h1>
      <p className="mx-auto mb-6 max-w-sm text-sm text-gray-400 sm:max-w-md sm:text-base">
        瀏覽附近球局、查看分級與費用，一鍵報名，開打！
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-xl bg-gray-800 px-3 py-2 text-xs text-gray-300 sm:px-4 sm:text-sm">
            <Icon className="h-3.5 w-3.5 text-lime-300" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
