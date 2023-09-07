import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import UnhandledError from "../exception/unhandled";
import SelectDropdown from "react-native-select-dropdown";

const SHOWS_KEY = ["show"];
export async function getShows() {
  const { data, error } = await supabase
    .from("show_list")
    .select("id, name, description, max_seats, cover_image_key");
  if (error) throw error;
  return data ?? [];
}
export function useShowsListQuery() {
  return useQuery(SHOWS_KEY, getShows);
}

export const INVALID_TICKET = "99001";
export const UNCLAIMED = "99002";
export const EXPIRED = "99003";

/**
 *
 * @param showId show to get
 * @param ticketKey ticket to use
 */
export async function getShowTicketed(showId: number, ticketKey: string) {
  const { data, error } = await supabase.rpc("get_show", {
    show_id: showId,
    ticket_key: ticketKey,
  });

  if (error)
    switch (error.code) {
      case INVALID_TICKET:
        throw new Error("Invalid ticket");
      case UNCLAIMED:
        throw new Error("Ticket not claimed");
      case EXPIRED:
        throw new Error("Ticket expired");
      default:
        throw new UnhandledError(error.message);
    }

  if (!data?.length) throw new Error("Show not found");

  const [show] = data;
  return show;
}
export function useShowGetTicketedQuery(
  showId: number,
  ticketKey?: string | null
) {
  return useQuery(
    [...SHOWS_KEY, showId, ticketKey],
    async () => {
      if (ticketKey) getShowTicketed(showId, ticketKey);
    },
    { enabled: !!ticketKey }
  );
}

/**
 * Fetch show data without a ticket key, requires caller to be authenticated
 * @param showId show to get
 */
export async function getShowAuthorized(showId: number) {
  const { data: show, error } = await supabase
    .from("show")
    .select("id, name, description, created_at, max_seats, cover_image_key")
    .eq("id", showId)
    .single();

  if (error) throw error.message;
  if (!show) throw new Error("Show not found");

  return show;
}
export function useShowGetAuthorizedQuery(showId: number) {
  return useQuery([...SHOWS_KEY, showId], () => getShowAuthorized(showId));
}
