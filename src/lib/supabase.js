import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jbvjruunwdrbrzipgezs.supabase.co'
const supabaseAnonKey = 'sb_publishable_0K2R-bz97kwtmvALb9cc6w_HkG6QUvn'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)