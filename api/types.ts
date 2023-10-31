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

// Interaction //

export const InteractionTypes = ["hero", "image", "next"] as const;
export type InteractionType = (typeof InteractionTypes)[number];
export type InteractionPrimitive = {
  type: InteractionType;
  name?: string;
  start_timestamp?: number; // undefined indicates the start
  end_timestamp?: number; // undefined indicates the end
};

export type NextChapterInteraction = InteractionPrimitive & {
  type: "next";
  text?: string;
  //todo: alignment, size, color, style, etc.
};
export type HeroInteraction = InteractionPrimitive & {
  type: "hero";
  text: string;
  // todo: font, size, color, wrapping, animation, etc.
};
export type ImageInteraction = InteractionPrimitive & {
  type: "image";
  caption?: string;
  imageUrl: string;
  // todo: alignment, size, filter, aspect ratio, etc.
};

export type Interaction =
  | NextChapterInteraction
  | HeroInteraction
  | ImageInteraction;

// Chapter //

export type Chapter = {
  title: string;
  id: number;
  description: string;
  fileName: string | null;
  audioFileUrl?: string;
  interactions?: Interaction[];
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

export type TicketMeta = {
  chapterOrdering?: number[] | null;
};

export type Ticket = {
  showingId: string;
  meta: TicketMeta;
  expires: Timestamp | null;
  claimed: boolean;
};

export type PublicTicket = Pick<Ticket & Identity, "showingId" | "id" | "meta">;
