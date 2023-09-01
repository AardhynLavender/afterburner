import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import repeat from "../util/repeat";
import { queryClient } from "./client";
import { getShow } from "./shows";
import { createTicket } from "./ticket";
import { Showing } from "./types";
import { invariant } from "../exception/invariant";

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

type CreateShowingParams = Omit<Showing, "id" | "created_at">;
export async function createShowing(params: CreateShowingParams) {
  // fetch show
  const show = await getShow(params.show_id);
  invariant(show, "Show not found");

  // create showing
  const { data: showing, error } = await supabase
    .from("showing")
    .insert(params)
    .select()
    .single();
  invariant(!!showing, "Newly created showing was not found");

  // create tickets
  // todo: showings might specify a different number of seats...
  repeat(show.max_seats, async () => await createTicket(showing.id));

  if (error) throw error;
}
export function useShowingCreateMutation() {
  return useMutation(createShowing, {
    onSuccess: () => queryClient.invalidateQueries(SHOWINGS_KEY),
  });
}
