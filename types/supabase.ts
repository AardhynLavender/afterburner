export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      location: {
        Row: {
          address: string | null
          created_at: string
          id: number
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      show: {
        Row: {
          cover_image_key: string | null
          created_at: string
          description: string | null
          id: number
          max_seats: number
          name: string
        }
        Insert: {
          cover_image_key?: string | null
          created_at?: string
          description?: string | null
          id?: number
          max_seats: number
          name: string
        }
        Update: {
          cover_image_key?: string | null
          created_at?: string
          description?: string | null
          id?: number
          max_seats?: number
          name?: string
        }
        Relationships: []
      }
      showing: {
        Row: {
          created_at: string
          id: number
          location_id: number | null
          show_id: number
          start_timestamp: string
          stop_timestamp: string
        }
        Insert: {
          created_at?: string
          id?: number
          location_id?: number | null
          show_id: number
          start_timestamp: string
          stop_timestamp: string
        }
        Update: {
          created_at?: string
          id?: number
          location_id?: number | null
          show_id?: number
          start_timestamp?: string
          stop_timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "showing_location_id_fkey"
            columns: ["location_id"]
            referencedRelation: "location"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "showing_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "show"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket: {
        Row: {
          created_at: string
          expiry_date: string
          id: number
          key: string | null
          meta: Json | null
          showing_id: number
        }
        Insert: {
          created_at?: string
          expiry_date: string
          id?: number
          key?: string | null
          meta?: Json | null
          showing_id: number
        }
        Update: {
          created_at?: string
          expiry_date?: string
          id?: number
          key?: string | null
          meta?: Json | null
          showing_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_showing_id_fkey"
            columns: ["showing_id"]
            referencedRelation: "showing"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
