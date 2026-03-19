import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://avurrcsnwdhwphpyvxvf.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dXJyY3Nud2Rod3BocHl2eHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDg4MTcsImV4cCI6MjA4OTE4NDgxN30.NHJiK-c8hENV5Vo8R1oQgkmykyY-BDCttw4OXLgJASA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
