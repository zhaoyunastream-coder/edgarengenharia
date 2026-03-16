import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://anqvmuufszvjvfnktefe.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FhdQ7uy-pQYX8MnbAmEn4w_lz1zZBpO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
}
