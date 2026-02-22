export interface Player {
  id: string;
  nickname: string;
  avatarUrl?: string;
  level: number;
  joinedAt: string;
}

export const MOCK_PLAYERS: Record<string, Player[]> = {
  'act-001': [
    { id: 'p1', nickname: '阿志哥', level: 2.5, joinedAt: '2026-02-10T08:00:00Z' },
    { id: 'p2', nickname: 'Mia', level: 3.0, joinedAt: '2026-02-10T09:15:00Z' },
    { id: 'p3', nickname: '大頭仔', level: 2.0, joinedAt: '2026-02-11T10:00:00Z' },
    { id: 'p4', nickname: 'Kevin', level: 2.5, joinedAt: '2026-02-12T07:30:00Z' },
    { id: 'p5', nickname: '小蕙', level: 2.5, joinedAt: '2026-02-13T14:00:00Z' },
    { id: 'p6', nickname: '阿文', level: 3.0, joinedAt: '2026-02-14T11:00:00Z' },
    { id: 'p7', nickname: 'Sandy', level: 2.5, joinedAt: '2026-02-15T16:00:00Z' },
    { id: 'p8', nickname: '老王', level: 2.0, joinedAt: '2026-02-16T09:00:00Z' },
    { id: 'p9', nickname: 'Tina', level: 3.0, joinedAt: '2026-02-17T10:00:00Z' },
  ],
  'act-002': [
    { id: 'p10', nickname: 'Jenny C.', level: 4.0, joinedAt: '2026-02-08T08:00:00Z' },
    { id: 'p11', nickname: '陳教練', level: 4.5, joinedAt: '2026-02-08T09:00:00Z' },
    { id: 'p12', nickname: 'Alex', level: 3.5, joinedAt: '2026-02-09T10:00:00Z' },
    { id: 'p13', nickname: '小龍', level: 4.0, joinedAt: '2026-02-09T11:00:00Z' },
    { id: 'p14', nickname: 'Marcus', level: 3.5, joinedAt: '2026-02-10T08:00:00Z' },
    { id: 'p15', nickname: '阿哲', level: 4.0, joinedAt: '2026-02-10T09:00:00Z' },
    { id: 'p16', nickname: 'Cora', level: 3.5, joinedAt: '2026-02-11T07:00:00Z' },
    { id: 'p17', nickname: '老薛', level: 4.5, joinedAt: '2026-02-11T08:00:00Z' },
  ],
  'act-003': [
    { id: 'p18', nickname: '匹克王', level: 3.0, joinedAt: '2026-02-15T19:00:00Z' },
    { id: 'p19', nickname: '阿嬌', level: 2.5, joinedAt: '2026-02-16T20:00:00Z' },
    { id: 'p20', nickname: 'Bruce', level: 3.5, joinedAt: '2026-02-17T18:00:00Z' },
    { id: 'p21', nickname: '小靜', level: 3.0, joinedAt: '2026-02-18T19:30:00Z' },
  ],
};

export function getAvatarInitial(nickname: string): string {
  return nickname.charAt(0).toUpperCase();
}
