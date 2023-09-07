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
          },
          {
            foreignKeyName: "showing_show_id_fkey"
            columns: ["show_id"]
            referencedRelation: "show_list"
            referencedColumns: ["id"]
          }
        ]
      }
      ticket: {
        Row: {
          claimed: boolean
          created_at: string
          expiry_date: string | null
          id: number
          key: string
          meta: Json | null
          showing_id: number
        }
        Insert: {
          claimed?: boolean
          created_at?: string
          expiry_date?: string | null
          id?: number
          key?: string
          meta?: Json | null
          showing_id: number
        }
        Update: {
          claimed?: boolean
          created_at?: string
          expiry_date?: string | null
          id?: number
          key?: string
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
      show_list: {
        Row: {
          cover_image_key: string | null
          description: string | null
          id: number | null
          max_seats: number | null
          name: string | null
        }
        Insert: {
          cover_image_key?: string | null
          description?: string | null
          id?: number | null
          max_seats?: number | null
          name?: string | null
        }
        Update: {
          cover_image_key?: string | null
          description?: string | null
          id?: number | null
          max_seats?: number | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_ticket: {
        Args: {
          showing_id: number
          meta?: Json
        }
        Returns: undefined
      }
      claim_ticket: {
        Args: {
          ticket_key: string
        }
        Returns: string
      }
      get_audio: {
        Args: {
          show_name: string
          file_name: string
          ticket_key: string
        }
        Returns: string
      }
      get_show: {
        Args: {
          show_id: number
          ticket_key: string
        }
        Returns: {
          id: number
          name: string
          description: string
          max_seats: number
          cover_image_key: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
