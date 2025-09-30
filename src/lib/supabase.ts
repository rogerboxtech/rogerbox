import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

// Verificar que las variables estén cargadas
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please check your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente con SERVICE_ROLE_KEY para operaciones de escritura
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

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
