import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import useSound from "../../../sound/sound";
import { ANDERSON_LOCALIZATION_FILES } from "../../../static";

export default function Show({ route, navigation }: ShowScreenProps<"show">) {
  const { showId } = route.params;
  invariant(showId, "`showId` is required");

  const { isLoaded, playing, error, play, stop, pause } = useSound(
    ANDERSON_LOCALIZATION_FILES["track-1"]
  );

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 16 }}>
        <Button title="Play" onPress={play} />
        <Button title="Pause" onPress={pause} />
        <Button title="Stop" onPress={stop} />
      </View>
      {playing ? <Text>Playing</Text> : <Text>Not Playing</Text>}
      {error && <Text>Error: {JSON.stringify(error)}</Text>}
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
