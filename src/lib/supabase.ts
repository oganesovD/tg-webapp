import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qmmwqmkpzrowmbvfsznu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbXdxbWtwenJvd21idmZzem51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDk1MDksImV4cCI6MjA2NjI4NTUwOX0.Xc7bOGDVkg7FV437VpG8uwD80PGk2_SO59bb2OOUHzY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)