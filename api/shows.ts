import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

const SHOWS_KEY = ["show"];
export async function getShows() {
  const { data, error } = await supabase.from("show").select("*");
  if (error) throw error;
  return data ?? [];
}
export function useShowsListQuery() {
  return useQuery(SHOWS_KEY, getShows);
}
