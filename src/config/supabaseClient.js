// creating the supabase client

// getting values from .env
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// checking just that these keys are loding from .env or not.
if (!supabaseUrl) {
    throw new Error("Missing suapbase url in frontend");
}
if (!supabaseAnonKey) {
    throw new Error("missing suapbase anon key in frontned");
}

// create a single supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// http://localhost:5173/auth/callback -- this is what i am using in google console -- auth re-direct url