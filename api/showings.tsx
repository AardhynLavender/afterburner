import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

const SHOWINGS_KEY = ["show", "showing"];

export async function getShowings() {
  const { data, error } = await supabase.from("showing").select(`
      id,
      created_at,
      show (
        name
      ),
      location (
        name,
        address
      ),
      start_timestamp,
      stop_timestamp
    `);
  if (error) throw error;
  return data ?? [];
}
export function useShowingListQuery() {
  return useQuery(SHOWINGS_KEY, getShowings);
}

export async function getShowing(id: number) {
  const { data, error } = await supabase
    .from("showing")
    .select(
      `
      id,
      created_at,
      show (
        name,
        description
      ),
      location (
        name,
        address
      ),
      start_timestamp,
      stop_timestamp
    `
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ?? [];
}
export function useShowingGetQuery(id: number) {
  return useQuery([...SHOWINGS_KEY, id], () => getShowing(id));
}
