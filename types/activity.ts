export type ActivityStatus = 'open' | 'full' | 'ended';

export interface Activity {
  id: string;
  title: string;        // 活動標題
  location: string;     // 場地名稱
  date: string;         // YYYY-MM-DD
  time: string;         // 例: 14:00 - 16:00
  level: [number, number]; // 分級範圍
  fee: number;          // 費用 TWD
  maxPlayers: number;
  currentPlayers: number;
  hostName: string;
  status: ActivityStatus;
}
