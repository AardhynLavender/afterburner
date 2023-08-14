import { Database } from "./supabase.generated";

export type Table<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Show = Table<"Show">;
