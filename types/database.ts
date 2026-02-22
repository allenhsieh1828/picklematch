// 對應 Supabase 資料庫的 TypeScript 型別
// 這些型別和資料庫 table 的欄位一一對應

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ── profiles 表：用戶個人資料 ──
      profiles: {
        Row: {
          id: string;            // uuid，對應 auth.users.id
          nickname: string;
          full_name: string | null;
          avatar_url: string | null;
          level: number;         // 2.0 ~ 5.0
          bio: string | null;
          line_id: string | null;
          instagram: string | null;
          phone: string | null;
          total_games: number;
          hosted_games: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          bio?: string | null;
          line_id?: string | null;
          instagram?: string | null;
          phone?: string | null;
          total_games?: number;
          hosted_games?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nickname?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          bio?: string | null;
          line_id?: string | null;
          instagram?: string | null;
          phone?: string | null;
          total_games?: number;
          hosted_games?: number;
          updated_at?: string;
        };
      };

      // ── activities 表：球局 ──
      activities: {
        Row: {
          id: string;
          title: string;
          location: string;
          location_url: string | null;
          date: string;          // YYYY-MM-DD
          time_start: string;    // HH:mm
          time_end: string;
          level_min: number;
          level_max: number;
          max_players: number;
          current_players: number;
          fee: number;
          line_group_url: string | null;
          host_id: string;       // profiles.id
          host_name: string;
          status: 'open' | 'full' | 'ended';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          location: string;
          location_url?: string | null;
          date: string;
          time_start: string;
          time_end: string;
          level_min: number;
          level_max: number;
          max_players: number;
          current_players?: number;
          fee: number;
          line_group_url?: string | null;
          host_id: string;
          host_name: string;
          status?: 'open' | 'full' | 'ended';
          created_at?: string;
        };
        Update: {
          title?: string;
          location?: string;
          location_url?: string | null;
          date?: string;
          time_start?: string;
          time_end?: string;
          level_min?: number;
          level_max?: number;
          max_players?: number;
          current_players?: number;
          fee?: number;
          line_group_url?: string | null;
          status?: 'open' | 'full' | 'ended';
        };
      };

      // ── bookings 表：報名紀錄 ──
      bookings: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          user_nickname: string;
          user_level: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          user_nickname: string;
          user_level: number;
          created_at?: string;
        };
        Update: never; // 報名記錄不允許修改
      };
    };
  };
}

// ── 常用型別別名 ──
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Activity = Database['public']['Tables']['activities']['Row'];
export type Booking  = Database['public']['Tables']['bookings']['Row'];
