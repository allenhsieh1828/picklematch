'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Profile } from '@/types/database';

// 在模組層級建立單一 client 實例，避免重複建立
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthContextValue {
  supabaseUser: SupabaseUser | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login:    (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nickname: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:   () => Promise<void>;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile]           = useState<Profile | null>(null);
  const [isLoading, setIsLoading]       = useState(true);

  async function fetchProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
  }

  useEffect(() => {
    // 監聽 Auth 狀態（登入、登出、token 刷新、初始化）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setSupabaseUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setSupabaseUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        const msg = error.message.includes('Invalid login credentials')
          ? 'Email 或密碼錯誤，請再確認'
          : error.message.includes('Email not confirmed')
          ? '請先到信箱確認 Email 後再登入'
          : error.message;
        console.debug('[auth] login error', { message: error.message, status: (error as any)?.status });
        return { success: false, error: msg };
      }
      console.debug('[auth] login success for', email);
      return { success: true };
    } catch (err: any) {
      console.error('[auth] login exception', err);
      return { success: false, error: err?.message ?? '未知錯誤' };
    }
  }, []);

  const register = useCallback(async (nickname: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        const msg = error.message.includes('already registered')
          ? '此 Email 已被註冊'
          : error.message;
        console.debug('[auth] register error', { message: error.message, status: (error as any)?.status });
        return { success: false, error: msg };
      }
      if (!data?.user) {
        console.error('[auth] register missing user in response', data);
        return { success: false, error: '註冊失敗，請再試一次' };
      }

      await supabase.from('profiles').upsert({
        id:           data.user.id,
        nickname,
        level:        2.0,
        total_games:  0,
        hosted_games: 0,
      }, { onConflict: 'id', ignoreDuplicates: true });

      console.debug('[auth] register success for', email);
      return { success: true };
    } catch (err: any) {
      console.error('[auth] register exception', err);
      return { success: false, error: err?.message ?? '未知錯誤' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    if (!supabaseUser) {
      console.debug('[auth] updateProfile skipped: no supabaseUser');
      return { success: false, error: 'no user' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', supabaseUser.id)
        .select()
        .single();

      if (error) {
        console.error('[auth] updateProfile error', error);
        return { success: false, error: error.message };
      }

      if (data) {
        setProfile(data);
        console.debug('[auth] updateProfile success', data);
      }
      return { success: true };
    } catch (err: any) {
      console.error('[auth] updateProfile exception', err);
      return { success: false, error: err?.message ?? 'unknown' };
    }
  }, [supabaseUser]);

  return (
    <AuthContext.Provider value={{
      supabaseUser,
      profile,
      isLoggedIn: !!supabaseUser && !!profile,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
