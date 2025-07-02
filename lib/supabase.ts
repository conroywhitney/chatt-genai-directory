import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions matching your Member interface
export interface Member {
  id?: string
  name: string
  role: string
  interest: string
  twitter?: string
  linkedin?: string
  discord?: string
  github?: string
  created_at?: string
  updated_at?: string
}

// Database table name
export const MEMBERS_TABLE = 'members'
