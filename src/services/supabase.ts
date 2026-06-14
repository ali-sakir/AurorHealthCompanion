import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vmsuxfmhqopntfqbounu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtc3V4Zm1ocW9wbnRmcWJvdW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTQzMTYsImV4cCI6MjA5Njk5MDMxNn0._DyuCK5hyNISfprPdhKrosc5mHBBp7_KizVlVe6Xls0';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);