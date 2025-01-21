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
      sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
          settings: Json
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
          settings?: Json
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          content: string
          role: 'user' | 'assistant' | 'system'
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          session_id: string
          content: string
          role: 'user' | 'assistant' | 'system'
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          session_id?: string
          content?: string
          role?: 'user' | 'assistant' | 'system'
          created_at?: string
          metadata?: Json
        }
      }
      attachments: {
        Row: {
          id: string
          message_id: string
          name: string
          url: string
          size: number
          mime_type: string
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          name: string
          url: string
          size: number
          mime_type: string
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          name?: string
          url?: string
          size?: number
          mime_type?: string
          created_at?: string
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