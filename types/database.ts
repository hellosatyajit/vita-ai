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
      debates: {
        Row: {
          id: string
          created_at: string
          user_id: string
          topic: string
          stance: string
          duration: number
          tokens_used: number
          summary: string | null
          transcript: Json
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          topic: string
          stance: string
          duration: number
          tokens_used: number
          summary?: string | null
          transcript: Json
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          topic?: string
          stance?: string
          duration?: number
          tokens_used?: number
          summary?: string | null
          transcript?: Json
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          email: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
        }
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
  }
} 