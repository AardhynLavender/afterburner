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
      Show: {
        Row: {
          cover_image_key: string | null;
          created_at: string;
          description: string | null;
          id: number;
          max_seats: number;
          name: string;
        };
        Insert: {
          cover_image_key?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          max_seats: number;
          name: string;
        };
        Update: {
          cover_image_key?: string | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          max_seats?: number;
          name?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
