// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Thay thế bằng thông tin thật của bạn vừa copy
const supabaseUrl = 'https://jdtxfefnikvizdpsyjni.supabase.co'
const supabaseKey = 'sb_publishable_nqhatRXBhN36U0--ahhmkA_h0g56uyt'

export const supabase = createClient(supabaseUrl, supabaseKey)