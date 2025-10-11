import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost-placeholder';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key-placeholder';
// Use non-public service role key name; never expose this in NEXT_PUBLIC vars
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || 'service-key-placeholder';

// Verificar que las variables estén cargadas
if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
) {
  console.warn('⚠️ Missing Supabase environment variables. Using placeholders for build.');
  console.warn('Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY');
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
