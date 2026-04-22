import { createClient } from '@supabase/supabase-client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*')
  console.log('Profiles:', data)
  console.log('Error:', error)
}

checkProfiles()
