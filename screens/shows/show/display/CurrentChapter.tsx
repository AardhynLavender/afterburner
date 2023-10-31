import React from "react";
import { usePersistent } from "../../../../api/persistent";
import { Chapter } from "../../../../api/types";
import { invariant } from "../../../../exception/invariant";
import useSound, { START_MS } from "../../../../sound/sound";
import { View, Text, StyleSheet } from "react-native";
import SplashScreen from "../../../SplashScreen";
import Interaction from "./Interaction";
import Button from "../../../../components/ui/Button";
import { ChapterProvider } from "./context";
import DevOnly, { isDev } from "../../../../components/util/DevOnly";
import { percent } from "../../../../util/math";

const MINUTE_S = 60;
const SECOND_MS = 1000;

export default function CurrentChapter({
  chapter,
  onNext,
}: {
  chapter: Chapter;
  onNext: () => void;
}) {
  const [position, setPosition, readingPosition] = usePersistent<number>(
    "current-position",
    START_MS
  );

  const handleNext = () => {
    setPosition(START_MS);
    onNext();
  };
  invariant(chapter?.audioFileUrl, "chapter must have an audio file url");

  const { isLoaded, playing, error, play, pause, duration, seek } = useSound(
    chapter.audioFileUrl,
    { autoPlay: true, onTick: setPosition, position: position ?? START_MS },
    !readingPosition // wait for the position to be read from persistent storage
  );

  if (!isLoaded) return <SplashScreen />;

  const seekBackward = () => seek(-SECOND_MS);
  const seekForward = () => seek(SECOND_MS);

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
            { width: percent((position ?? 0) / duration) },
          ]}
        />
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{formatTime(position ?? 0)}</Text>
          <DevOnly>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Text>
                {position} / {duration}
              </Text>
            </View>
          </DevOnly>
          <Text style={styles.duration}>{formatTime(duration)}</Text>
        </View>
      </View>
      <ChapterProvider chapter={chapter} next={handleNext}>
        <Interaction
          interactions={chapter.interactions}
          position={position ?? 0}
          duration={duration}
        />
      </ChapterProvider>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button onPress={seekBackward}>Back 10s</Button>
        <DevOnly>
          <Button onPress={seekForward}>Forward 10s</Button>
        </DevOnly>
      </View>
      <View style={styles.buttons}>
        <View style={{ width: isDev() ? "80%" : "100%" }}>
          <Button onPress={handlePlayToggle}>
            {playing ? "Pause" : "Resume"}
          </Button>
        </View>
        <DevOnly>
          <View style={{ width: "20%" }}>
            <Button onPress={handleNext}>Next</Button>
          </View>
        </DevOnly>
      </View>
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
    </View>
  );
}

function formatTime(timeMs: number) {
  const seconds = Math.floor(timeMs / SECOND_MS);
  const minutes = Math.floor(seconds / MINUTE_S);
  const hours = Math.floor(minutes / MINUTE_S);

  return `${hours ? `${formatTimeValue(hours)}:` : ""}${formatTimeValue(
    minutes % MINUTE_S
  )}:${formatTimeValue(seconds % 60)}`;
}

function formatTimeValue(value: number) {
  return value.toString().padStart(2, "0");
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
    gap: 8,
    width: "100%",
    backgroundColor: "#eee",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "green",
  },
  durationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    items: "center",
    height: 32,
  },
  duration: {
    fontSize: 12,
    color: "#999",
  },
  buttons: {
    gap: 16,
    flexDirection: "row",
  },
});
