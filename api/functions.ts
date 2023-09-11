import { fn } from "./firebase";
import { ActiveShow, Chapter } from "./types";

// Claim Ticket //

export const ticketClaimStatuses = ["claimed", "expired", "invalid"] as const;
export type TicketClaim = (typeof ticketClaimStatuses)[number];
export type ClaimTicketParams = { ticketId: string };
export type ClaimTicketResponse = {
  ticketId: string;
  error: Error | null;
  status: TicketClaim;
};

export const claimTicket = fn<ClaimTicketParams, ClaimTicketResponse>(
  "claimTicket"
);

// Get Chapters //

export type GetShowDataParams = { showingId: string; ticketId: string };
export type GetShowDataResponse = {
  status: unknown;
  error: Error | unknown;
} & ActiveShow;

export const getShowData = fn<GetShowDataParams, GetShowDataResponse>(
  "getShowData"
);
