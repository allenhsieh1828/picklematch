import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Activity } from '@/types/activity';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelLabel(level: [number, number]): string {
  if (level[1] <= 3.0) return '初級';
  if (level[0] >= 3.5) return '進階';
  return '中級';
}

export function getLevelColorClass(level: [number, number]): string {
  if (level[1] <= 3.0) return 'text-green-400 bg-green-400/10 border-green-400/30';
  if (level[0] >= 3.5) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
}

export function getProgressColorClass(pct: number): string {
  if (pct >= 100) return 'bg-red-500';
  if (pct >= 70) return 'bg-orange-400';
  return 'bg-lime-300';
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-TW', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export function getBookingPct(activity: Activity): number {
  return Math.round((activity.currentPlayers / activity.maxPlayers) * 100);
}

// Avatar helpers
const AVATAR_COLORS = [
  'bg-lime-400 text-gray-900',
  'bg-sky-400 text-gray-900',
  'bg-violet-400 text-white',
  'bg-orange-400 text-gray-900',
  'bg-pink-400 text-white',
  'bg-teal-400 text-gray-900',
  'bg-yellow-400 text-gray-900',
  'bg-red-400 text-white',
];

export function getAvatarColorFromId(id: string): string {
  const num = id.replace(/\D/g, '').slice(-3);
  const index = (parseInt(num || '0', 10)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getAvatarInitialFromName(name: string): string {
  return name.charAt(0).toUpperCase();
}
