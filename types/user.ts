export interface User {
  id: string;
  nickname: string;
  fullName?: string;
  email: string;
  avatarUrl?: string;    // base64 or URL
  level: number;         // 2.0 ~ 5.0
  bio?: string;
  contact?: {
    line?: string;
    instagram?: string;
    phone?: string;
  };
  stats: {
    totalGames: number;
    hostedGames: number;
    joinedSince: string; // YYYY-MM-DD
  };
  badges: Badge[];
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
}

export const LEVEL_LABELS: Record<string, string> = {
  '2.0': '新手入門',
  '2.5': '初學進步',
  '3.0': '穩定發揮',
  '3.5': '中階競技',
  '4.0': '進階好手',
  '4.5': '高手境界',
  '5.0': '頂尖菁英',
};

export const LEVEL_OPTIONS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
