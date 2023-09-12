import { invariant } from "../exception/invariant";
import { Identity, PublicTicket, Ticket } from "./types";
import { usePersistent } from "./persistent";
import { firestore } from "./firebase";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import UnhandledError from "../exception/unhandled";
import { uuidv4 } from "@firebase/util";
import repeat from "../util/repeat";
import { claimTicket, TicketClaim, ticketClaimStatuses } from "./functions";

// example ticket: gaPtge6KB18RQpfZg6XG-691d14d1-ce6a-496e-a6dd-07e55e7365b3-{\"order_number\":\"2\"}}
const TICKET_REGEX = /^([a-zA-Z0-9]{20})-([a-zA-Z0-9]{20})-(\{.*\})$/;
export function validateTicket(code: unknown) {
  if (typeof code !== "string") return false;
  return TICKET_REGEX.test(code);
}

export function extractTicket(code: string): PublicTicket {
  invariant(validateTicket(code), "Invalid ticket code");
  const results = TICKET_REGEX.exec(code);
  invariant(results, "Unable to extract data from ticket");

  const [_, showingId, id, trailer] = results;

  const meta = JSON.parse(trailer);
  invariant(typeof meta === "object" && !Array.isArray(meta), "Invalid meta");

  return { showingId, id, meta };
}

export function encodeTicket(ticket: PublicTicket) {
  const meta = JSON.stringify(ticket?.meta ?? {});
  const code = `${ticket.showingId}-${ticket.id}-${meta}`;
  invariant(validateTicket(code), "Failed to encode ticket");

  return code;
}

// Claiming //

export const ACTIVE_TICKET_KEY = "active-ticket";
export function useActiveTicket(ticket: PublicTicket | null = null) {
  return usePersistent<PublicTicket | null>(ACTIVE_TICKET_KEY, ticket);
}

export function useTicketClaim() {
  const [persistentTicket, setPersistentTicket] = useActiveTicket();
  const [status, setStatus] = useState<TicketClaim | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const claim = async (ticket: PublicTicket) => {
    if (persistentTicket?.id === ticket.id) return; // already processed this ticket
    setPersistentTicket(ticket); // store ticket regardless of outcome

    const { data } = await claimTicket({ ticketId: ticket.id });

    setStatus(data.status);
    setError(error);
  };

  return {
    status,
    claim,
    error,
  };
}

// Querying //

export function useTicketCreateMutation() {
  const [error, setError] = useState<Error | null>(null);

  const createTicket = async (ticket: Ticket) => {
    try {
      const ref = await addDoc(collection(firestore, "ticket"), ticket);
      return ref.id;
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error : new UnhandledError("Unknown error")
      );
    }
  };

  return {
    error,
    createTicket,
  };
}

const DEFAULT_CLAIMED = false;
const DEFAULT_EXPIRY = null;
export function useShowingTicketsCreateMutation() {
  const [error, setError] = useState<Error | null>(null);
  const { createTicket } = useTicketCreateMutation();

  const createTickets = async (showingId: string, amount: number) =>
    repeat(amount, async () => {
      try {
        const ticket = {
          showingId,
          expires: DEFAULT_EXPIRY,
          claimed: DEFAULT_CLAIMED,
        };
        await createTicket(ticket);
      } catch (error) {
        console.error(error);
        setError(
          error instanceof Error ? error : new UnhandledError("Unknown error")
        );
      }
    });

  return {
    error,
    createTickets,
  };
}

export function useTicketListQuery(showing: string) {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState<(Ticket & Identity)[]>([]);

  const handleError = (error: Error) => {
    setError(error);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);

    const c = collection(firestore, "ticket");
    const p = where("showingId", "==", showing);
    const q = query(c, p);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Ticket & Identity)
        );
        setIsLoading(false);
        setTickets(data);
      },
      handleError
    );

    return unsubscribe;
  }, []);

  return { error, isLoading, tickets };
}
