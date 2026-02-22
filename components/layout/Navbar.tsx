'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PlusCircle, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import AuthModal from '@/components/auth/AuthModal';
import { cn, getAvatarInitialFromName, getAvatarColorFromId } from '@/lib/utils';

export default function Navbar() {
  const { isLoggedIn, profile, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lime-300 font-black text-lg tracking-tight">
            🏓 PickleMatch
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* 發起按鈕 */}
            <Link href="/host">
              <button className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-3 py-2 text-xs font-bold text-gray-900 transition-all hover:bg-lime-200 sm:px-4 sm:text-sm">
                <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">發起球局</span>
                <span className="sm:hidden">發起</span>
              </button>
            </Link>

            {/* 已登入：顯示頭像 */}
            {isLoggedIn && profile ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(v => !v)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-lime-300/40 overflow-hidden transition-all hover:border-lime-300"
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className={cn(
                      'flex h-full w-full items-center justify-center text-sm font-bold',
                      getAvatarColorFromId(profile.id)
                    )}>
                      {getAvatarInitialFromName(profile.nickname)}
                    </div>
                  )}
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-gray-700 bg-gray-900 py-1 shadow-xl">
                      <div className="border-b border-gray-800 px-3 py-2">
                        <p className="text-xs font-bold text-white truncate">{profile.nickname}</p>
                        <p className="text-[11px] text-gray-500 truncate">Lv. {profile.level.toFixed(1)}</p>
                      </div>
                      <Link
                        href={`/profile/${profile.id}`}
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <User className="h-4 w-4" />個人頁面
                      </Link>
                      <button
                        onClick={async () => { await logout(); setShowMenu(false); }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />登出
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* 未登入：直接顯示登入按鈕，不等 isLoading */
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-300 hover:border-gray-500 hover:text-white transition-all sm:px-4 sm:text-sm"
              >
                登入
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
