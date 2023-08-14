import { useFonts } from "expo-font";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RootScreenProps } from "../navigation";

export default function Home({ navigation }: RootScreenProps<"home">) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardHeading}>👋 Welcome</Text>
        <Text>
          Afterburner is an interactive component for live performances.
        </Text>
        <Text>
          Providing auto cues and information to the audience as they experience
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    padding: 24,
  },
  card: {
    backgroundColor: "#e9e9e9",
    borderRadius: 32,
    padding: 24,
    gap: 16,
  },
  cardHeading: {
    fontSize: 32,
    fontFamily: "Nimbus sans",
    alignContent: "center",
  },
});
