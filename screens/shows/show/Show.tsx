import { useMemo, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import useSound from "../../../sound/sound";
import { usePersistent } from "../../../api/persistent";
import { Chapter, chapters } from "../../../static";
import type { Interaction } from "../../../static";
import { START_MS } from "../../../sound/sound";
import React from "react";

export default function Show({ route }: ShowScreenProps<"show">) {
  const { showId } = route.params;
  invariant(showId, "`showId` is required");

  const [running, setRunning] = useState(false);
  const [currentTrack, setCurrentTrack, reading] = usePersistent<number>(
    "afterburner-current-track",
    0
  );

  const handleNext = () => {
    const nextTrack = (currentTrack ?? 0) + 1;
    if (nextTrack >= chapters.length) setRunning(false);
    else setCurrentTrack(nextTrack);
  };

  const handleStart = () => {
    setRunning(true);
    setCurrentTrack(0);
  };

  if (reading) return <Text>Loading...</Text>;

  if (running)
    return (
      <CurrentChapter
        chapter={chapters[currentTrack ?? 0]}
        onNext={handleNext}
      />
    );
  return <StartShow onStart={handleStart} />;
}

function CurrentChapter({
  chapter,
  onNext,
}: {
  chapter: Chapter;
  onNext: () => void;
}) {
  const [position, setPosition] = useState(0);

  const handleNext = () => {
    setPosition(START_MS);
    onNext();
  };

  const { isLoaded, playing, error, play, pause, duration } = useSound(
    chapter.audio_file,
    { autoPlay: true, onTick: setPosition }
  );

  if (!isLoaded) return <Text>Loading...</Text>;

  const handlePlayToggle = () => {
    if (playing) pause();
    else play();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.chapterHeading}>{chapter.title}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            { width: `${(position / duration) * 100}%` },
          ]}
        />
      </View>
      <Interaction
        interactions={chapter.interactions}
        position={position}
        duration={duration}
      />
      <View style={styles.buttons}>
        <Button
          title={playing ? "Pause" : "Resume"}
          onPress={handlePlayToggle}
        />
        <Button title="Next" onPress={handleNext} />
      </View>
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
    </View>
  );
}

function StartShow({ onStart: handleStart }: { onStart: () => void }) {
  return (
    <View style={styles.container}>
      <Button title="Start Show" onPress={handleStart} />
    </View>
  );
}

function Interaction({
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

  return (
    <View style={styles.interaction}>
      <Text>Interaction</Text>
      {activeInteractions?.map((interaction, key) => {
        switch (interaction.type) {
          case "next":
            return <NextChapterInteraction key={key} />;
          case "hero":
            return <Hero key={key} />;
          default:
            throw new Error(`Unknown interaction type: ${interaction}`);
        }
      })}
    </View>
  );
}

function NextChapterInteraction() {
  return (
    <View>
      <Text>Next Chapter</Text>
      <Button title="Next" onPress={() => {}} />
    </View>
  );
}

function Hero() {
  return (
    <View>
      <Text>Find a thing</Text>
    </View>
  );
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
  container: {
    alignItems: "center",
    margin: 16,
    flex: 1,
    gap: 16,
  },
  chapterHeading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: "100%",
    backgroundColor: "#eee",
  },
  interaction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "green",
  },
  buttons: {
    flexDirection: "row",
    gap: 16,
  },
});
