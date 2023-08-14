import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { invariant } from "../../../exception/invariant";
import { ShowScreenProps } from "../../../navigation";
import useSound from "../../../sound/sound";

// todo: store these in a bucket somewhere
// const SOUND_FILE = require("./assets/audio/theAndersonLocalization/Track-1.mp3");
const ANDERSON_LOCALIZATION_FILES = {
  "track-1": require("../../../assets/audio/theAndersonLocalization/Track-1.mp3"),
  "track-2a": require("../../../assets/audio/theAndersonLocalization/Track-2a.mp3"),
  "track-2b": require("../../../assets/audio/theAndersonLocalization/Track-2b.mp3"),
  "track-3": require("../../../assets/audio/theAndersonLocalization/Track-3.mp3"),
  "track-4": require("../../../assets/audio/theAndersonLocalization/Track-4.mp3"),
  "track-5a": require("../../../assets/audio/theAndersonLocalization/Track-5a.mp3"),
  "track-5b": require("../../../assets/audio/theAndersonLocalization/Track-5b.mp3"),
  "track-6": require("../../../assets/audio/theAndersonLocalization/Track-6.mp3"),
  "track-7": require("../../../assets/audio/theAndersonLocalization/Track-7.mp3"),
  "track-8": require("../../../assets/audio/theAndersonLocalization/Track-8.mp3"),
  "track-9": require("../../../assets/audio/theAndersonLocalization/Track-9.mp3"),
  "track-9a": require("../../../assets/audio/theAndersonLocalization/Track-9a.mp3"),
};

export default function Show({ route, navigation }: ShowScreenProps<"show">) {
  const { showId } = route.params;
  invariant(showId, "`showId` is required");

  const { isLoaded, playing, error, play, stop, pause } = useSound(
    ANDERSON_LOCALIZATION_FILES["track-1"]
  );

  return (
    <View style={styles.container}>
      <Text>Show `{showId}`</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
