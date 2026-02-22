import { User } from '@/types/user';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    nickname: '阿志哥',
    fullName: '陳志明',
    email: 'chih@example.com',
    level: 2.5,
    bio: '熱愛匹克球的上班族，每週固定打兩場，歡迎初學者一起練習！',
    contact: { line: 'chih_pickle', instagram: '@chih_pickle' },
    stats: { totalGames: 48, hostedGames: 12, joinedSince: '2024-03-15' },
    badges: [
      { id: 'b1', label: '活躍主揪', emoji: '🏓' },
      { id: 'b2', label: '初心者友善', emoji: '💚' },
    ],
  },
  {
    id: 'user-002',
    nickname: 'Jenny C.',
    fullName: 'Jenny Chen',
    email: 'jenny@example.com',
    level: 4.0,
    bio: '前羽球選手轉戰匹克球，專攻競技對打，歡迎挑戰！',
    contact: { line: 'jenny_pickle', instagram: '@jenny_pickleball' },
    stats: { totalGames: 120, hostedGames: 35, joinedSince: '2023-08-01' },
    badges: [
      { id: 'b3', label: '賽事常客', emoji: '🏆' },
      { id: 'b4', label: '百場達人', emoji: '💯' },
    ],
  },
  {
    id: 'user-003',
    nickname: '匹克王',
    fullName: '王大明',
    email: 'wang@example.com',
    level: 3.0,
    bio: '夜貓族，愛打夜間場，找人一起挑燈夜戰！',
    contact: { line: 'pickle_king88' },
    stats: { totalGames: 67, hostedGames: 20, joinedSince: '2024-01-10' },
    badges: [
      { id: 'b5', label: '夜間王者', emoji: '🌙' },
    ],
  },
];

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}
