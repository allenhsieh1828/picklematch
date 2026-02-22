'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Profile } from '@/types/database';
import { useAuth } from '@/lib/authContext';
import { cn } from '@/lib/utils';

const LEVEL_OPTIONS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
const LEVEL_LABELS: Record<string, string> = {
  '2.0': '新手入門', '2.5': '初學進步', '3.0': '穩定發揮',
  '3.5': '中階競技', '4.0': '進階好手', '4.5': '高手境界', '5.0': '頂尖菁英',
};

export default function ProfileEditForm({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  const { updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [nickname,   setNickname]   = useState(profile.nickname);
  const [fullName,   setFullName]   = useState(profile.full_name ?? '');
  const [bio,        setBio]        = useState(profile.bio ?? '');
  const [level,      setLevel]      = useState(profile.level);
  const [lineId,     setLineId]     = useState(profile.line_id ?? '');
  const [instagram,  setInstagram]  = useState(profile.instagram ?? '');
  const [phone,      setPhone]      = useState(profile.phone ?? '');

  async function handleSave() {
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      const res: any = await updateProfile({
        nickname,
        full_name:  fullName  || null,
        bio:        bio       || null,
        level,
        line_id:    lineId    || null,
        instagram:  instagram || null,
        phone:      phone     || null,
      });
      if (!res || res.success === false) {
        console.error('[profile] save failed', res);
      } else {
        setSaved(true);
        setTimeout(onClose, 700);
      }
    } catch (err) {
      console.error('[profile] save exception', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="mx-auto min-h-screen max-w-lg px-4 py-8">
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-white">編輯個人資訊</h2>
            <button onClick={onClose} className="text-sm text-gray-400 hover:text-white">取消</button>
          </div>

          <div className="flex flex-col gap-4">
            <Field label="暱稱 *">
              <input value={nickname} onChange={e => setNickname(e.target.value)} maxLength={20} className={inputClass} />
            </Field>
            <Field label="真實姓名（選填）">
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="僅供顯示" className={inputClass} />
            </Field>
            <Field label="自我介紹（選填）">
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} maxLength={120}
                placeholder="介紹一下你的球齡、風格…" className={cn(inputClass, 'resize-none')} />
              <div className="text-right text-xs text-gray-600">{bio.length} / 120</div>
            </Field>
            <Field label="球技等級">
              <div className="flex flex-wrap gap-2">
                {LEVEL_OPTIONS.map(lv => (
                  <button key={lv} type="button" onClick={() => setLevel(lv)}
                    className={cn('rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all',
                      level === lv ? 'border-lime-300 bg-lime-300 text-gray-900' : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                    )}>
                    {lv.toFixed(1)} {LEVEL_LABELS[lv.toFixed(1)]}
                  </button>
                ))}
              </div>
            </Field>

            <div className="border-t border-gray-800 pt-4">
              <p className="mb-3 text-sm font-semibold text-gray-300">聯絡資訊</p>
              <div className="flex flex-col gap-3">
                <Field label="Line ID"><input value={lineId} onChange={e => setLineId(e.target.value)} placeholder="你的 Line ID" className={inputClass} /></Field>
                <Field label="Instagram"><input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@your_handle" className={inputClass} /></Field>
                <Field label="電話"><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="09xx-xxx-xxx" className={inputClass} /></Field>
              </div>
            </div>

            <button onClick={handleSave} disabled={saving || saved}
              className={cn('mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all',
                saved ? 'bg-green-500 text-white' : 'bg-lime-300 text-gray-900 hover:bg-lime-200 disabled:opacity-60'
              )}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" />儲存中…</>
               : saved ? <>✅ 已儲存！</>
               : <><Save className="h-4 w-4" />儲存變更</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-lime-300 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400">{label}</label>
      {children}
    </div>
  );
}
