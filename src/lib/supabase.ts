
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zlzgmosgdnasvhcircso.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpsemdtb3NnZG5hc3ZoY2lyY3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4ODIzOTEsImV4cCI6MjA2NjQ1ODM5MX0.Ua32dJOpFykkcTJGbeIuC779Y_IO6vm7Uw6CzoaA2Ns'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export type Profile = {
  id: string
  age?: number
  weight?: number
  height?: number
  menstruation_age?: number
  cycle_length?: string
  symptoms?: string
  goals?: string
  created_at: string
  updated_at: string
}

export type Scan = {
  id: string
  user_id: string
  acne_score: number
  facial_hair_score: number
  pigmentation_score: number
  overall_improvement: number
  scan_date: string
  recommendations?: string[]
  created_at: string
}

export type ChatMessage = {
  id: string
  user_id: string
  message: string
  response: string
  message_type: 'user' | 'ai'
  created_at: string
}
