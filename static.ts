import { AVPlaybackSource } from "expo-av";
// todo: store these in a bucket somewhere

export const chapterOrderings = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [0, 3, 7, 8, 4, 5, 6, 1, 2, 9, 10, 11],
  [0, 7, 4, 1, 2, 3, 5, 6, 8, 9, 10, 11],
  [0, 5, 6, 4, 1, 2, 3, 8, 7, 9, 10, 11],
  [0, 8, 3, 1, 2, 5, 6, 4, 7, 9, 10, 11],
  [0, 4, 8, 7, 1, 2, 3, 5, 6, 9, 10, 11],
];

export type Chapter = {
  title: string;
  description: string;
  file_name: string;
  audio_file: AVPlaybackSource;
  show_next_after?: number; // milliseconds thought to show next button
  interactions?: Interaction[];
};

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

export const chapters: Chapter[] = [
  {
    title: "The Source",
    description: "The Source",
    file_name: "Track-1",
    audio_file: require("./assets/audio/Track-1.mp3"),
    interactions: [
      {
        type: "hero",
        text: "Welcome to the Source",
        start_timestamp: 83703,
      },
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 1: Time transportation station",
    description: "find the area with two hanging black and white images",
    file_name: "Track-2A",
    audio_file: require("./assets/audio/Track-2A.mp3"),
    interactions: [
      {
        type: "hero",
        end_timestamp: 6000,
        text: "Find an area with two hanging black and white photos",
      },
      {
        type: "next",
        text: "I've found them",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 1: Time transportation station (Part 2)",
    description: "View the photos",
    file_name: "Track-2B",
    audio_file: require("./assets/audio/Track-2B.mp3"),
    interactions: [
      {
        type: "hero",
        text: "Look at the photo to the left",
        start_timestamp: 3000,
        end_timestamp: 106000,
      },
      {
        type: "hero", // todo: map!
        text: "<display map>",
        start_timestamp: 14400,
        end_timestamp: 110000,
      },
      {
        type: "hero",
        text: "Look at the photo on the right",
        start_timestamp: 110000,
        end_timestamp: 107274,
      },
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 2: Schrodinger's cat",
    description: "find the area with the cat",
    file_name: "Track-3",
    audio_file: require("./assets/audio/Track-3.mp3"),
    interactions: [
      {
        type: "hero",
        text: "Find the picture of a cat and a box",
        start_timestamp: 1500,
        end_timestamp: 99100,
      },
      {
        type: "next",
        start_timestamp: -1800,
      },
    ],
  },
  {
    title: "Station 3: Observe the Observers/The Power of Attention",
    description: "walk around the space",
    file_name: "Track-4",
    audio_file: require("./assets/audio/Track-4.mp3"),
    interactions: [
      {
        type: "hero",
        text: "Walk around the space",
        start_timestamp: 1800,
        end_timestamp: 90000,
      },
      {
        type: "hero",
        text: "Find a particle",
        start_timestamp: 95000,
      },
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 4: Duality Station",
    description: "find the box of duality",
    file_name: "Track-5A",
    audio_file: require("./assets/audio/Track-5A.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 4: Duality Station (Part 2)",
    description: "Write the words",
    file_name: "Track-5B",
    audio_file: require("./assets/audio/Track-5B.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 5: The Dice Ladder",
    description: "find the dice ladder",
    file_name: "Track-6",
    audio_file: require("./assets/audio/Track-6.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 6: We're all in this Together",
    description: "Notice the space around you",
    file_name: "Track-7",
    audio_file: require("./assets/audio/Track-7.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 7: The Return Home",
    description: "colorful circles!!!",
    file_name: "Track-8",
    audio_file: require("./assets/audio/Track-8.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 7: The Return Home (Part 2)",
    description: "jump from circle to circle",
    file_name: "Track-9",
    audio_file: require("./assets/audio/Track-9.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
  {
    title: "Station 7: The Return Home (Part 3)",
    description: "Back to the source",
    file_name: "Track-9A",
    audio_file: require("./assets/audio/Track-9A.mp3"),
    interactions: [
      {
        type: "next",
        start_timestamp: -1000,
      },
    ],
  },
];
