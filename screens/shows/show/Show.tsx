import React from "react";
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import useSound from "../../../sound/sound";
import { usePersistent } from "../../../api/persistent";
import { Chapter, chapters } from "../../../static";
import { START_MS } from "../../../sound/sound";
import { ChapterProvider } from "./context";
import Interaction from "./Interaction";
import StartShow from "./StartShow";
import Button from "../../../components/ui/Button";
import SplashScreen from "../../SplashScreen";

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

  return (
    <StartShow
      onStart={handleStart}
      title={"The Anderson Localization"}
      description={"Don't start yet! we'll let you know when to begin"}
    />
  );
}

function CurrentChapter({
  chapter,
  onNext,
}: {
  chapter: Chapter;
  onNext: () => void;
}) {
  const isDev = process.env.EXPO_PUBLIC_IS_DEV === "true";

  const [position, setPosition] = useState(0);

  const handleNext = () => {
    setPosition(START_MS);
    onNext();
  };

  const { isLoaded, playing, error, play, pause, duration, seek } = useSound(
    chapter.audio_file,
    { autoPlay: true, onTick: setPosition }
  );

  if (!isLoaded) return <SplashScreen />;

  const seekBackward = () => seek(-1000);
  const seekForward = () => seek(1000);

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
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{formatTime(position)}</Text>
          {isDev && (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Button onPress={seekBackward}>-1s</Button>
              <Text>
                {position}|{duration}
              </Text>
              <Button onPress={seekForward}>+1s</Button>
            </View>
          )}
          <Text style={styles.duration}>{formatTime(duration)}</Text>
        </View>
      </View>
      <ChapterProvider chapter={chapter} next={handleNext}>
        <Interaction
          interactions={chapter.interactions}
          position={position}
          duration={duration}
        />
      </ChapterProvider>
      <View style={styles.buttons}>
        <View style={{ width: isDev ? "80%" : "100%" }}>
          <Button onPress={handlePlayToggle}>
            {playing ? "Pause" : "Resume"}
          </Button>
        </View>
        {isDev && (
          <View style={{ width: "20%" }}>
            <Button onPress={handleNext}>Next</Button>
          </View>
        )}
      </View>
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
    </View>
  );
}

function formatTime(timeMs: number) {
  const seconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  return `${hours ? `${formatTimeValue(hours)}:` : ""}${formatTimeValue(
    minutes % 60
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
