import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import type { Interaction } from "../../../static";
import { HeroInteraction, NextChapterInteraction } from "./interactions";

export default function Interaction({
  interactions,
  position,
  duration,
}: {
  interactions?: Interaction[];
  position: number;
  duration: number;
}) {
  const activeInteractions = useMemo(
    () =>
      interactions?.filter((interaction) =>
        displayInteraction(
          interaction.start_timestamp,
          interaction.end_timestamp,
          position,
          duration
        )
      ),
    [interactions, position, duration]
  );

  const activeInteractionComponents = useMemo(
    () =>
      activeInteractions?.map((interaction, key) => {
        switch (interaction.type) {
          case "next":
            return <NextChapterInteraction key={key} />;
          case "hero":
            return <HeroInteraction key={key} />;
          default:
            throw new Error(`Unknown interaction type: ${interaction}`);
        }
      }),
    [activeInteractions]
  );

  return <View style={styles.interaction}>{activeInteractionComponents}</View>;
}

const DEFAULT_START_TIMESTAMP = 0;
function displayInteraction(
  startTimestamp: number | undefined,
  endTimestamp: number | undefined,
  position: number,
  duration: number
) {
  const startRelative = startTimestamp ?? DEFAULT_START_TIMESTAMP;
  const endRelative = endTimestamp ?? duration;

  // negative timestamps are relative to the end of the track
  const start = startRelative < 0 ? duration + startRelative : startRelative;
  const end = endRelative < 0 ? duration - endRelative : endRelative;

  if (start < 0 || start > duration)
    throw new Error(`Invalid start timestamp: ${start}`);
  if (end < 0 || end > duration)
    throw new Error(`Invalid end timestamp: ${end}`);

  return start <= position && position <= end;
}

const styles = StyleSheet.create({
  interaction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
