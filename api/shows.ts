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

export async function getShow(id: number) {
  const { data, error } = await supabase
    .from("show")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data ?? [];
}
export function useShowQuery(id: number) {
  return useQuery([...SHOWS_KEY, id], () => getShow(id));
}
