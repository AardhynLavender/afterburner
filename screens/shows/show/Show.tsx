import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import useSound from "../../../sound/sound";
import { AVPlaybackSource } from "expo-av";
import { usePersistent } from "../../../api/persistent";
import { chapters } from "../../../static";

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

  return (
    <View style={styles.container}>
      {running ? (
        <CurrentChapter
          file={chapters[currentTrack ?? 0].audio_file}
          onNext={handleNext}
        />
      ) : (
        <StartShow onStart={handleStart} />
      )}
    </View>
  );
}

function CurrentChapter({
  file,
  onNext: handleNext,
}: {
  file: AVPlaybackSource;
  onNext: () => void;
}) {
  const { isLoaded, playing, error, play, stop, pause } = useSound(file);

  if (!isLoaded) return <Text>Loading...</Text>;

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Button title="Play" onPress={play} />
        <Button title="Pause" onPress={pause} />
        <Button title="Stop" onPress={stop} />
      </View>
      <Button title="Next" onPress={handleNext} />
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
    </View>
  );
}

function StartShow({ onStart: handleStart }: { onStart: () => void }) {
  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <Button title="Start Show" onPress={handleStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
});
