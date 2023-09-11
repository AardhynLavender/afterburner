// Identity //

import { Timestamp } from "firebase/firestore";

export type Identity = {
  id: string;
};

// Show //

export type Show = {
  name: string;
  slug: string;
  description: string;
  maxSeats: number;
  minSeats: number;
  coverImageFilename?: string;
};

export type ActiveShow = {
  ticket: PublicTicket;
  show: Show;
  showing: Showing;
  chapters: Chapter[];
};

// Showing //

export type ShowingMeta = {};

export type Showing = {
  showId: string;
  showName: string;
  startTimestamp: Timestamp;
  endTimestamp: Timestamp;
  meta?: ShowingMeta;
};

// Ticket //

export type TicketMeta = {};

export type Ticket = {
  showingId: string;
  meta?: TicketMeta;
  expires: Timestamp | null;
  claimed: boolean;
};

export type PublicTicket = Pick<Ticket & Identity, "showingId" | "id" | "meta">;

// Chapters & Interactions //

export type InteractionType = "hero" | "image" | "video" | "next";
export type InteractionPrimitive = {
  type: InteractionType;
  start_timestamp?: number; // undefined indicates the start
  end_timestamp?: number; // undefined indicates the end
};

export type NextChapterInteraction = InteractionPrimitive & {
  type: "next";
  text?: string;
};
export type HeroInteraction = InteractionPrimitive & {
  type: "hero";
  text: string;
};

export type Interaction = NextChapterInteraction | HeroInteraction;

export type Chapter = {
  title: string;
  description: string;
  fileName: string;
  audioFileUrl?: string;
  interactions?: Interaction[];
};
