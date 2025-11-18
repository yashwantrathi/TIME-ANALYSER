export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      time_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          study: number;
          sleep: number;
          social_media: number;
          eating: number;
          college: number;
          commute: number;
          leisure: number;
          other: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          study?: number;
          sleep?: number;
          social_media?: number;
          eating?: number;
          college?: number;
          commute?: number;
          leisure?: number;
          other?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_date?: string;
          study?: number;
          sleep?: number;
          social_media?: number;
          eating?: number;
          college?: number;
          commute?: number;
          leisure?: number;
          other?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
