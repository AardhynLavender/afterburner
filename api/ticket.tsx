import { supabase } from "../supabase";
import UnhandledError from "../exception/unhandled";
import { Json } from "../types/supabase";
import { useQuery } from "@tanstack/react-query";

export type TicketMeta = Json | null;

export async function createTicket(showingId: number, meta: TicketMeta = null) {
  const { data, error } = await supabase.rpc("add_ticket", {
    showing_id: showingId,
    meta,
  });
  if (error) throw error;
}

/**
 * Request that the database marks the ticket as claimed
 * @param ticketKey ticket to claim
 */
export function claimTicket(ticketKey: string) {
  // const { data, error } = supabase.rpc("claim_ticket", {
  //   ticket_key: ticketKey,
  // });

  // if (error) throw error;
  // return data;
  throw new UnhandledError("Not implemented");
}

export async function getTicketList(showingId: number) {
  const { data, error } = await supabase
    .from("ticket")
    .select(`id, key, expiry_date, meta`)
    .eq("showing_id", showingId);

  if (error) throw error;
  return data;
}
export function useTicketListQuery(showingId: number) {
  return useQuery([showingId, "ticket"], () => getTicketList(showingId));
}

export async function getTicket(id: string) {
  const { data, error } = await supabase
    .from("ticket")
    .select(`id, key, expiry_date, meta`)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
export function useTicketGetQuery(id: string) {
  return useQuery(["ticket", id], () => getTicket(id));
}
