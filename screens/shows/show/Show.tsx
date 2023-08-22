import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import useSound from "../../../sound/sound";
import { usePersistent } from "../../../api/persistent";
import { Chapter, chapters } from "../../../static";
import { START_MS } from "../../../sound/sound";
import { ChapterProvider } from "./context";
import Interaction from "./Interaction";

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
      <ChapterProvider chapter={chapter} next={handleNext}>
        <Interaction
          interactions={chapter.interactions}
          position={position}
          duration={duration}
        />
      </ChapterProvider>
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
