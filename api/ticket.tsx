import { supabase } from "../supabase";
import UnhandledError from "../exception/unhandled";
import { Json } from "../types/supabase";
import { useQuery } from "@tanstack/react-query";
import { invariant } from "../exception/invariant";
import { Ticket } from "./types";
import { usePersistent, write } from "./persistent";

// Creation //

export type TicketMeta = Json | null;
export async function createTicket(showingId: number, meta: TicketMeta = null) {
  const { data, error } = await supabase.rpc("add_ticket", {
    showing_id: showingId,
    meta,
  });
  if (error) throw error;
}

// Validation //

// example ticket: 6-c8e2dc1b-d5af-4f17-b33f-829753fa8dba-{\"order_number\":\"2\"}}
export const ticketRegex =
  /^(\d+)-([a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12})-(.*)$/;
export function validateTicket(code: unknown) {
  if (typeof code !== "string") return false;
  return ticketRegex.test(code);
}

export type PublicTicket = Pick<Ticket, "showing_id" | "meta" | "key">;
export function extractTicket(code: string): PublicTicket {
  invariant(validateTicket(code), "Invalid ticket code");
  const results = ticketRegex.exec(code);
  invariant(results, "Unable to extract data from ticket");

  const [_, id, key, trailer] = results;

  const showing_id = parseInt(id);
  invariant(!isNaN(showing_id), "Invalid showing id");

  const meta = JSON.parse(trailer);
  invariant(typeof meta === "object" && !Array.isArray(meta), "Invalid meta");

  return { showing_id, key, meta };
}

export function encodeTicket(ticket: PublicTicket) {
  const meta = JSON.stringify(ticket?.meta ?? {});
  const code = `${ticket.showing_id}-${ticket.key}-${meta}`;
  invariant(validateTicket(code), "Failed to encode ticket");

  return code;
}

// Claiming //

const ticketClaimStatuses = [
  "SUCCESS",
  "ALREADY_CLAIMED",
  "EXPIRED",
  "INVALID_KEY",
] as const;
export type TicketClaim = (typeof ticketClaimStatuses)[number];
function isTicketClaim(status: unknown): status is TicketClaim {
  if (typeof status !== "string") return false;
  return ticketClaimStatuses.includes(status as TicketClaim);
}

const PERSISTENT_TICKET_KEY = "active-ticket";
export function usePersistentTicket(ticket: PublicTicket | null = null) {
  return usePersistent<PublicTicket | null>(PERSISTENT_TICKET_KEY, ticket);
}

/**
 * Request that the database marks the ticket as claimed
 * @param ticketKey ticket to claim
 */
export async function claimTicket(ticketKey: string) {
  const { data: status, error } = await supabase.rpc("claim_ticket", {
    ticket_key: ticketKey,
  });
  if (error) throw error;

  invariant(status, "No data returned from claim_ticket");
  invariant(isTicketClaim(status), "Invalid data returned from claim_ticket");

  return status;
}
type ClaimTicketOptions = { claim?: boolean };
export function useClaimTicket(
  ticket: PublicTicket | null,
  { claim }: ClaimTicketOptions = { claim: true }
) {
  return useQuery(
    ["claim_ticket", ticket?.key],
    () => ticket && claimTicket(ticket.key),
    { enabled: !!ticket && claim }
  );
}

// Querying //

export async function getTicketList(showingId: number) {
  const { data, error } = await supabase
    .from("ticket")
    .select(`id, key, expiry_date, claimed, showing_id, created_at, meta`)
    .order("id", { ascending: true })
    .eq("showing_id", showingId);

  if (error) throw error;
  return data;
}
export function useTicketListQuery(showingId: number) {
  return useQuery(["tickets", showingId, "ticket"], () =>
    getTicketList(showingId)
  );
}

export async function getTicket(id: string) {
  const { data, error } = await supabase
    .from("ticket")
    .select(`id, key, expiry_date, claimed, showing_id, meta`)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
export function useTicketGetQuery(id: string) {
  return useQuery(["ticket", id], () => getTicket(id));
}
