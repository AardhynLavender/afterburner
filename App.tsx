import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import useSound from "./sound/sound";

const SOUND_FILE = require("./assets/audio/theAndersonLocalization/Track-1.wav");

export default function App() {
  const { isLoaded, playing, error, play, stop, pause } = useSound(SOUND_FILE);

  return (
    <View style={styles.container}>
      {isLoaded ? <Text>File Loaded</Text> : <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error.message}</Text>}
      <View style={styles.buttonGroup}>
        <Button title="Play" onPress={play} disabled={!isLoaded || playing} />
        <Button
          title="Pause"
          onPress={pause}
          disabled={!isLoaded || !playing}
        />
        <Button title="Stop" onPress={stop} disabled={!isLoaded || !playing} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 32,
    justifyContent: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 16,
  },
  error: { color: "red" },
  success: { color: "blue" },
});
