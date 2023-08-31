import { supabase } from "../supabase";
import { invariant } from "../exception/invariant";
import { AuthError } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export type AuthenticationError = Error | AuthError | null;

export async function authenticate(email: string, password: string) {
  invariant(EMAIL_REGEX.test(email), "Email is invalid");
  invariant(password.length, "Password is required");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;

  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
