import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          weight: number
          height: number
          gender: 'male' | 'female' | 'other'
          goals: string[]
          target_weight: number | null
          membership_status: 'inactive' | 'active' | 'expired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          weight: number
          height: number
          gender: 'male' | 'female' | 'other'
          goals: string[]
          target_weight?: number | null
          membership_status?: 'inactive' | 'active' | 'expired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          weight?: number
          height?: number
          gender?: 'male' | 'female' | 'other'
          goals?: string[]
          target_weight?: number | null
          membership_status?: 'inactive' | 'active' | 'expired'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
