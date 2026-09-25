const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} else {
  console.warn(
    "⚠️ Supabase credentials not found in environment variables. Please set SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY in .env"
  );
}

function getSupabaseClient() {
  if (!supabase) {
    const currentUrl = process.env.SUPABASE_URL;
    const currentKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_KEY;

    if (currentUrl && currentKey) {
      supabase = createClient(currentUrl, currentKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      return supabase;
    }

    throw new Error(
      "Supabase client is not initialized. Please configure SUPABASE_URL and SUPABASE_KEY in your .env file."
    );
  }
  return supabase;
}

module.exports = { supabase, getSupabaseClient };
