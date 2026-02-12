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
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          title: string;
          description: string | null;
          favicon_url: string | null;
          domain: string | null;
          tags: string[];
          view_count: number;
          is_favorite: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
          last_accessed_at: string | null;
          position_x: number | null;
          position_y: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          title: string;
          description?: string | null;
          favicon_url?: string | null;
          domain?: string | null;
          tags?: string[];
          view_count?: number;
          is_favorite?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          last_accessed_at?: string | null;
          position_x?: number | null;
          position_y?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          title?: string;
          description?: string | null;
          favicon_url?: string | null;
          domain?: string | null;
          tags?: string[];
          view_count?: number;
          is_favorite?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
          last_accessed_at?: string | null;
          position_x?: number | null;
          position_y?: number | null;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          theme: "dark" | "light";
          default_view: "grid" | "list";
          sort_by: string;
          tags_sidebar_expanded: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          theme?: "dark" | "light";
          default_view?: "grid" | "list";
          sort_by?: string;
          tags_sidebar_expanded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          theme?: "dark" | "light";
          default_view?: "grid" | "list";
          sort_by?: string;
          tags_sidebar_expanded?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_: string]: never;
    };
    Functions: {
      [_: string]: never;
    };
    Enums: {
      [_: string]: never;
    };
  };
}

