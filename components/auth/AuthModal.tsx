'use client';

import { useState } from 'react';
import { X, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { cn } from '@/lib/utils';

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

type Tab = 'login' | 'register';

export default function AuthModal({ onClose, defaultTab = 'login' }: AuthModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab]       = useState<Tab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState('');

  const [nickname, setNickname] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (tab === 'register') {
      if (!nickname.trim()) { setError('請輸入暱稱'); setLoading(false); return; }
      if (password.length < 6) { setError('密碼至少需要 6 個字元'); setLoading(false); return; }
    }

    try {
      if (tab === 'login') {
        const result = await login(email, password);
        if (result.success) {
          // 登入成功直接關閉，不等 onAuthStateChange
          onClose();
        } else {
          setError(result.error ?? '發生錯誤，請再試一次');
        }
      } else {
        const result = await register(nickname, email, password);
        if (result.success) {
          setSuccess('🎉 註冊成功！請直接登入。');
          // 2 秒後自動切到登入 tab
          setTimeout(() => {
            setTab('login');
            setSuccess('');
            setPassword('');
          }, 2000);
        } else {
          setError(result.error ?? '發生錯誤，請再試一次');
        }
      }
    } catch (err: any) {
      setError(err?.message ?? '發生錯誤，請再試一次');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 text-center">
          <div className="text-2xl font-black text-lime-300">🏓 PickleMatch</div>
          <p className="mt-1 text-xs text-gray-400">找到你的下一個球局</p>
        </div>

        <div className="mb-5 flex rounded-xl bg-gray-800 p-1">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); setSuccess(''); }}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-semibold transition-all',
                tab === t ? 'bg-lime-300 text-gray-900' : 'text-gray-400 hover:text-white'
              )}
            >
              {t === 'login' ? '登入' : '註冊'}
            </button>
          ))}
        </div>

        {success && (
          <div className="mb-4 rounded-xl bg-lime-300/10 border border-lime-300/30 px-4 py-3 text-sm text-lime-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {tab === 'register' && (
            <input
              type="text"
              placeholder="暱稱（球場上的稱呼）"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={20}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-lime-300"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-lime-300"
          />

          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder={tab === 'register' ? '密碼（至少 6 個字元）' : '密碼'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 pr-11 text-sm text-white placeholder-gray-500 outline-none focus:border-lime-300"
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !!success}
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-lime-300 font-bold text-gray-900 transition-all hover:bg-lime-200 disabled:opacity-60"
          >
            {loading
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : tab === 'login' ? '登入帳號' : '建立帳號'
            }
          </button>
        </form>
      </div>
    </>
  );
}
