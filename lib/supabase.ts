import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnbzfgbtnaatfpiehplp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYnpmZ2J0bmFhdGZwaWVocGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NTQyNzEsImV4cCI6MjA2OTEzMDI3MX0.YFT1odxzB91ewqCwKQAhreETYwspzUC7iGBO6BlUEPU'


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
