const SUPABASE_URL = "YOUR_URL";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

console.log(window.supabase);

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log(supabase);
console.log(supabase.auth);
