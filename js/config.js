const SUPABASE_URL = "https://krshcdpeagskvthblcua.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyc2hjZHBlYWdza3Z0aGJsY3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODMwNDYsImV4cCI6MjA5OTg1OTA0Nn0.X3M4sLfkMbO1ahr9k7-qO80gh0OUQxRdDWNs3mj4_yY";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

window.supabase = supabase;
