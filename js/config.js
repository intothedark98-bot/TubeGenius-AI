const SUPABASE_URL = "https://krshcdpeagskvthblcua.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

const {
  createClient
} = window.supabase;

window.supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
