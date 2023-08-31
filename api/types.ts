import { Database } from "../types/supabase";

export type Table<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Show = Table<"show">;
export type Showing = Table<"showing">;
export type Ticket = Table<"ticket">;
export type Location = Table<"location">;
