import { useState, useEffect } from "react";
import UnhandledError from "../exception/unhandled";
import { getShowData } from "./functions";
import { usePersistent, write } from "./persistent";
import { ACTIVE_TICKET_KEY, useActiveTicket } from "./ticket";
import { ActiveShow } from "./types";

const ACTIVE_SHOW_KEY = "active-show";

export function useActiveShow() {
  const [activeTicket, setActiveTicket, readingActiveTicket] =
    useActiveTicket();
  const [loading, setLoading] = useState(false);
  const [activeShow, setActiveShow, readingActiveShow] =
    usePersistent<ActiveShow>(ACTIVE_SHOW_KEY, null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (readingActiveTicket || readingActiveShow) return; // still reading; wait

    if (!activeTicket) return; // no active ticket. nothing to do

    // check if we have already fetched this active show
    if (activeShow && activeShow.ticket.showingId === activeTicket.showingId) {
      console.log("already fetched this active show...");
      return;
    }

    // either we have no active show or we have a different active show
    setActiveShow(null);

    (async () => {
      try {
        if (loading) return;
        setLoading(true);
        console.log("fetching active show...");

        const { data } = await getShowData({
          ticketId: activeTicket.id,
          showingId: activeTicket.showingId,
        });
        setActiveShow(data);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) setError(error);
        else setError(new UnhandledError(JSON.stringify(error)));
      } finally {
        setLoading(false);
      }
    })();
  }, [activeTicket, readingActiveTicket, activeShow, readingActiveShow]);

  const clearActiveShow = async () => {
    await write(ACTIVE_SHOW_KEY, null);
    await write(ACTIVE_TICKET_KEY, null);
  };

  return { error, activeShow, clearActiveShow, loading };
}
