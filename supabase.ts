import "react-native-url-polyfill/auto";
import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Database } from "./types/supabase";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!SUPABASE_URL) throw new Error("Missing env.EXPO_PUBLIC_SUPABASE_URL");
if (!SUPABASE_KEY) throw new Error("Missing env.EXPO_PUBLIC_SUPABASE_KEY");

const options: SupabaseClientOptions<"public"> = {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_KEY,
  options
);
