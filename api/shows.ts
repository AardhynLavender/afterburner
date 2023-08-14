import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";

const SHOWS_KEY = ["shows"];
export async function getShows() {
  const { data, error } = await supabase.from("Show").select("*");
  if (error) throw error;
  return data ?? [];
}
export function useShowsListQuery() {
  return useQuery(SHOWS_KEY, getShows);
}
