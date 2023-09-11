import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import { usePersistent } from "../../../api/persistent";
import useSound, { START_MS } from "../../../sound/sound";
import { Chapter } from "../../../api/types";
import StartShow from "./StartShow";
import SplashScreen from "../../SplashScreen";
import { ChapterProvider } from "./context";
import Interaction from "./Interaction";
import Button from "../../../components/ui/Button";
import { useActiveShow } from "../../../api/activeShow";

export default function Show({ route }: ShowScreenProps<"show">) {
  const { showId } = route.params;
  invariant(showId, "`showId` is required");

  const { activeShow, error, loading: loadingActiveShow } = useActiveShow();

  const [, setCurrentPosition] = usePersistent("current-position", 0);
  const [currentTrack, setCurrentTrack, readingCurrentTrack] =
    usePersistent<number>("current-track", null);

  if (readingCurrentTrack || loadingActiveShow) return <SplashScreen />;
  if (error) return <Text>Error: {JSON.stringify(error)}</Text>;

  // no active show found, render the start show screen
  if (!activeShow || (activeShow && currentTrack === null)) {
    const handleStart = () => setCurrentTrack(0);

    return (
      <StartShow
        onStart={handleStart}
        title={"The Anderson Localization"}
        description={"Don't start yet! we'll let you know when to begin"}
      />
    );
  }

  if (!activeShow.chapters.length) return <Text>No chapters found...</Text>;

  const handleNext = () => {
    const nextTrack = (currentTrack ?? 0) + 1;
    if (nextTrack >= activeShow.chapters.length) setCurrentTrack(null);
    else setCurrentTrack(nextTrack);
    setCurrentPosition(0);
  };

  return (
    <CurrentChapter
      chapter={activeShow.chapters[currentTrack ?? 0]}
      onNext={handleNext}
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
            { width: `${((position ?? 0) / duration) * 100}%` },
          ]}
        />
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>{formatTime(position ?? 0)}</Text>
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
          position={position ?? 0}
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
